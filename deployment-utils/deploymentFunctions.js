var fs = require('fs-extra');
const rl = require('readline-sync');
const shell = require('await-shell');
var tar = require('tar');
var path = require('path');
const frontendPath='frontend', serverPath='server';

var timpsPath='./';

async function buildFrontend(path)
{
    try{
        global.SHELL_OPTIONS={cwd:path, env:process.env, stdio:'inherit', shell:true};
        await shell('npm run build');
    }
    catch(err)
    {
        //console.log('build appears to be failed');
        return false;
    }

    return true;
}
// async function exportDatabase(dbname, path)
// {
//     try{
//         global.SHELL_OPTIONS={cwd, env:process.env,stdio:'inherit', shell:true};
//         await shell('mongoexport ')
//     }
//     catch(err)
//     {
//         console.log('export database err', err);
//         return false;
//     }
    
//     return true;
// }

module.exports.makeDeploymentImage = async function makeDeploymentImage()
{
    while(!(fs.existsSync(timpsPath+frontendPath) && fs.existsSync(timpsPath+serverPath)))
    {
        console.log(timpsPath+frontendPath, "or", timpsPath+serverPath," doesn't contain required folders");
        timpsPath = rl.question('Enter the path for timps source code[To exit just press enter]:');
        if(timpsPath==='')
            return;
    }

    let choice = rl.question('Do you want to build frontend first?[Y/N]:');

    if(choice==='Y' || choice==='y')
    {
        let r = await buildFrontend(timpsPath+frontendPath);
        if(!r)
        {
            choice=rl.question('Build appears to be failed, do you want to continue?');
            choice=choice.toUpperCase();
            if(choice!=='Y')
            {
                return;
            }
        }
    }
    let deploymentFileName = rl.question('Please enter the deployment filename:');
    let deploymentBaseName = deploymentFileName.endsWith('.tar.gz') ? deploymentFileName.split('.')[0] : deploymentFileName;
        deploymentFileName = deploymentFileName.endsWith('.tar.gz') ? deploymentFileName : deploymentFileName+'.tar.gz';

    // verify that temporary and output directories doesn't exist
    // create output directory
    // copy frontend build from frontend path
    // copy server from server path except the 'node_modules' folder
    let ouputRoot = outputDir = process.cwd()+ '\\' + deploymentBaseName;

    if(fs.existsSync(outputDir))
    {
        console.log('output directory already exists, please remove:', outputDir, ' and retry.');
        return;
    }

    outputDir=outputDir+'\\lamp';
    fs.ensureDirSync(outputDir);
    console.log('created output directoriy... ', outputDir);

    let inputFrontend=timpsPath+frontendPath;
    let outputFrontend=outputDir+'\\frontend';
    
    fs.copySync(inputFrontend+'\\build', outputFrontend+'\\build');
    console.log('copied frontend files, from', inputFrontend+'\\build', 'to', outputFrontend+'\\build');

    let inputServer = timpsPath+serverPath;
    let outputServer = outputDir+'\\server'

    //fs.ensureDirSync(outputServer);
    // copy all files and folders except node_modules, uploads, .vscode
    fs.copySync(inputServer, outputServer, { filter: (src, dest)=>{
     if(src.includes('node_modules')||src.includes('uploads\\images')||src.includes('uploads\\audio')
        ||src.includes('uploads\\thumbnails')||src.includes('server\\log')||src.includes('.vscode')
        ||src.includes('contract.json'))
        return false;

    return true;
    }});

    console.log('copied server files, from', inputServer, 'to', outputServer);
        
    // choice=rl.question('Would you like to create folder for database?');
    // choice=choice.toUpperCase();
    // if(choice!=='Y')
    // {
    //     return;
    // }

    // let databasename = rl.question('Import from existing db?, enter the db name, or [Enter] to just create empty folder:');
    
    // fs.ensureDirSync(ouputRoot+"\\database");
    // console.log('crreated the folder:', ouputRoot+"\\database");

    // if(databasename==='')
    // {
    //     return;
    // }
    
    // make .tar.gz
    console.log('Compressing to make', deploymentFileName);
    tar.c({sync:true, gzip: true, file:deploymentFileName},[deploymentBaseName]);

    console.log('removing temporary folder', deploymentBaseName);
    fs.removeSync(deploymentBaseName);
}
function checkLampFolder(pathToLookAt)
{
    let files = fs.readdirSync(pathToLookAt);
    if(!files.includes('lamp'))
        return false;

    return true;
}
// function getPreviousFiles(dirpath, filesList)
// {
//     let files = fs.readdirSync(dirpath);
//     filesList = filesList || [];
//     files.forEach(function(file){
//         let listToCheck=['lamp/server/node_modules', 'lamp/server/log', 'lamp/server/uploads/images', 'lamp/server/uploads/audio','lamp/server/uploads/assetDocuments'];
//         let fullPath = dirpath + "/" + file;
//         for(let toCheck of listToCheck)
//         {
//             //console.log('type of fullpath=', typeof fullPath);
//             if(fullPath.includes(toCheck))
//                 return;
//         }

