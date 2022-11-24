import fs from 'fs';
export default class logger {
    constructor(config)
    {
        this.display=['ALL'];
        if(config)
        {
            
            if(config.filename)
            {   
                this.filename = config.filename;
                this.logToFile = true;
            }
            else
            {
                this.logToFile = false;
            }

            if(config.display)
                this.display = config.display;
        }        
        
        this.displayAll = this.display.includes('ALL');
        if(!this.displayAll)
        {
            this.displayLog = this.display.includes('LOG');
            this.displayInfo = this.display.includes('INFO');
            this.displayDebug = this.display.includes('DEBUG');
            this.displayError = this.display.includes('ERROR');
            this.displayWarn = this.display.includes('WARN');
        }
        
        this.log=this.log.bind(this);
        this.info=this.info.bind(this);
        this.debug=this.debug.bind(this);
        this.error=this.error.bind(this);
        this.warning=this.warning.bind(this);
        
    }
    log(message)
    {
        if(this.displayAll || this.displayLog)
            this.displayMessage('LOG', message);
        
        this.writeToStream('LOG', message);
    }
    info(message)
    {
        if(this.displayAll || this.displayInfo)
            this.displayMessage('INFO', message);

        this.writeToStream('INFO', message);
    }
    debug(message)
    {
        if(this.displayAll || this.displayDebug)
            this.displayMessage('DEBUG', message);
        
        this.writeToStream('DEBUG', message);
    }
    error(message)
    {
        if(this.displayAll || this.displayError)
            this.displayMessage('ERROR', message);
    
        this.writeToStream('ERROR', message);    
    }
    warning(message)
    {
        if(this.displayAll || this.displayWarn)
            this.displayMessage('WARN', message);
        
        this.writeToStream('LOG', message);
    }
    formatMessage(messageType, message)
    {
        return ("[" + new Date().toLocaleTimeString() + "] "+ messageType+"    "+ message);
    }
    displayMessage(messageType, message)
    {
        console.log(this.formatMessage(messageType, message));
    }
    writeToStream(messageType, message)
    {
        if(this.logToFile)
        {
            this.logStream = fs.createWriteStream(this.filename, {flags: 'a'});
            this.logStream.write(this.formatMessage(messageType, message)+'\n');
            this.logStream.close();
        }
    }
};