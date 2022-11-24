import testSchedulesModel from "../../../timps/api/testSchedules/testSchedules.model";
import assetTestModel from "../../../api/AssetTests/assetTests.model";
module.exports = {
  async up() {
    console.log("Update database: add assetTest title field in Test Schedules executions");
    let testSchedules = await testSchedulesModel.find({ $or: [{ title: null }, { title: "" }] }).exec();
    if (testSchedules && testSchedules.length > 0) {
      for (let execution of testSchedules) {
        let aTest = await assetTestModel.findOne({ testCode: execution.testCode, assetId: execution.assetId }).exec();
        if (aTest) {
          execution.title = aTest.title;
          await execution.save();
        }
      }
    }
  },
};
