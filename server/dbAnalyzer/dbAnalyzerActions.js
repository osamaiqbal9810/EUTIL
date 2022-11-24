import AssetsModel from "../api/assets/assets.modal";
import AssetsTypeModel from "../api/assetTypes/assetTypes.model";

export const funcs = [
  {
    name: "F0",
    method: analyzePlannableLocationsTimeZone,
  },
];
export async function analyzePlannableLocationsTimeZone(fix) {
  let report = { resultsArray: [] };
  let defaultTimeZone = "America/Chicago";
  try {
    let plannableAtype = await AssetsTypeModel.findOne({ plannable: true, location: true });
    if (plannableAtype) {
      let plannableAssets = await AssetsModel.find({ assetType: plannableAtype.assetType });
      for (let asset of plannableAssets) {
        if (asset.attributes && asset.attributes.timezone && typeof asset.attributes.timezone == "string") {
          report.result = true;
          report.resultsArray.push({ id: asset.id, name: asset.unitId, result: true });
        } else {
          if (fix) {
            !asset.attributes && (asset.attributes = {});
            asset.attributes.timezone = defaultTimeZone;
            asset.markModified("attributes");
            await asset.save();
            report.resultsArray.push({ id: asset.id, name: asset.unitId, result: true, fixed: true });
            report.fixed = true;
            report.result = true;
          } else {
            report.resultsArray.push({ id: asset.id, name: asset.unitId, result: false });
            report.result = false;
          }
        }
      }
    } else {
      console.log("Fatal Error : NO Plannable Asset Type Location Exist");
      report.error = "Fatal Error : NO Plannable Asset Type Location Exist";
    }
  } catch (err) {
    console.log("Error in analyzePlannableLocationsTimeZone : " + err);
    report.error = err;
  }

  return report;
}
