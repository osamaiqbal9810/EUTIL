var fsextra = require('fs-extra');
var fs = require('fs');
const path = require('path');
const rl = require('readline-sync');
const shell = require('await-shell');
const MongoClient = require('mongodb').MongoClient;
var tar = require('tar');
const {showFiles} = require('./common');

var mongoPath = "C:\\Program Files\\MongoDB\\Server\\4.0\\bin\\";

async function inputPath(path)
{
    console.log('MongoDB path is:', path);
    let newPath = rl.question('Enter new path if change required(Just enter to use default):');

    if(newPath!=="")
    {
        return newPath;
    }

    return path;
}
async function runCommand(command, cwd, path)
{
    console.log('running command', command, 'path', path);
    try{
        process.env.path+=";"+path;
        global.SHELL_OPTIONS={cwd: cwd, env: process.env, stdio: 'inherit', shell: true};
        await shell(command);
    }
    catch(err)
    {
        console.log('run command, err', err);
        return false;
    }
    return true;
}

async function backupCollection(dbname, name, filename)
{
    // let records = await db.collection(name).find({}).toArray();
    // fsextra.writeFileSync(filename, JSON.stringify(records));
    try{
        let command='mongoexport --collection='+name+' --db='+dbname+' --out='+filename;
        if(!await runCommand(command, process.cwd(), mongoPath))
        {
            console.log('Could not execute mongoexport');
            return;
        }
        console.log('written file', filename);
    }
    catch(err)
    {
        console.log('Error backupCollection', dbname, name, filename, err);
        //return false;
    }

//    return true;
    
}
async function restoreCollection(dbname, name, filename)
{
    try{
    // let data = fsextra.readFileSync(filename);
    // let records = JSON.parse(data);
    // await db.collection(name).insertMany(records);
     let command='mongoimport --collection='+name+' --db='+dbname+' --file='+filename;
        if(!await runCommand(command, process.cwd(), mongoPath))
        {
            console.log('Could not execute mongoimport');
            return;
        }

    console.log('restored collection', name,'from', filename);
    }
    catch(err)
    {
        console.log('Error restoring collection', name, 'from', filename, err);
    }
}
module.exports.backupDatabase = async function backupDatabase(args=null)
{
    let unAttendedMode = false, udbName, outputName=null;
    
    if(args && args['--dbname']) {
        unAttendedMode = true;
        udbName = args['--dbname'];

        if(args['--out']) {
            outputName=args['--out'];
        }
    }
    else if(args!== null)
    {
        console.log('Argument: --dbname or -db is required.');
        return;
    }

    let dbname = unAttendedMode ? udbName: rl.question('Enter the database name:');

    let dirname=new Date().toISOString();
        dirname=dirname.split('T')[0];
        dirname+='-'+dbname;
    
    outputName = outputName ? outputName: dirname;

    if(fsextra.existsSync(outputName))
    {
        console.log(outputName,'already exist. Cannot continue.');
        return;
    }
    try{
        //global.SHELL_OPTIONS={cwd, env:process.env,stdio:'inherit', shell:true};
        //await shell('mongoexport ')
        const client = await MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true })
        .catch(err => { console.log(err); });

        if (!client) {
            console.log('Mongoclient invalid reference. Cannot continue.');
            return;
        }

        const db = client.db(dbname);
        let list = await db.listCollections().toArray();
        let collectionNames = list.map(l=>{return l.name;});
        //console.log('collections in ', dbname, 'are ', collectionNames);
        //console.log(process.env);

        fsextra.ensureDirSync(outputName);
        mongoPath = await findMongo(mongoPath); // inputPath(mongoPath);


        for(let c of collectionNames)
        {
            await backupCollection(dbname, c, './' + outputName + '/' + c + '.json');
        }
        tar.c({gzip: true, file:outputName+'.tar.gz', sync: true}, [outputName]);
        fsextra.removeSync(outputName);
    }
    catch(err)
    {
        console.log('export database err', err);
        return false;
    }
    
    return true;
}
module.exports.restoreDatabase = async function restoreDatabase()
{
    await showFiles(__dirname, (f)=>{return f.endsWith('.tar.gz')});
    
    let filename=rl.question('Enter the backup file name:');
    let dbname = rl.question('Enter the database name:');

    if(!fsextra.existsSync(filename))
    {
        console.log('File', filename,'does not exist, cannot continue.');
        return;
    }
    const client = await MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true })
        .catch(err => { console.log(err); });

        if (!client) {
            console.log('Mongoclient invalid reference. Cannot continue.');
            return;
        }

    const db = client.db(dbname);
    let list = await db.listCollections().toArray();
    if(list && list.length)
    {
        console.log('database', dbname,' already exists. Please delete the database first and retry');
        return;
    }
    
    try{
        tar.x({sync: true, file: filename},[]);
        let extractedFolder=filename.split('.')[0];

        let fileslist = fs.readdirSync(extractedFolder);
        
        mongoPath = await findMongo(mongoPath); // inputPath(mongoPath);

        for(let filename of fileslist)
        {
            if(filename.endsWith('.json'))
            {
                let collectionName=filename.substring(0, filename.length-5);
                await restoreCollection(dbname, collectionName, extractedFolder+"/"+filename);
            }
        }

        fsextra.removeSync(extractedFolder);
    }
    catch(err)
    {
        console.log('restoreDatabase error', err);
    }
}
module.exports.deleteDatabase = async function deleteDatabase()
{
    console.log('WARNING! All data will be removed. Please make backup before deletion.');
    let dbname=rl.question('Enter the database name:[enter to exit]');
    if(dbname==="")
    {
        return;
    }
    try{
    const client = await MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true })
        .catch(err => { console.log(err); });

        if (!client) {
            console.log('Mongoclient invalid reference. Cannot continue.');
            return;
        }

        const db = client.db(dbname);
        let list = await db.listCollections().toArray();
        let collectionNames = list.map(l=>{return l.name;});
        for(let c of collectionNames)
        {
            await db.collection(c).drop();
            console.log('deleted all records from', c);
        }
    }
    catch(err)
    {
        console.log('Error deleting database', err);
    }

}
testCommand = async function (command, filePath) {
    let result=false;
    try{
        process.env.path += ';' + filePath;
        global.SHELL_OPTIONS = {cwd: process.cwd(), env: process.env, stdio: '', shell: true}; // stdio: 'inherit' // to see output on console
        await shell(command);
        result = true;
    }
    catch(err)
    {
        // console.log('testCommand.catch:', err);
        result = false;        
    }
    return result;
}
getFiles = async function(directory) {
    try {
        let entries = fsextra.readdirSync(directory);
        return entries;
    }
    catch(err) {
        
    }
    return [];
}
getMaxVersionNumber = async function (directory) {
    let files = await getFiles(directory);
    if(files.length > 0) {
        let versionNumbers = files.filter((file, index)=>{return parseFloat(file)!==NaN});
        versionNumbers = versionNumbers.sort((a, b)=>{return parseFloat(a)>parseFloat(b);});
        return versionNumbers[0];
    }
    return '';
}
findMongo = async function (defaultPath='') {
    let mongoPath = defaultPath;
    const mongoExportTest = 'mongoexport --help';
    // console.log('Platform:', process.platform);
    let result = await testCommand(mongoExportTest, mongoPath);
    if(!result) {
        if(process.platform==='win32') {
            mongoPath = process.env['ProgramFiles'];
            // console.log('Environment[ProgramFiles], env:', mongoPath);
            if(!mongoPath) {
                mongoPath = 'C:\\Program Files\\MongoDB\\Server\\';
            }
            else mongoPath = path.join(mongoPath, 'MongoDB\\Server');
            
            let maxVer = await getMaxVersionNumber(mongoPath);
            if( maxVer!=='' ) {
                mongoPath = path.join(mongoPath, maxVer, 'bin' );

                if(await testCommand(mongoExportTest, mongoPath)) {
                    console.log('found at:', mongoPath);
                    return mongoPath;
                }                
            }
        }
        console.log('Not found:', mongoPath);
        return '';
    }
    else {
        console.log('Found at default path:', defaultPath);
        return defaultPath;
    }
}