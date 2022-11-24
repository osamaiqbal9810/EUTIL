let ServiceLocator = require("../framework/servicelocator");

export default class VersionCompatibilityService
{
    constructor(logger)
    {
        this.logger = logger;
    }
    loadCustomerDataFile()
    {
        let utils = ServiceLocator.resolve('utils');
        let customerData = utils.loadJson('contract.json');
        
        return customerData ? customerData:{};
    }
    async validateDatabase()
    {
        // read customer contract file for customer name and application type
        // compare customer name  and application type in database
        // if matched return true otherwise false and detailed message
    let customerData = this.loadCustomerDataFile();
    let detailedMessage;
    if(!customerData)
    {
        detailedMessage = 'Customer data file empty or not found. Make sure you have contract.json';
        console.log(detailedMessage);
        this.logger.error(detailedMessage);
        return false;
    }

    let ignoreCompatibility = customerData.ignoreDatabaseCompatibility;
    if(ignoreCompatibility)
    {
        console.log('Ignore database compatibility flag true.');
        console.log('Database compatibility will still be performed but application will continue.');
        this.logger.warn('Ignore database compatibility flag true. Database compatibility will still be performed but application will continue.');
    }
        
    let ApplicationLookupsModel = ServiceLocator.resolve('ApplicationLookupsModel');
    let dbCustomerData = await ApplicationLookupsModel.findOne({listName:"Customer", code:"Customer-00"});

    if(!dbCustomerData)
    {
        detailedMessage = 'Customer data not found in database. Please make sure the database is valid.';
        console.log(detailedMessage);
        this.logger.error(detailedMessage);
        
        if(ignoreCompatibility)        
        {
            return true;
        }

        return false;
    }

    if(customerData.customerName !== dbCustomerData.opt1.name)
    {
        detailedMessage = 'Database is not compatible with this company. Please make sure the database is valid.';
        console.log(detailedMessage);
        this.logger.error(detailedMessage);
        
        if(ignoreCompatibility)        
        {
            return true;
        }

        return false;
    }

    if(customerData.applicationType !== dbCustomerData.opt1.applicationType)
    {
        detailedMessage = 'Database is not compatible with this application type. Please make sure the database is valid';
        console.log(detailedMessage);
        this.logger.error(detailedMessage);
        if(ignoreCompatibility)        
        {
            return true;
        }
        return false;
    }
    
    return true;
    }


}