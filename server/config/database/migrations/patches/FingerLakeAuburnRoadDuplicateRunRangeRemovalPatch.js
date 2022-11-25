import workPlantemplateModal from "../../../../timps/api/wPlanTemplate/wPlanTemplate.model";
import RunModel from "../../../../api/run/run.model";
import _ from "lodash";
var ObjectId = require("mongodb").ObjectID;
module.exports = {
  async apply() {
    console.log("Fingerlakes : Remove duplicate Run Ranges of Auburn Road and enable its parent run for mobile access to it.");
    let template = await workPlantemplateModal.findOne({ _id: ObjectId("5f321d2c7793382ba5490041") }).exec();
    if (template && template.runRanges && template.runRanges.length > 0) {
      let runRangeId = template.runRanges[0].id;
      let runId = template.runRanges[0].runId;
      let run = await RunModel.findOne({ _id: ObjectId(runId) }).exec();
      if (run) {
        run.isRemoved = false;
        let filteredRunRanges = _.filter(run.runRange, { id: runRangeId });
        if (filteredRunRanges && filteredRunRanges.length > 0) {
          for (let rr of run.runRange) {
            let exist = _.find(filteredRunRanges, { runId: rr.runId });
            if (!exist) filteredRunRanges.push(rr);
          }
          run.runRange = filteredRunRanges;
          run.markModified("runRange");
          await run.save();
          console.log("run range duplication removal executed Succesfully");
        }
      }
    } else {
      console.log("Template not found for patch");
    }
  },
};
