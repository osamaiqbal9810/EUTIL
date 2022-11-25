var fs = require('fs-extra');
const rl = require('readline-sync');
var tar = require('tar');
var path = require('path');
// const { deploy, runShellCmd, findFileRecursive } = require('deploy-toolkit');
const { NodeSSH } = require('node-ssh');
const { showFiles } = require('./common');
// const { upload } = require('deploy-toolkit/dist/ssh/upload');
// const ssh = new NodeSSH();

const connections = [{
    host:'timpstest1.eastus.cloudapp.azure.com',
    username: 'azureuser',
    privateKey:'D:\\Projects\\TIMPS\\Deployment\\timpstest1OnPS19\\timpstest1.pem'
}];

/**
 * 
 * 
 */
const uploadSteps = [
    {
        id:'Make temporary directory',
        type: 'execCommand',
        command: 'mkdir temp', 
        cwd: '/home/azureuser'
    },
    {
        id: 'Upload files to server',
        type: 'putFiles',
        filesList: [{local: './app.js', remote: 'temp/app.js'},
                    {local: './common.js', remote: 'temp/common.js'},
                    {local: './databaseFunctions.js', remote: 'temp/databaseFunctions.js'},
                    {local: './deploymentFunctions.js', remote: 'temp/deploymentFunctions.js'},
                    {local: './menu.js', remote: 'temp/menu.js'},
                    {local: './remoteFunctions.js', remote: 'temp/remoteFunctions.js'},
                    {local: './package.json', remote: 'temp/package.json'}
                ],
        source: './',
        destination: '~/temp'
    },
    {
        id:'npm install',
        type: 'execCommand',
        command: 'npm install', 
        cwd: '/home/azureuser/temp'
    },
    {
        id:'Backup database',
        type: 'execCommand',
        command: 'node app --option=1 --dbname \'test\'', 
        cwd: '/home/azureuser/temp'
    },
    {
        id:'Remove temporary directory',
        type: 'execCommand',
        command: 'echo rm -rf temp', 
        cwd: '/home/azureuser'
    }
];

// var config = {
//     ssh: {      
//     },
//     log: true,
//     cmds:[]
// };

module.exports.deployOnRemoteServers = async function ( ) {
    try{
    console.log('Remote deploy');
    
    let ssh = await connectSSH(connections[0]);
    
    if(!ssh) {
        console.log('Connection failed.');
    } else {
    console.log('Connection established.');
    await executeSteps(ssh, uploadSteps);
    }

    // await ssh.putFiles(uploadSteps).then(function() {
    //     console.log("The File thing is done")
    //   }

    // await inputConnectionFile();
    // const ssh = await connectSSH(connections[0]);
    // if(ssh) {
    //     let results = await executeSteps(backupDatabaseSteps);
    //     console.table(resultes);
    // }
    // // const ssh = new NodeSSH();
    // // await ssh.connect({ host: '', username: '', privateKey: ''});
    // // const result = await ssh.execCommand('', {cwd: '/datadrive/lamp'});
    // // console.log('STDOUT: ', result.stdout);
    // // console.log('STDERR: ', result.stderr);
    }
    catch(err) {
        console.log('Error:', err);
    }
}
module.exports.backupRemoteDatabase = async function( ){

}

module.exports.backupRemoteData = async function( ) {

}
module.exports.backupRemoteDiagLog = async function() {

}

async function inputConnectionFile() {
    let connectionsPath = path.normalize(path.join(__dirname,'/connections/'));
    await showFiles(connectionsPath, (f)=>{return f.endsWith('.json')});

    let connectionFile = rl.question('Please enter the connection filename:');
    console.log('connection:', connectionFile);
}

async function connectSSH(connectionConfig) {
    const ssh = new NodeSSH();
    try{
            await ssh.connect({ host:connectionConfig.host, username: connectionConfig.username, privateKey: connectionConfig.privateKey });
    }
    catch(err) {
        console.log('Connection error:', err);
        return null;
    }

    return ssh;
}
async function executeSteps(ssh, steps) {

    for( let i=0; i<steps.length; i++ ) {
        let result='', step = steps[i];
        switch(step.type) {
            case 'execCommand':
                result = await ssh.execCommand(step.command,{cwd: step.cwd});
            break;
            case 'putFiles':
                result = await ssh.putFiles(step.filesList);
            break;
            case 'putDirectory':
                result = await ssh.putDirectory(step.localDirectory, step.remoteDirectory);
            break;
            case 'getFile':
                result = await ssh.getFile(step.localFile, step.remoteFile);
            break;
            case 'getDirectory':
                result = await ssh.getDirectory(step.localPath, step.remotePath);
            break;
            default:
                console.log('Unknown step type.');
        }
        console.log('Step: ', step.id );
        if(result && result.stdout) console.log(result.stdout);
        if(result && result.stderr) console.log(result.stderr);
              
    }
}