//         if(fs.statSync(fullPath).isDirectory()){
//             filesList = getPreviousFiles(dirpath + "/" + file, filesList);
//         } else{
//             filesList.push(path.join(dirpath, "/", file));
//         }
//     });
//     return filesList;
// }
function removePreviousFiles(pathToRemoveFom)
{
    let serverFilesToSave = ['contract.json', 'node_modules', 'log', 'uploads'];
    let serverPath = path.join(pathToRemoveFom, 'server');
    let frontendPath = path.join(pathToRemoveFom, 'frontend');

    if(!fs.existsSync(serverPath))
    {
        return;
    }
    
    let serverFilesList = fs.readdirSync(serverPath);
    let filesToDelete = [];

    serverFilesList.forEach(item=>{ 
        for(let fc of serverFilesToSave)
        {
            if(item.includes(fc))
             return;
        }
        filesToDelete.push(item);
    });

    for(let fr of filesToDelete)
    {
        fs.removeSync(fr);
    }
    
    fs.removeSync(frontendPath);
    
}
module.exports.deploy = async function()
{
    //let foldersToSave = ['server/contract.json','server/log','server/uploads/images', 'server/uploads/audio','server/uploads/assetDocuments'];
    
    console.log('Deployment file should be a .tar.gz file and should contain folder with file name of .tar.gz');
    let deploymentFile = rl.question('Please enter the deployment filename:');
    if(!fs.existsSync(deploymentFile) || deploymentFile=="")
    {
        console.log('Could not find the specified file:' + deploymentFile);
        return;
    }
    if(!deploymentFile.endsWith('.tar.gz'))
    {
        console.log('The deployment file must be a .tar.gz file');
        return;
    }
    let extractedFolder = deploymentFile.split('.')[0];
    if(fs.existsSync(extractedFolder))
    {
        console.log('The folder/file',extractedFolder, 'already exists. Please delete the previous file and try again');
        return;
    }
 try{
        let destinationFolder = rl.question('Please enter the destination path:');
        if(!fs.existsSync(destinationFolder))
        {
            console.log(destinationFolder,'does not exist, cannot continue');
            return;
        }
        // if(!checkLampFolder(destinationFolder))
        // {
        //     console.log('lamp folder does not exist in', destinationFolder);
        //     let choice=rl.question('Do you still want to continue?[Y/N]');
        //     choice = choice.toUpperCase();
        //     if(choice[0]!=='Y')
        //     {
        //         return;
        //     }
        // }
        let checkResult = await findInstallationLocation(destinationFolder);

        if(checkResult.notFound)
        {
            console.log('Destination path not found.');
            return;
        }
        else if(checkResult.emptyFolder)
        {
            console.log('Empty folder: ', destinationFolder);
            let choice = rl.question('Do you want to continue?[Y/N]');
            choice = choice.toUpperCase();
            if(choice[0]!=='Y')
            {
                return;
            }
        }
        else if(!checkResult.installationExists)
        {
            console.log('No previous installation found at: ', destinationFolder);
            let choice = rl.question('Do you want to continue?[Y/N]');
            choice = choice.toUpperCase();
            if(choice[0]!=='Y')
            {
                return;
            }
        }
        
        if(checkResult.installationExists && destinationFolder!==checkResult.actualPath)
           { 
            console.log('Installation found at: ', checkResult.actualPath);
            let choice = rl.question('Do you want to install at this path?[Y/N]');
            choice = choice.toUpperCase();
            if(choice[0]!=='Y')
            {
                return;
            }
            
            destinationFolder = checkResult.actualPath;
           }

           
           // extract the deployment image
           tar.x({sync: true, file: deploymentFile},[]);

           let res = await findInstallationLocation(extractedFolder);
           let folderToCopyFrom = extractedFolder;
           if(res.notFound) 
           {
               console.log('The extracted archive is empty');
               return;
           }
           else if(res.installationExists && res.actualPath !==extractedFolder)
           {
                folderToCopyFrom = res.actualPath;            
           }
        
        //    // creating directory to backup exising application data
        // let backupFolder='~~deployutilsbackup';
        // fs.ensureDirSync(backupFolder);
        // // copy images and audio before copying
        // for(let index=0; index<foldersToSave.length; ++index)
        // {
        //     let folder = foldersToSave[index];
            
        //     let sourceFolder = destinationFolder;
        //     // if(!destinationFolder.endsWith('/')) sourceFolder+='/';
        //     // sourceFolder += folder;
        //     sourceFolder = path.join(sourceFolder, folder);

        //     console.log('finding', sourceFolder,'for backing up');
        //     if(fs.existsSync(sourceFolder))
        //     {
        //         console.log('backing up', folder, 'from', sourceFolder, 'to',backupFolder+'/'+index);
        //         fs.copySync(sourceFolder, backupFolder+'/'+index);
        //     }
        //     else
        //     {
        //         console.log('could not find', sourceFolder);
        //     }
        // }
        //
        
        
        console.log('removing items from previous installation.');
        removePreviousFiles(destinationFolder);

        //console.log('creating empty folder');
        //fs.ensureDirSync(destinationFolder);

        console.log('starting copying', folderToCopyFrom, 'to', destinationFolder);
        
        fs.copySync(folderToCopyFrom, destinationFolder);
        console.log('copy complete. removing',extractedFolder);
        fs.removeSync(extractedFolder);

    //     for(let index=0; index<foldersToSave.length; ++index)
    //     {
    //         let folder = foldersToSave[index];
    //         let sourceFolder = backupFolder+'/'+index;
    //         let folderToRestore = destinationFolder;
    //         if(!destinationFolder.endsWith('/')) folderToRestore+='/';
    //         folderToRestore += folder;
    //         console.log('finding', sourceFolder,'for restoration');

    //         if(fs.existsSync(sourceFolder))
    //         {
    //             console.log('restoring', folder,'from', sourceFolder,'to', folderToRestore);
    //             fs.copySync(sourceFolder, folderToRestore);
    //         }
    //         else
    //         {
    //             console.log('could not find', sourceFolder);
    //         }
    //     }

    //     console.log('Restore complete, so removing backup.');
    //     fs.removeSync(backupFolder);
    }
    catch(err)
    {
        console.log('deployment error', err);
    }
}

