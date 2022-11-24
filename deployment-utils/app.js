//const fse = require('fs-extra');
const displayMenu = require('./menu');
const makeDeploymentImage = require('./deploymentFunctions').makeDeploymentImage;
const deploy = require('./deploymentFunctions').deploy;
const backupDatabase = require('./databaseFunctions').backupDatabase;
const restoreDatabase = require('./databaseFunctions').restoreDatabase;
const deleteDatabase = require('./databaseFunctions').deleteDatabase;
const deleteFolder = require('./deploymentFunctions').deleteFolder;
const backupApplicationData = require('./deploymentFunctions').backupApplicationData;
const backupDiagnosticsLog = require('./deploymentFunctions').backupDiagnosticsLog;

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
                {item:"Seed{not implemented}", submenu:[
                    {item:"update old database{not implemented}", func:updateolddatabase}]}];

displayMenu(mainMenu);

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


