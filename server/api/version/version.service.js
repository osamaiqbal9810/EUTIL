let ServiceLocator = require('../../framework/servicelocator');
let version = require("../../config/version");

export default class VersionService {
    constructor(logger)    
    {
        this.logger = logger;
    }
    async getVersionInfo()
    {
        
      let resultObj = {value:{}, status:200};

      try
      {
        let versionInfo={customer:'', applicationType:'', compatibleMobileApps:''}, appearance={displayName:"", logo1:"", logo2:"" }, featuresetList=[];
        let ApplicationLookupsModel = ServiceLocator.resolve('ApplicationLookupsModel');
        let migrationService = ServiceLocator.resolve('MigrationsService');
        let dbCustomerData = await ApplicationLookupsModel.findOne({listName:"Customer", code:"Customer-00"});

        versionInfo.webVersion = version.version;
        versionInfo.migration = version.migration.current;
        versionInfo.database = await migrationService.getLastDBMigration();

        if(dbCustomerData)
        {
            if(dbCustomerData.opt1)
            {
                versionInfo.customer             = dbCustomerData.opt1.name;
                versionInfo.applicationType      = dbCustomerData.opt1.applicationType;
                versionInfo.compatibleMobileApps = dbCustomerData.opt1.compatibleMobileApps.join(',');
                if(dbCustomerData.opt1.appearance)
                {
                    appearance.displayName           = dbCustomerData.opt1.appearance.displayName ?  dbCustomerData.opt1.appearance.displayName : "";
                    appearance.logo1                 = dbCustomerData.opt1.appearance.logo1       ?  dbCustomerData.opt1.appearance.logo1       : "";
                    appearance.logo2                 = dbCustomerData.opt1.appearance.logo2       ?  dbCustomerData.opt1.appearance.logo2       : "";
                }
            }
            if(dbCustomerData.opt2)
            {
                featuresetList                   = dbCustomerData.opt2;
            }
        }
    
        resultObj.value = {versionInfo:versionInfo, appearance:appearance, featuresetList: featuresetList};
    }
    catch(err)
    {
        console.log('version.service.show.catch',err);
        resultObj = {errorVal: err, status: 500};
    }
        
    return resultObj;
    }
}
