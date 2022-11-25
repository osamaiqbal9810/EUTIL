import { getFlatEquipments } from "../../utilities/equpmentTreeUtil";
import { createTestScheduleObj, getTestTitleFromAssetTest } from "../DBService";
var ObjectId = require("mongodb").ObjectID;
export default class EquipmentFormsMethod {
  checkUnitsExists(item) {
    return item && item.optParam1 && item.optParam1.tasks && item.optParam1.tasks[0] && item.optParam1.tasks[0].units;
  }
  equipmentFormEntries(equipmentAsset, fullUnit) {
    if (!equipmentAsset.appFormsEquipment || equipmentAsset.appFormsEquipment.length < 1) return;
    let hashMap = getFlatEquipments(fullUnit.equipments);
    return this.groupEquipmentForms(fullUnit.appFormsEquipment, hashMap);
  }
  groupEquipmentForms(equipmentForms, hashMap) {
    let groupForms = null;
    for (let equipForm of equipmentForms) {
      let copyForm = { ...equipForm };
      if (this.checkEquipFormLink(copyForm)) {
        !groupForms && (groupForms = {});
        this.setEquipmentInEquipForm(hashMap, copyForm);
        !groupForms[copyForm.parentTestCode] && (groupForms[copyForm.parentTestCode] = []);
        groupForms[copyForm.parentTestCode].push(copyForm);
      }
    }
    return groupForms;
  }

  async checkExistInDb(testSchedulesModel, equipFormGroupByParent, parentTestAsset, testFormCode, inspectionData) {
    try {
      let existInDb = await testSchedulesModel.findOne({
        assetId: parentTestAsset.id,
        testCode: testFormCode,
        inspectionId: inspectionData.id,
      });
      if (existInDb) {
        existInDb.childForms = equipFormGroupByParent[testFormCode];
        existInDb.markModified("childForms");
        existInDb.save();
      } else {
        let obj = createTestScheduleObj(inspectionData, { name: "", id: testFormCode, form: [] }, parentTestAsset);
        obj.childForms = equipFormGroupByParent[testFormCode];
        if (!obj.title) {
          obj.title = await getTestTitleFromAssetTest(obj);
        }
        let newTestData = new testSchedulesModel(obj);
        await newTestData.save();
      }
    } catch (err) {
      console.log("err in checkExistInDb EquipmentFormMethods.js", err);
    }
  }

  setEquipmentInEquipForm(hashMap, equipForm) {
    let equipObj = hashMap[equipForm.code] ? { ...hashMap[equipForm.code] } : null;
    if (equipObj) {
      delete equipObj.equipments;
      equipForm["equipment"] = equipObj;
    }
  }
  checkEquipFormLink(equipForm) {
    if (equipForm && equipForm.id && equipForm.parentTestCode) return true;
    else return false;
  }

  async equipFormReplacementForm(equipmentAsset, fullUnit, models, user, jPlanId) {
    if (!equipmentAsset.appFormsEquipment || equipmentAsset.appFormsEquipment.length < 1) return;
    if (!models || !models.assetModel) {
      console.log("Error : Asset model not being received in equipFormReplacementForm.");
      return;
    }
    let replacementForms = equipmentAsset.appFormsEquipment.filter((appForm) => appForm.type === "replacement");

    if (replacementForms && replacementForms.length > 0) {
      let dbUnitAsset = await this.getReplacementAsset(fullUnit.id, models.assetModel);
      if (dbUnitAsset) {
        let versionHistory = [];
        let assetEquipments = [...dbUnitAsset.equipments];
        let hashMap = getFlatEquipments(assetEquipments);
        for (let replaceForm of replacementForms) {
          try {
            if (replaceForm && replaceForm.form && replaceForm.form.length > 0) {
              let equipment = hashMap && hashMap[replaceForm.code];
              if (equipment) {
                this.replaceAttributeOfEquipment(equipment, replaceForm, fullUnit, jPlanId, user, versionHistory);
                // hashMap[replaceForm.code] = orignalEquipment;
                // update version history in asset
                // !dbUnitAsset.equipmentVersionHistory && (dbUnitAsset.equipmentVersionHistory = []);
                // dbUnitAsset.equipmentVersionHistory = [...dbUnitAsset.equipmentVersionHistory, versionHistory];
                // save updated asset with change in equipments in database
                dbUnitAsset.equipments = assetEquipments;
                dbUnitAsset.markModified("equipments");
                await dbUnitAsset.save();

                // update the equipments in the workplans
                await this.updateEquipmentsInWPlans(fullUnit.id, dbUnitAsset.equipments, models && models.wpPlanModel);
              }
            }
          } catch (err) {
            console.log("err in replaceForm loop in equipFormReplacementForm", err);
          }
        }
      }
    }
  }
  replaceAttributeOfEquipment(equipment, replaceForm, fullUnit, jPlanId, user, versionHistory) {
    let orignalEquipment = { ...equipment };
    equipment.attributes && (orignalEquipment.attributes = [...equipment.attributes]);
    let versionEntry = {
      assetId: fullUnit.id,
      jPlanId: jPlanId,
      equipmentId: equipment.id,
      attributes: [],
      prevAttributes: [],
      user: user,
    };
    // replace equipment attribute fields which are changed in replacement form. add a version entry with jPlanId , and equipment id.
    for (let field of replaceForm.form) {
      if (field && field.value) {
        let attrIndex = equipment.attributes.findIndex((attribute) => attribute.key === field.id);
        if (attrIndex > -1) {
          equipment.attributes[attrIndex].value = field.value;
          //version entry
          versionEntry.prevAttributes.push({ key: "Asset ID", value: orignalEquipment.attributes[attrIndex].value });
          versionEntry.attributes.push({ key: "Asset ID", value: field.value });
        }
      }
    }
    if (versionEntry.attributes.length > 0) versionHistory.push(versionEntry);
  }
  async updateEquipmentsInWPlans(assetId, equipments, workPlanModal) {
    if (!workPlanModal) {
      console.log("WPlan model not being receved in updateEquipmentsInWplans");
    }
    let criteria = { isRemoved: false, "tasks.units.id": assetId };
    let toSet = { $set: { "tasks.$[].units.$[unit].equipments": equipments } };
    let arrayFilter = { arrayFilters: [{ "unit.id": assetId }] };
    try {
      await workPlanModal.updateMany(criteria, toSet, arrayFilter);
    } catch (err) {
      console.log("err at assetTestEnableDisableInPlans: ", err);
    }
  }
  async getReplacementAsset(_id, assetModel) {
    let asset = null;
    if (assetModel) {
      asset = await assetModel.findOne({ _id: ObjectId(_id) });
    }
    return asset;
  }
}
// export const equipmentFormMethod = new EquipmentFormsMethod();
