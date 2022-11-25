let ServiceLocator = require("../../framework/servicelocator");
class LostnfoundService {
  constructor() {
    this.LostnfoundModel = ServiceLocator.resolve("LostnfoundModel");
    this.logger = ServiceLocator.resolve("logger");
    // this.validator = ServiceLocator.resolve("ValidationUtils");
  }

  recordObject(source, collection, obj, reason, data0={}, data1={} ) {
    return new Promise((resolve, reject)=>{
        if(!this.validator) 
            this.validator = ServiceLocator.resolve("ValidationUtils");

        if(this.validator.isUndefined(source) || !this.validator.isString(source)) reject('Source is a required string.');
        if(this.validator.isUndefined(collection) || !this.validator.isString(collection)) reject('collection is a required string.');
        if(this.validator.isUndefined(obj) || !this.validator.isObject(obj)) reject('obj must be an object.');
        if(this.validator.isUndefined(reason) || !this.validator.isString(reason)) reject('reason is a required string.');
        
        this.LostnfoundModel.create({
            collectionName : collection,
            source : source,
            reason: reason,
            obj : obj,
            data0 : data0,
            data1 : data1,
        }).then((v)=>{
            resolve(v);
        }).catch((err)=>{reject(err)});
    });
  }
}

export default LostnfoundService;
