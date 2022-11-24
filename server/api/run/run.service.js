let ServiceLocator = require("../../framework/servicelocator");
export default class RunService {
  async getRuns(lineId, user) {
    let resultObj = {},
      runModel = ServiceLocator.resolve("RunModel"),
      runList;
    try {
      //runlist = runModel.find({ runLine: lineId });
      let criteria = {};
      let assetService = ServiceLocator.resolve("AssetsService");

      let assetIds = await assetService.getFilteredAssetsIds(user, { plannable: true }, true);
      criteria.runLineID = { $in: assetIds.assetIds };
      runList = await runModel.find({ isRemoved: false, ...criteria }).exec();
      resultObj = { value: runList, status: 200 };
    } catch (error) {
      resultObj = { errorVal: error, status: error.status };
    }
    return resultObj;
  }
  async getLineRun(lineId) {
    let resultObj = {},
      runModel = ServiceLocator.resolve("RunModel"),
      runList;
    try {
      //runlist = runModel.find({ runLine: lineId });
      runList = await runModel.find({ runLineID: lineId, isRemoved: false }).exec();
      resultObj = { value: runList, status: 200 };
    } catch (error) {
      resultObj = { errorVal: error, status: error.status };
    }
    return resultObj;
  }
  async findSingleRun(id) {
    let resultObj = {},
      runModel = ServiceLocator.resolve("RunModel"),
      runSingle;
    try {
      runSingle = await runModel.findById(id).exec();
      resultObj = { value: runSingle, status: 200 };
    } catch (error) {
      resultObj = { errorVal: error, status: error.status };
    }
    return resultObj;
  }
  async createRun(run) {
    let resultObj = {},
      runModel = ServiceLocator.resolve("RunModel"),
      runNew,
      savedRun;
    try {
      runNew = new runModel(run);
      savedRun = await runNew.save();
      resultObj = { value: savedRun, status: 200 };
    } catch (error) {
      resultObj = { errorVal: error, status: error.status };
    }
    return resultObj;
  }

  async createRunRange(run_id, runRange) {
    let resultObj = {},
      runModel = ServiceLocator.resolve("RunModel"),
      runUpdated,
      savedRun;
    try {
      let run = await runModel.findById(run_id).exec();
      if (run) {
        run.runRange.push(runRange);
        run.markModified("runRange");

        let updatedRun = await run.save();
        resultObj = { value: updatedRun, status: 200 };
      } else {
        resultObj = { errorVal: "Run Not Found", status: 400 };
      }
    } catch (error) {
      console.log("Error In createRange : " + error);
      resultObj = { errorVal: error, status: error.status };
    }
    return resultObj;
  }
  async updateRunRange(runId, rangeId, rangeDataToUpdate) {
    let resultObj = {},
      runModel = ServiceLocator.resolve("RunModel"),
      runUpdated,
      savedRun;
    try {
      let run = await runModel.findById(runId).exec();
      if (run) {
        //run.runRange.push(runRange);
        let index = -1;
        let range = run.runRange.find((r, i) => {
          index = i;
          return r.id === rangeId;
        });
        if (index == -1 || !range) {
          resultObj = { errorVal: "Id:" + rangeId + " range not found", status: 400 };
        } else {
          let r = Object.assign(run.runRange[index], rangeDataToUpdate);
          // r.geoJsonCord = rangeDataToUpdate.geoJsonCord;
          // r.start = rangeDataToUpdate.start;
          // r.end = rangeDataToUpdate.end;
          // r.mpStart = rangeDataToUpdate.mpStart;
          // r.mpEnd = rangeDataToUpdate.mpEnd;
          run.runRange[index] = r;

          run.markModified("runRange");
          let updatedRun = await run.save();

          let workPlanTemplateService = ServiceLocator.resolve("WorkPlanTemplateService");
          await workPlanTemplateService.updateWorkplanTemplatesForRunRange(updatedRun.runRange[index]);

          resultObj = { value: updatedRun, status: 200 };
        }
      } else {
        resultObj = { errorVal: "Run Not Found", status: 400 };
      }
    } catch (error) {
      console.log("run.service.updateRunRange.catch" + error);
      resultObj = { errorVal: error, status: error.status };
    }
    return resultObj;
  }

  async getLineRuns() {
    let resultObj = {},
      runModel = ServiceLocator.resolve("RunModel"),
      runList;
    try {
      runList = await runModel.find({}).exec();
      resultObj = { value: runList, status: 200 };
    } catch (error) {
      resultObj = { errorVal: error, status: error.status };
    }
    return resultObj;
  }
}
