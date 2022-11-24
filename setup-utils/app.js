var fs = require('fs-extra');
const rl = require('readline-sync');
const parseKMZ = require('parse2-kmz');
const path = require('path');
const displayMenu = require('./menu');
const _ = require('lodash');
var turf = require("@turf/turf");
//const math = require('mathjs');
let  routeSolver = require('./routeSolver.js');

const mainMenu=[{item:"Convert kmz File to geojson", func:convertKmzToGeojson},
                {item:"Convert All kmz Files to geojson In a Folder", func:convertKmzToGeojsonFolder},
                {item:"Divide a geojson file into multiple files", func: divideGeoJson},
                {item:"Merge Features and Extract Continuous Lines in file", func: mergeFeatures},
                {item:"Merge Features and Extract Continuous Lines for All Files in a Folder", func: mergeFeaturesInFolder}];

displayMenu(mainMenu);

// This function converts a single file from .kmz to .geojson
//
// It takes filename from user
//
async function convertKmzToGeojson(){
    let sourceFilePath = rl.question('Please enter the filename:');
    await convertToGeoJson(sourceFilePath);
}
// This function converts all .kmz files in a folder to .geojson
// 
// User is prompted for the folder path. It creates a new folder outputgeojson that contains all geojson files
//
async function convertKmzToGeojsonFolder(){
    let sourceFolder = rl.question('Please enter the path to folder containing .kmz files:');
    let outputFolder = path.join(sourceFolder,'\\outputgeojson');

    if(!fs.existsSync(sourceFolder) || fs.statSync(sourceFolder).isFile())
    {
        console.log('Path not found:', sourceFolder);
        return;
    }
    if(fs.existsSync(outputFolder))
    {
        console.log('Output folder already exist. To continue, please remove', outputFolder);
        return;
    }
    fs.ensureDirSync(outputFolder);

    kmsz = fs.readdirSync(sourceFolder);
    kmsz = kmsz.filter(f=>{return f.endsWith(".kmz");});

    for(let file of kmsz)
    {
        console.log('Converting file:', file);
        await convertToGeoJson(path.join(sourceFolder, file), outputFolder);
    }

}

//
// This function breaks apart a geojson file into multiple .geojson files files
// It can break each feature into a different file or can divide based on properties of features
//
async function divideGeoJson(){
    try
    {
    let sourceFilePath = rl.question('Please Enter the Filename:');
    let geoJson = fs.readJSONSync(sourceFilePath);
    let destinationFolder = path.dirname(sourceFilePath);

    if(!geoJson.type || geoJson.type!=="FeatureCollection")
     {
         console.log('No Type or Type is not FeatureCollection');
         return;
     }
     if(!geoJson.features)
     {
         console.log('No Features Array');
         return;
     }
     
     let features = geoJson.features;
     let length = features.length;
     
    console.log('Number of Features:', length);
    if(length)
    {
        let o1 = features[0];
        let o1properties=[];
        if(!o1.properties)
        {
            console.log('No properties found for first object');
        }
        else
        {
            console.log('First Object Properties:', o1.properties);
            o1properties = Object.keys(o1.properties);
        }

        let options=["Each Feature to Separate File","geometry.type[LineString, Point etc.]", ...o1properties];
        let selected = rl.keyInSelect(options, 'Please select which parameter you would like to use for division?');
        let divided = [];
        if(selected===0)
        {
            // divide all features to different file
            console.log('You selected all features:', options[selected]);
            divided = features;
        }
        else if(selected===1)
        {
            console.log('Divide by geometry.type');
            divided = _.groupBy(features, (m)=>{return m.geometry.type});
        }
        else
        {
            console.log('You selected:', options[selected]);
            divided = _.groupBy(features, (m)=>{return m.properties[options[selected]]});
        }
        
        //console.log('divided', divided);
        if(divided && !divided.length)
        {
            keys = Object.keys(divided);
            console.log('Extracted count will be:', keys.length);
            for(let key of keys)
            {
                let json=divided[key];
                let name = key;
                //json.properties && json.properties.name ? json.properties.name:'';
                name += '.geojson';
                name = path.join(destinationFolder, name);

                await saveGeoJsonFile(name, json);
            }
        }
        else if(divided && divided.length)
        {
            console.log('Extracted count will be:', divided.length);
            for(let i=0; i<divided.length; i++)
            {
                let json = divided[i];
                let name = i + '' + json.properties && json.properties.name ? json.properties.name:'';
                
                name = path.join(destinationFolder, name);
                await saveGeoJsonFile(name, json);
            }
        }
    }
    }   
    catch(err)
    {
        console.log('Error caugth:',err);
    }
}

