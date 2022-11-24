let ServiceLocator = require('../../framework/servicelocator');

exports.show = async function (req, res, next) {
    let versionService = ServiceLocator.resolve("VersionService");
    let result = await versionService.getVersionInfo();
    if(result.errorVal)
    {
       handleError(res, err);
    }
    else
    {
        res.status(result.status)
        res.json(result.value);
    }
};

function handleError(res, err) {
    res.status(500);
    return res.send(err);
}