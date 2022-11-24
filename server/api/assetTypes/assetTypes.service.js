let ServiceLocator = require("../../framework/servicelocator");
class AssetsTypeService {
  constructor() {
    this.AssetTypesModel = ServiceLocator.resolve("AssetTypesModel");
    this.logger = ServiceLocator.resolve("logger");
  }

  async get_AssetTypes() {
    let resultObj = {};
    try {
      let assetTypes = await this.AssetTypesModel.find().exec();
      resultObj = { value: assetTypes, status: 200 };
    } catch (error) {
      resultObj = { errorVal: error, status: 500 };
      this.logger.error("get_AssetTypes : " + error);
    }
    return resultObj;
  }

  async update_assetTypes(form) {
    let resultObj = {};

    try {
      let assetTypeToUpdate = await this.AssetTypesModel.findOne({ _id: form._id }).exec();

      if (form.formType === "Add") {
        let typeOfField = typeof assetTypeToUpdate[form.fieldToUpdate];

        if (typeOfField === 'object' && Array.isArray(assetTypeToUpdate[form.fieldToUpdate])) {
          assetTypeToUpdate[form.fieldToUpdate].push({ ...form.formData });
        } else if (typeOfField === 'object') {
          assetTypeToUpdate[form.fieldToUpdate] = { ...assetTypeToUpdate[form.fieldToUpdate], ...form.formData };
        }
    
        assetTypeToUpdate.markModified(form.fieldToUpdate);
      }

      let savedAssetType = await assetTypeToUpdate.save();

      // let query = { _id: form._id };
      // let savedAssetType = await this.AssetTypesModel.findOneAndUpdate(query, assetTypeToUpdate, {
      //     upsert: true,
      // }).exec();

      resultObj = { value: savedAssetType, status: 200 };
    } catch (error) {
      resultObj = { errorVal: error, status: 500 };
      this.logger.error("get_AssetTypes : " + error);
    }

    return resultObj;
  }

  async create_assetTypes(form) {
    let resultObj = { value: "Ok", status: 200 };

    let newAssetType = new this.AssetTypesModel(form.assetType);

    try {
      let saveAssetType = await newAssetType.save();

      resultObj = { value: saveAssetType, status: 200 };
    } catch (err) {
      resultObj = { errorVal: err.toString(), status: 500 };
      console.log("maintenance.service.createNewAssetType error:", err.toString());
    }

    return resultObj;
  }
  async getPlannableLocationTypes() {
    let resultObj = {};
    try {
      let assetTypes = await this.AssetTypesModel.find({ $and: [{ location: true }, { plannable: true }] }).exec();
      resultObj = { value: assetTypes, status: 200 };
    } catch (error) {
      resultObj = { errorVal: error, status: 500 };
      this.logger.error("assetTypes.service.getPlannableLocationTypes:" + error);
    }
    return resultObj;
  }
}

export default AssetsTypeService;