//
//
//
//
async function mergeFeatures()
{
        let sourceFilePath = rl.question('Please Enter the Filename:');
        if(!fs.existsSync(sourceFilePath))
        {
            console.log('Cannot find', sourceFilePath);
            return;
        }
        let destinationFolder = path.dirname(sourceFilePath);
        let outputFileName = rl.question('Please Enter the Output Filename[Enter to Exit]:');
        
        if(outputFileName==="")
         return;

       await mergeFeaturesInFile(sourceFilePath, path.join(destinationFolder, outputFileName));
}
async function mergeFeaturesInFolder()
{
        let sourcePath = rl.question('Please Enter the Path to Folder:');
        if(!fs.existsSync(sourcePath))
        {
            console.log('Cannot find', sourceePath);
            return;
        }

        let destinationFolder = path.join(path.dirname(sourcePath),'merged-output');
        fs.ensureDirSync(destinationFolder);

    filesToConvert = fs.readdirSync(sourcePath);
    filesToConvert = filesToConvert.filter(f=>{return f.endsWith(".geojson");});

    for(let file of filesToConvert)
    {
        let outputFilename = file.split('.')[0] + '-merged.geojson';
        let outputFilePath = path.join(destinationFolder, outputFilename);
        await mergeFeaturesInFile(path.join(sourcePath, file), outputFilePath);
    }
}

async function mergeFeaturesInFile(sourceFilePath, outputFilePath)
{
    try{
        console.log('Merging features in', sourceFilePath);

        let geoJson = fs.readJSONSync(sourceFilePath);
        let joinedCoordinates=[], propertiesToSave=null;

        if(!geoJson.type || geoJson.type!=="FeatureCollection")
        {
            console.log('No Type or Type is not FeatureCollection');
            return;
        }
        if(!geoJson.features)
        {
            console.log('No Features Array');
            return;
        }
        
        let features = geoJson.features;
        let featuresLength = features.length;
        let mergedFeatures=[];

        console.log('Number of Features:', featuresLength);
        if(featuresLength > 1)
        {
            mergedFeatures = routeSolver.extractContinuousRoute(features);
        }
        else
        {
            console.log('Already single feature no way to merge.');
            return;
        }
        
        if(!outputFilePath.endsWith('.geojson'))
         outputFilePath += '.geojson';

        console.log('Saving file...', outputFilePath);
        if(mergedFeatures.length>1)
        {
            console.log('Multiple continuous lines found. Saving in multiple files.');
        }
        
        for(let i=0; i<mergedFeatures.length;i++)
        {
            let numToAppend= i===0 ? '':i+'';
            let pathToSave=outputFilePath;
            if(numToAppend!=='')
            {
                pathToSave = outputFilePath.substring(0, outputFilePath.length-8) + numToAppend + '.geojson';
            }
            
            await saveGeoJsonFileFromCoords(pathToSave, mergedFeatures[i].geometry.coordinates, propertiesToSave);
        }
    }
    catch(err)
    {
        console.log('mergeFeaturesinFile.catch: Error caugth:',err);
    }

}
//
// This function convers a .kmz file to .geojson.
// The filename along with the path is passed as input parameter
//
//
async function convertToGeoJson(sourceFilePath, destinationfolder=null)
{
    if(!destinationfolder)
        destinationfolder = path.dirname(sourceFilePath);

    let sourceFile = path.basename(sourceFilePath);
    if(!sourceFile.endsWith('.kmz'))
    {
        console.log('File must be a .kmz');
        return;
    }
    if(!fs.existsSync(sourceFilePath))
    {
        console.log('File does not exist:', sourceFilePath);
        return;
    } 
    
    let sourceFilename = sourceFile.split('.')[0];
    let destinationFilePath = path.join(destinationfolder, sourceFilename+'.geojson');
    
    if(fs.existsSync(destinationFilePath))
    {
        console.log('File already exists with the name:', destinationFilePath);
        return;
    }
   
    try
    {
    let json = await parseKMZ.toJson(sourceFilePath);    
    fs.writeFileSync(destinationFilePath, JSON.stringify(json), (err)=>{if(err)console.log('error writing file.')});
    console.log('Write file complete:', destinationFilePath);
    }
    catch(err)
    {
        console.log('Error caught:', err);
    }
}


