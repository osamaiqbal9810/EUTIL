let ServiceLocator = require('../framework/servicelocator');
export default class DataOpValidationService {
    constructor(logger)
    {
        this.logger = logger;
    
    }
  
    async validatemsgListRequest(reqObj, user)
    {
        let result = { valid: true };
        let criticalCollections = ['user', 'UserGroup', 'Permission'];
        
        if(reqObj && reqObj.hasOwnProperty('listName') && reqObj.listName === 'JourneyPlan') {
            let jpItem = reqObj.optParam1;
            let code = reqObj.code; 
            
            // Check if this is a create document request and a document with same privateKey already exists
            if(( !code || code === "" ) && jpItem && jpItem.privateKey) {
                let jpm = ServiceLocator.resolve("JourneyPlanModel");
                let pks = await jpm.countDocuments({"privateKey": jpItem.privateKey});
                if( pks >= 1 ) {
                    const msg = `DataOpValidationService.validatemsgListRequest.Warning: Duplicate privateKey(${jpItem.privateKey}) received with create new JP`;
                    this.logger.warn(msg);
                    console.log(msg);
                    result.valid = false; // not allowing duplicate JP record creation 
                    let lostnfound = ServiceLocator.resolve('LostnfoundService');
                    await lostnfound.recordObject('DataOpValidationService.validatemsgListRequest',
                        reqObj.listName,
                        jpItem,
                        msg,
                        {user: user.email});
                }
            }
        }
        
        if(reqObj && reqObj.hasOwnProperty('listName') && criticalCollections.includes(reqObj.listName)) {
            const msg = `Not allowing modfication to the critical collection: ${reqObj.listName}`;
            this.logger.error(msg);
            console.log(msg);
            result.valid = false;
            let lostnfound = ServiceLocator.resolve('LostnfoundService');
            await lostnfound.recordObject('DataOpValidationService.validatemsgListRequest',
                reqObj.listName,
                reqObj,
                msg,
                {user: user.email});
        }

        return result;
    }


}
