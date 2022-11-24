var fsextra = require('fs-extra');
var fs = require('fs');
const rl = require('readline-sync');
const shell = require('await-shell');
const MongoClient = require('mongodb').MongoClient;
var tar = require('tar');
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
module.exports.backupDatabase = async function backupDatabase()
{
    let dbname = rl.question('Enter the database name:');
    let dirname=new Date().toISOString();
        dirname=dirname.split('T')[0];
        dirname+='-'+dbname;
    if(fsextra.existsSync(dirname))
    {
        console.log(dirname,'already exist. Cannot continue.');
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

        fsextra.ensureDirSync(dirname);
        mongoPath = await inputPath(mongoPath);
        for(let c of collectionNames)
        {
            await backupCollection(dbname, c, './'+dirname+'/'+ c+'.json');
        }
        tar.c({gzip: true, file:dirname+'.tar.gz', sync: true}, [dirname]);
        fsextra.removeSync(dirname);
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
        
        mongoPath = await inputPath(mongoPath);

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