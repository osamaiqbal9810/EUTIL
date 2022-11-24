var parseDomain=require('parse-domain');
module.exports.getTenantId=function(domainName){
    let objDomain=parseDomain(domainName,{customTlds: /localhost|\.local/});
    if(objDomain){
        return objDomain.subdomain;
    }
}