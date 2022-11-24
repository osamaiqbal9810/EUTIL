let ServiceLocator = require('../framework/servicelocator');
let fs = require('fs');
let Jimp = require('jimp');

export default class ThumbnailHelper {
    constructor(logger)
    {
        this.logger = logger;
    }

    syncThumbnails(source, destination, options, callback)
    {
        if(!source || !destination) 
        {
            this.logger.error('source and destination paths are required.');
            callback.error('source and destination paths are required.');
            return;
        }
        fs.lstat(source, (err, stat)=>{
            
            if(err || !stat.isDirectory)
            {
                this.logger.error('source must be a directory path: ' + err);
                callback.error('source must be a directory path: ' + err);
                return;
            }
            fs.lstat(destination, (errd, statd)=>{
                if(errd || !statd.isDirectory)
                {
                    this.logger.error('destination must be a directory path: ' + errd);
                    callback.error('destination must be a directory path: ' + errd);
                    return;
                }
                fs.readdir(source, function(err, srcItems) {
                    fs.readdir(destination, function(err, destItems){
                        let thumbsToMake = srcItems.filter(function(itm){
                            let found = destItems.find(function(e){return e==itm;});
                            if(!found)
                            {
                                return true;
                            }
                            
                            return false;
                        });
                        
                        let count = 0;
                        thumbsToMake.forEach((thumb)=>{
                            Jimp.read(source + '/' + thumb, (err, img)=>{
                            if(err)callback.error(err);
                            if(img)
                            {
                              try
                                {
                                img.resize(120, Jimp.AUTO, Jimp.RESIZE_BEZIER)
                                .write(destination + '/' + thumb);
                               }
                              catch(e)
                               {
                                   callback.error(e);
                               }
                            }
                        });
                            if(++count == thumbsToMake.length)
                            {
                            // Loger Not passing correctly to the Class. Server  Crashed on Creating Issue
                            // this.logger.info('success syncing thumbnails');
                                callback.success('success syncing thumbnails');
                            }
                        });

                    });
                });
            });
        });
        }
 
    };



