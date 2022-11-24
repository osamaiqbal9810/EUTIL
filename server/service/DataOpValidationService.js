let ServiceLocator = require('../framework/servicelocator');

// dependsOn: SODValidationService
export default class DataOpValidationService {
    constructor(logger)
    {
        this.logger=logger;
    }

    async validatemsgListRequest(reqObj, user)
    {
        let result = {valid: true};

        // SOD logic is discontinued, so following validation is no longer required.
        if(reqObj.hasOwnProperty('listName') && reqObj.listName=='SOD')
        {
        
            console.log('Warning: An app is trying to create SOD, old version, user:' + user.email);
            this.logger.warn('Warning: An app is trying to create SOD, old version, user:' + user.email);
            let sodValidator = ServiceLocator.resolve('SODOpValidator');
            
            result = await sodValidator.validatemsgListRequest(reqObj, user);
        }

        return result;
    }


}