module.exports.deleteFolder = async function()
{
    console.log('The specified folder and all files under it will be deleted.');
    let folderToDelete = rl.question('Please enter folder name to delete[Just enter to exit]:');
    if(!fs.existsSync(folderToDelete) || folderToDelete=="")
    {
        console.log('Could not find the specified folder:' + folderToDelete);
        return;
    }
    try{
    console.log('Removing contents and folder', folderToDelete);
    fs.removeSync(folderToDelete);
    console.log('Removal complete');
    }
    catch(err)
    {
        console.log('deleteFolder error', err);
    }
}
async function backupFolder(foldersToBackup)
{
    let installationPath = rl.question('Please enter the installation path[Just enter to exit]:');

    if(!fs.existsSync(installationPath) || installationPath=="")
    {
        console.log('Could not find the installation folder:'+ installationPath);
        return;
    }
    let backupName = rl.question('Please enter the backup archive name:');
    let backupArchive = backupName.endsWith('.tar.gz') ? backupName : backupName+'.tar.gz';
    backupName = backupName.endsWith('.tar.gz') ? backupName.split('.')[0] : backupName;
    
    if(fs.existsSync(backupName) || fs.existsSync(backupArchive))
    {
        console.log('A folder/file with the name', backupName,'or', backupArchive, 'already exists. Please choose some other name.');
        return;
    }
    try{
            let archiveRequired = false;
            console.log('Creating folder', backupName);
            fs.ensureDirSync(backupName);
            for(let i=0; i<foldersToBackup.length; i++)
            {
                let folder = foldersToBackup[i];
                let fullPath = installationPath;
                if(!installationPath.endsWith('/')) fullPath+='/';
                fullPath += folder;

                let destination = backupName + '/' + folder;
                
                console.log('Creating folder', destination);
                fs.ensureDirSync(destination);
                
                console.log('finding', fullPath, 'for', folder,'in', installationPath);
                if(fs.existsSync(fullPath)){
                    console.log('Backing up', folder);
                    fs.copySync(fullPath, destination);    
                    archiveRequired = true;
                }
                else
                {
                    console.log(fullPath, 'not found.');
                }
            }
            if(archiveRequired)
            {
                console.log('Making archive', backupArchive);
                tar.c({sync:true, gzip: true, file:backupArchive},[backupName]);
                console.log('Archive created.');
            }
            console.log('Deleting temporary backup folder.');
            fs.removeSync(backupName);
    }   
    catch(err)
    {
        console.log('backupFolder.catch:', err);
    }
}
module.exports.backupApplicationData = async function()
{
    let foldersToBackup = ['lamp/server/uploads/images', 'lamp/server/uploads/audio','lamp/server/uploads/assetDocuments'];
    console.log('Backing-up images and audios.');
    await backupFolder(foldersToBackup);
}
module.exports.backupDiagnosticsLog = async function()
{
    let foldersToBackup = ['lamp/server/log'];
    console.log('Backing-up logs.');
    await backupFolder(foldersToBackup);
}

async function findInstallationLocation(requestedPath)
{
    let result = {notFound: true, actualPath:'', installationExists: false, emptyFolder: false};
        
    if(!fs.existsSync(requestedPath) || requestedPath=="")
    {
        result.notFound = true;
        return result;
    }
    
    result.notFound = false;

    let files = fs.readdirSync(requestedPath);
    if(files.includes('server') && files.includes('frontend'))
    {
           result.actualPath = requestedPath; 
           result.installationExists = true;
    }
    else if(files.includes('lamp'))
    {
           let flist = fs.readdirSync(path.join(requestedPath, 'lamp'));
           if(flist.includes('server') && flist.includes('frontend'))
           {
                result.actualPath = path.join(requestedPath, 'lamp');
                result.installationExists = true;
           } 
    }
    else if(files.length===0)
    {
        result.emptyFolder = true;
    }

    return result;
}