// const fse = require('fs-extra');
// const path = require('path');
// const shell = require('await-shell');
const arg = require('arg');

const displayMenu = require('./menu');
const makeDeploymentImage = require('./deploymentFunctions').makeDeploymentImage;
const deploy = require('./deploymentFunctions').deploy;
const backupDatabase = require('./databaseFunctions').backupDatabase;
const restoreDatabase = require('./databaseFunctions').restoreDatabase;
const deleteDatabase = require('./databaseFunctions').deleteDatabase;
const deleteFolder = require('./deploymentFunctions').deleteFolder;
const backupApplicationData = require('./deploymentFunctions').backupApplicationData;
const backupDiagnosticsLog = require('./deploymentFunctions').backupDiagnosticsLog;
const {deployOnRemoteServers} = require('./remoteFunctions');

extractDeployment = function()
{
   // console.log('extractDeployment function call');
   console.log('process.env', process.env);
   console.log('cwd', process.cwd());
}
npmInstall = function()
{
    console.log('npm install function call');
}
updateolddatabase = function()
{
    console.log('updateolddatabase function call');
}

const mainMenu=[{item:"Make Deployment Image", func:makeDeploymentImage},
                {item:"Backup database", func: backupDatabase},
                {item:"Restore database", func: restoreDatabase},
                {item:"Delete database", func: deleteDatabase},
                {item:"Deploy",  func:deploy},
                {item:"Delete Folder", func:deleteFolder},
                {item:"Backup Application Data", func: backupApplicationData}, 
                {item:"Backup Diagnostics Log", func: backupDiagnosticsLog},
                {item:"Deploy On Servers(n/a)", func: deployOnRemoteServers},
            ];

if(process.argv.length < 3) {
    displayMenu(mainMenu);
}
else { // un-Attended Mode
    // const choice = parseInt(process.argv[2]);
    try { 
    const args = arg({
        // Types
        '--help': Boolean,
        '--option': Number,
        '--dbname': String,
        '--out': String,
        // '--verbose': arg.COUNT, // Counts the number of times --verbose is passed
        // '--port': Number, // --port <number> or --port=<number>
        // '--name': String, // --name <string> or --name=<string>
        // '--tag': [String], // --tag <string> or --tag=<string>
    
        // Aliases
        '-h': '--help',
        '-o': '--option', 
        '-db': '--dbname',
        '-o': '--out',
    });
    console.log('deployment-utils in unattended mode...');
    const choice = args['--option'];
    if(choice != NaN && choice>=0 && choice<mainMenu.length) {
        // const args = process.argv.filter((v, i)=>{return i>2});
        const func = async () => { 
                try{
                    // console.log('args:', args);
                    await mainMenu[choice].func(args); 
                }
                catch(err) {
                    console.log('error:', err);
                    process.exit(1);
                }
                process.exit(0);
            }
        
        func();
    }
    }
    catch(err) {
    console.log(err.message);
    }
}
// removeDirectory = function(path)
// {
//     try{
//         fse.removeSync(path);
//         console.log('removed', path);
//     }catch(err){
//         console.error(err);
//     }
// }
// copyDirectory = function(source, destination)
// {
//  try{
//     fse.copySync(source, destination);
//     console.log('done copying, ', soruce, 'to', destination);
//  }catch(err){
//      console.error(err);
//  }
// }
// runShellCommand(command, callback)
// {   
//     exec(command,(error, stdout, stderr)=>{
//         if(error)
//         {
//             console.log(`error: ${error.message}`);
//             return;
//         }
//         if(stderr){
//             console.log(`stderr: ${stderr}`);
//             return;
//         }
//         console.log(`stdout:${stdout}`);
//         callback(stdout);
//     });
// }


