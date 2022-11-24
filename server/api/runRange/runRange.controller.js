let ServiceLocator = require("../../framework/servicelocator");
var turf = require("@turf/turf");
function getUnitOfMeasurements(lineAsset) {
  let uom = "miles";
  if (
    lineAsset &&
    lineAsset.systemAttributes &&
    lineAsset.systemAttributes.milepostUnit &&
    lineAsset.systemAttributes.milepostUnit.value &&
    typeof lineAsset.systemAttributes.milepostUnit.value === "string"
  ) {
    uom = lineAsset.systemAttributes.milepostUnit.value;
  }
  return uom;
}
exports.create = async function(req, res, next) {
  let RunService = ServiceLocator.resolve("LineRunService");
  let AssetsModel = ServiceLocator.resolve("AssetsModel");
  let utils = ServiceLocator.resolve("utils");

  let resultObj = {};
  try {
    let lineId = req.body.runDetail.range.lineId;
    let mpStart = utils.toFixed(+req.body.runDetail.range.mpStart);
    let mpEnd = utils.toFixed(+req.body.runDetail.range.mpEnd);

    let range = { geoJsonCord: "", start: "", end: "" };
    range = Object.assign(range, req.body.runDetail.range);

    let line = await AssetsModel.findById(req.body.runDetail.range.lineId);
    let geoJsonCord = JSON.parse(line.attributes.geoJsonCord);
    let uom = getUnitOfMeasurements(line);

    // console.log(geoJsonCord);
    let lineGeodata = turf.lineString(geoJsonCord.features[0].geometry.coordinates, { name: "line 1" });

    if (line.start <= mpStart) mpStart -= line.start;
    else console.log("runRange.controller.create: error: start milepost is less than start of plannable location"); // error log todo

    if (line.start <= mpEnd) mpEnd -= line.start;
    else console.log("runRange.controller.create: error: end milepost is less than start of plannable location"); // error log todo

    // if mpStart and and mpEnd are 0 , it causes error that coordinates must be an array of two or more posiitons
    range.geoJsonCord = turf.lineSliceAlong(lineGeodata, mpStart, mpEnd, { units: uom });
    range.start = turf.along(lineGeodata, mpStart, { units: uom });
    range.end = turf.along(lineGeodata, mpEnd, { units: uom });
    if (req.body.runDetail.run_id) {
      resultObj = await RunService.createRunRange(req.body.runDetail.run_id, range);
    } else {
      range.lineName = line.unitId;
      range.runDescription = range.runId;
      let getLineRuns = await RunService.getLineRun(line._id);
      console.log(getLineRuns);
      if (getLineRuns && getLineRuns.value.length > 0) {
        resultObj = await RunService.createRunRange(getLineRuns.value[0]._id, range);
      } else {
        let run = {
          runLineID: line._id,
          runName: line.unitId,
          runId: line.unitId,
          runLineName: line.unitId,
          lineStart: line.start,
          lineEnd: line.end,
        };
        let runCreated = await RunService.createRun(run);
        if (!runCreated.errorVal) {
          resultObj = await RunService.createRunRange(runCreated.value._id, range);
        } else {
          resultObj.status = runCreated.status;
          resultObj.errorVal = runCreated.errorVal;
        }
      }
    }
  } catch (err) {
    console.log(err);
    resultObj.errorVal = err.toString();
  }

  if (resultObj.errorVal) {
    //return res.send(resultObj.errorVal);
    resultObj.value = resultObj.errorVal;
  }

  res.status(200);
  res.json(resultObj.value);
};

exports.update = async function(req, res, next) {
  let RunService = ServiceLocator.resolve("LineRunService");
  let AssetsModel = ServiceLocator.resolve("AssetsModel");
  let utils = ServiceLocator.resolve("utils");

  let resultObj = {};
  try {
    let lineId = req.body.runDetail.range.lineId;
    let mpStart = utils.toFixed(+req.body.runDetail.range.mpStart);
    let mpEnd = utils.toFixed(+req.body.runDetail.range.mpEnd);
    let range = { geoJsonCord: "", start: mpStart, end: mpEnd };
    range = Object.assign(range, req.body.runDetail.range);

    let line = await AssetsModel.findById(req.body.runDetail.range.lineId);
    let geoJsonCord = JSON.parse(line.attributes.geoJsonCord);
    let lineGeodata = turf.lineString(geoJsonCord.features[0].geometry.coordinates, { name: "line 1" });
    let uom = getUnitOfMeasurements(line);
    // if mpStart and and mpEnd are 0 , it causes error that coordinates must be an array of two or more posiitons
    mpEnd -= mpStart; // substract start offset to make the ranges 0 based lengths
    mpStart = 0;

    range.geoJsonCord = turf.lineSliceAlong(lineGeodata, mpStart, mpEnd, { units: uom });
    range.start = turf.along(lineGeodata, mpStart, { units: uom });
    range.end = turf.along(lineGeodata, mpEnd, { units: uom });

    resultObj = await RunService.updateRunRange(req.body.runDetail.run_id, req.params.id, range);
  } catch (err) {
    console.log("runRange.controller.update.catch", err);
    resultObj.errorVal = err.toString();
  }

  if (resultObj.errorVal) {
    //return res.send(resultObj.errorVal);
    resultObj.value = resultObj.errorVal;
  }

  res.status(200);
  res.json(resultObj.value);
};
