import testSchedulesModel from "../../../../timps/api/testSchedules/testSchedules.model";

module.exports = {
  async apply() {
    let testSchedules = await testSchedulesModel.find().exec();
    for (let form of testSchedules) {
      if (form.formData && form.formData.length > 0) {
        let OuiIndex = _.findIndex(form.formData, { id: "yes" });
        if (OuiIndex > -1 && form.formData[OuiIndex].value == "true") {
          form.completed = true;
          await form.save();
        }
      }
    }
  },
};