async function saveGeoJsonFileFromCoords(filename, coordinates, properties=null)
{
    let feature = {type:"Feature", geometry:{type:"LineString", coordinates:coordinates}};
    feature = turf.cleanCoords(feature);
    if(properties)
    {
        feature.properties = properties;
    }

    await saveGeoJsonFile(filename, [feature]);
}

//
// This function writes a geojson file to the disk using provided feature and filename
//
//
//
async function saveGeoJsonFile(filename, features)
{
    try{
    if(fs.existsSync(filename))
    {
        console.log('File already exist:', filename);
        return;
    }
    if(!features.length)
    {
        features=[];
    }

    let jsondata={type:"FeatureCollection", features:features};
    fs.writeFileSync(filename, JSON.stringify(jsondata));
    }
    catch(err)   
    {
        console.log('Error caught while writing file:', err);
    }

}











//
// Code Junkyard
//
//
// function addToCoordinates(destination, arrayToAppend, reverse)
// {
//     //destination.push(reverse ? arrayToAppend.reverse(): arrayToAppend);
//     if(reverse)
//     {
//         arrayToAppend.reverse().forEach(element =>{
//                     destination.push(element);
//                     });
//     }
//     else
//     {
//         arrayToAppend.forEach(element => {
//             destination.push(element);
//         });
//     }

//     return destination;
// }
// function getMinimum(array)
// {
//     let min=array[0], index=0;
//     for(let i=1; i<array.length; i++)
//     {
//         if(array[i]<min)
//         {
//             min=array[i];
//             index=i;
//         }
//     }
    
//     return index;
// }
// function printJoinery(featureN1, s1, e1, featureN2, s2, e2, distance)
// {
//     console.log(s1,'====',featureN1,'====',e1,distance,s2,'====', featureN2, '====',e2);
// }
// function getFeatureStats(feature)
// {
//                 let returnValue={bearing: {stdevation:0, median:0, mean: 0, average:0}, start:[0,0,0], end:[0,0,0]};

//                 let o1 = feature.geometry;

//                 if(!o1)
//                 {
//                     console.log('Feature geometry not found');
//                     return returnValue;
//                 }
//                 //console.log('Feature index', fi, 'Geometry type:', o1.type);
//                 if(o1.type==="LineString")
//                 {
//                     coords = o1.coordinates;
//                     if(!coords || !coords.length || coords.length<2)
//                     {
//                         console.log('Coordinates problem in feature, skipping');
//                         return returnValue;
//                     }
//                     returnValue.start = coords[0];
//                     returnValue.end = coords[coords.length-1];
//                     let bearingsArray=[];
//                     for(let i=0;i<coords.length-1;i++)
//                     {
//                         let p0=coords[i], p1=coords[i+1];
//                         let distance = getPointsLength(p0, p1), bearing = getBearing(p0, p1);
//                         //console.log('feature point',i,'and', i+1,'distance', distance,'bearing', bearing);
//                         bearingsArray.push(bearing);
//                     }
//                     returnValue.bearing.stdevation = math.std(bearingsArray);
//                     returnValue.bearing.median = math.median(bearingsArray);
//                     returnValue.bearing.mean = math.mean(bearingsArray);

