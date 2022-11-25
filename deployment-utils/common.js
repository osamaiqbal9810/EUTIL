var fs = require('fs-extra');

module.exports.showFiles = async function (filePath, filterFunction=(f)=>{return f;}) {
    try{
    let files = await fs.readdir(filePath);
    files = files.filter(filterFunction);
    console.table(files);
    }
    catch(err) {
        console.log('Error:', err);
    }
}