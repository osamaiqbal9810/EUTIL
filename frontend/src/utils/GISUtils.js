import * as turf from "@turf/turf";

export function validateGeoJsonStr(geoJsonStr)
{
try {
        let geoJson = JSON.parse(geoJsonStr);
        return (geoJson.features && geoJson.features.length && geoJson.features[0].geometry 
                && geoJson.features[0].geometry.coordinates && geoJson.features[0].geometry.coordinates.length>0);

    } catch (e) {
        return false;
    }
    return false;
}
export function validateAssetGeoJsonStr(asset)
{
    return asset && asset.attributes && asset.attributes.geoJsonCord && asset.attributes.geoJsonCord!=="" && validateGeoJsonStr(asset.attributes.geoJsonCord);
}
export function getAssetGeoJson(asset)
{
    let defaultCoords = {}; 
    // this.state.geoJsonCord.features[0].geometry.coordinates;
    try
    {
        if (asset && asset.attributes && asset.attributes.geoJsonCord && validateGeoJsonStr(asset.attributes.geoJsonCord))
        {
            let newcord = JSON.parse(asset.attributes.geoJsonCord);
            defaultCoords = newcord;
        }
    }
    catch(err)
    {
      console.log('GISUtils.getAssetGeoJson.catch', err);
    }

    return defaultCoords;
}
export function makeTurfLineString(asset)
{
    let linestring={};
    try{
        linestring = turf.lineString(getGeoJsonCoordinates(getAssetGeoJson(asset)), { name: asset.description ? asset.description : "line 1" });
    }
    catch(err)
    {
        console.log('GISUtils.makeTurfLineString.catch',err);
    }
    return linestring;
}
export function getGeoJsonStrCoordinates(geoJsonStr)
{
    try{
        if(validateGeoJsonStr(geoJsonStr))
        {
            return getGeoJsonCoordinates(JSON.parse(geoJsonStr));
        }
    }
    catch(err)
    {
        console.log('GISUitls.getGeoJsonStrCoordinates.catch', err);
    }
    return [];
}
export function getGeoJsonCoordinates(geoJson)
{
    let coordinates=[];
    try{
         coordinates = geoJson.features[0].geometry.coordinates;
    }
    catch(err)
    {
        console.log('GISUtils.getGeoJsonCoordinates.catch', err);
    }
    return coordinates;
}
export function makeTurfFeatureCollection(geoJson)
{
    let featureCollection={};
    try{
         featureCollection = turf.featureCollection(getGeoJsonCoordinates(geoJson));
    }   
    catch(err)
    {
        console.log('GISUtils.makeTrufFeatures.catch',err);
    }
    return featureCollection;
}
//
// input: geoJson = {features:[{feature: {jsoncoordinates[[lon, lat],[lon, lat]...]}}]}
// output: center[lon, lat]
//
export function calculateCenter(geoJson)
{
    let newcenter=[0,0];
    try{
        newcenter = turf.center(makeTurfFeatureCollection(geoJson));
    }
    catch(err)
    {
      console.log('GISUtils.calculateCenter.catch', err);
    }
    return newcenter;
}