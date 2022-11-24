import _ from 'lodash';


export const getFilteredAsset = (assets, assetTypes, keys) => {
        let result = [];

        if (assets) {
            assets.forEach(asset => {
                let assetType = assetTypes.find(at => at.assetType === asset.assetType);

                let isResult = true;

                Object.keys(keys).forEach(key => {
                    isResult = assetType[key] === keys[key] && isResult
                });

                if (isResult) {
                    result.push(_.cloneDeep(asset))
                }

            });
        }


    return result;
};
