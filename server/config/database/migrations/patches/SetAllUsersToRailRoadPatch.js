import AssetsModel from "../../../../api/assets/assets.modal";
import userModel from "../../../../api/user/user.model";

module.exports = {
  async apply() {
    let railRoad = await AssetsModel.findOne({ parentAsset: null }).exec();
    if (railRoad) {
      let users = await userModel.find().exec();
      for (let user of users) {
        user.assignedLocation = railRoad._id;
        user.assignedLocationName = railRoad.unitId;
        await user.save();
      }
    }
  },
};