//                     var k=bearingsArray.reduce(function(a,b){return a+b;});
//                     returnValue.bearing.avg = k/bearingsArray.length; 
//                 }
//                 else
//                 {
//                     console.log('Only LineString type geometry is processed');
//                 }

//     return returnValue;
// }
// async function mergeFeaturesInFile1(sourceFilePath, outputFilePath)
// {
//     try{
//         console.log('Merging features in', sourceFilePath);

//         let geoJson = fs.readJSONSync(sourceFilePath);
//         let joinedCoordinates=[], propertiesToSave=null;

//         if(!geoJson.type || geoJson.type!=="FeatureCollection")
//         {
//             console.log('No Type or Type is not FeatureCollection');
//             return;
//         }
//         if(!geoJson.features)
//         {
//             console.log('No Features Array');
//             return;
//         }
        
//         let features = geoJson.features;
//         let featuresLength = features.length;

//         console.log('Number of Features:', featuresLength);
//         if(featuresLength > 1)
//         {
//             let startEndPoints=[];
            
//             // store the properties of first feature
//             if(features[0].properties)
//                 propertiesToSave = features[0].properties;

//             for(let fi=0; fi<featuresLength; fi++)
//             {
//                 let o1 = features[fi];
//                 let featureStats = getFeatureStats(o1);
                
//                 console.log('Feature',fi+1,'Bearing Info', 'Standard Deviation:', featureStats.bearing.stdevation,'Average:', featureStats.bearing.avg);
                
//                 // see the next feature and find distance between start end points of both
//                 if(fi<featuresLength-1)
//                 {
//                     console.log('Information for joining with the next feature.');
                    
//                     let feature1Stats = getFeatureStats(features[fi+1]);
//                     let distanceList=[getPointsLength(featureStats.end, feature1Stats.start),
//                     getPointsLength(featureStats.end, feature1Stats.end),
//                     getPointsLength(featureStats.start, feature1Stats.start),
//                     getPointsLength(featureStats.start, feature1Stats.end)];

//                     let minIndex = getMinimum(distanceList);

//                     let seq1=['S', 'E'], seq2=['S', 'E'];
                                    
//                     if(minIndex&0x01) seq1=seq1.reverse();
//                     if(minIndex&0x02) seq2=seq2.reverse();

//                     printJoinery(fi, seq1[0], seq1[1], fi+1, seq1[0], seq2[0], distanceList[minIndex]);
                    
//                     joinedCoordinates = addToCoordinates(joinedCoordinates, features[fi].geometry.coordinates, minIndex&0x01);
                    
//                     if(fi==featuresLength-2)
//                      joinedCoordinates = addToCoordinates(joinedCoordinates, features[fi+1].geometry.coordinates, minIndex&0x02);
//                 }
//             }
//         }
//         else
//         {
//             console.log('Already single feature no way to merge.');
//             return;
//         }
//         //console.log('Joined Coords:', joinedCoordinates );
//         //let outputFileName = rl.question('Please Enter the Output Filename[Enter to Exit]:');
//         //if(outputFileName==="")
//         // return;
//         if(!outputFilePath.endsWith('.geojson'))
//          outputFilePath += '.geojson';

//         console.log('Saving file...', outputFilePath);

//         await saveGeoJsonFileFromCoords(outputFilePath, joinedCoordinates, propertiesToSave);
//     }
//     catch(err)
//     {
//         console.log('mergeFeaturesinFile.catch: Error caugth:',err);
//     }
     
// }
// function getPointsLength(p0, p1)
// {
//     //console.log('p0,p1:', p0, p1);
//     let tp0 = turf.point(p0), tp1 = turf.point(p1);
    
//     let distance=turf.distance(tp0, tp1);
//     return distance;
// }
// function getBearing(p0, p1)
// {
//     let tp0 = turf.point(p0), tp1 = turf.point(p1);
//     let bearing=turf.bearing(tp0, tp1);
//     return bearing;
// }
//
//
//
//
//function separateFeatures(){}
