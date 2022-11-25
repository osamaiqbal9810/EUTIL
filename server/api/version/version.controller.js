let ServiceLocator = require('../../framework/servicelocator');

exports.show = async function (req, res, next) {
    loadVersionInfo(req, res, next);
};
exports.reload = async function (req, res, next) {
   loadVersionInfo(req, res, next, true);
};

const loadVersionInfo = async function(req, res, next, forceReload = false) {
    let versionService = ServiceLocator.resolve("VersionService");
    let result = await versionService.getVersionInfo(forceReload);
    if(result.errorVal)
    {
       handleError(res, err);
    }
    else
    {
        res.status(result.status)
        res.json(result.value);
    }
}

function handleError(res, err) {
    res.status(500);
    return res.send(err);
}