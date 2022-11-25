let config = require('../config/environment/index');
// var parseDomain=require('parse-domain');
module.exports.getTenantId=function(domainName){
    /*let objDomain=parseDomain(domainName,{customTlds: /localhost|\.local/});
    if(objDomain){
        return objDomain.subdomain=='' ? config.defaultData.tenant.id : objDomain.subdomain;
    }
    
    return config.defaultData.tenant.id;*/
    return "ps19";
}