let ServiceLocator = require("../../framework/servicelocator");
let tenantInfo = require("../../utilities/tenantInfo");
import _ from "lodash";
class ApplicationLookupsService {
  async getSubdivisionService(user, listName) {
    let resultObj = {};

    let ApplicationLookupsModel = ServiceLocator.resolve("ApplicationLookupsModel");
    try {
      if (user.subdivision == "" || user.subdivision == "All" || user.isAdmin) {
        let obj = await ApplicationLookupsModel.find({ listName: listName }).exec();

        resultObj.status = 200;
        resultObj.value = obj;
      } else {
        let obj = await ApplicationLookupsModel.find({ listName: listName, description: user.subdivision }).exec();
        resultObj.status = 200;
        resultObj.value = obj;
      }
    } catch (error) {
      resultObj = { errorVal: e, status: 500 };
    }
    return resultObj;
  }
  async setGlobalGeoLoggingOption(globalGeoLogging, hostName) {
    let resultObj = {};
    let ApplicationLookupsModel = ServiceLocator.resolve("ApplicationLookupsModel");
    try {
      if (globalGeoLogging.id) {
        let obj = await ApplicationLookupsModel.findById(globalGeoLogging.id).exec();
        if (obj) {
          obj.opt1 = globalGeoLogging.opt1;
          let savedObj = await obj.save();
          resultObj = { value: savedObj, status: 200 };
        } else {
          resultObj = { errorVal: "Not Found", status: 404 };
        }
      } else {
        delete globalGeoLogging.id;

        let newObj = {
          description: "Global Logging of Geo Location of  User",
          opt1: globalGeoLogging.opt1,
          listName: globalGeoLogging.listName,
        };
        let newApplicationLookups = new ApplicationLookupsModel(newObj);
        let tenantId = tenantInfo.getTenantId(hostName);
        newApplicationLookups.tenantId = tenantId;
        let savedCreatedList = await newApplicationLookups.save();
        resultObj = { value: savedCreatedList, status: 200 };
      }
    } catch (error) {
      resultObj = { errorVal: error, status: 500 };
    }
    return resultObj;
  }
  async addNewDynamicLanguageWord(langWord) {
    let resultObj = {};
    let ApplicationLookupsModel = ServiceLocator.resolve("ApplicationLookupsModel");
    try {
      let langs = await ApplicationLookupsModel.find({
        $or: [{ listName: "DynamicLanguage_en" }, { listName: "DynamicLanguage_es" }, { listName: "DynamicLanguage_fr" }],
      }).exec();
      //console.log(langs)
      for (let DyLang of langs) {
        let langChk = DyLang.listName;
        switch (langChk) {
          case "DynamicLanguage_en":
            DyLang.opt1[langWord.key] = { en: langWord.en };
            break;
          case "DynamicLanguage_es":
            DyLang.opt1[langWord.key] = { es: langWord.es };
            break;
          case "DynamicLanguage_fr":
            DyLang.opt1[langWord.key] = { fr: langWord.fr };
            break;
          default:
            null;
            break;
        }

        DyLang.markModified("opt1");
        let savedLang = await DyLang.save();
        resultObj = { value: "Saved", status: 200 };
      }
    } catch (error) {
      console.log(error);
    }
    return resultObj;
  }
  async editDynamicLanguageWord(langWord) {
    let resultObj = {};
    let ApplicationLookupsModel = ServiceLocator.resolve("ApplicationLookupsModel");
    try {
      let langs = await ApplicationLookupsModel.find({
        $or: [{ listName: "DynamicLanguage_en" }, { listName: "DynamicLanguage_es" }, { listName: "DynamicLanguage_fr" }],
      }).exec();
      //console.log(langs)
      for (let DyLang of langs) {
        let langChk = DyLang.listName;
        switch (langChk) {
          case "DynamicLanguage_en":
            DyLang.opt1[langWord.key] = { en: langWord.en };
            break;
          case "DynamicLanguage_es":
            DyLang.opt1[langWord.key] = { es: langWord.es };
            break;
          case "DynamicLanguage_fr":
            DyLang.opt1[langWord.key] = { fr: langWord.fr };
            break;
          default:
            null;
            break;
        }

        DyLang.markModified("opt1");
        let savedLang = await DyLang.save();
        resultObj = { value: "Edited", status: 200 };
      }
    } catch (error) {
      console.log(error);
    }
    return resultObj;
  }
  async deleteDynamicLanguageWord(langWord) {
    let resultObj = {};
    let ApplicationLookupsModel = ServiceLocator.resolve("ApplicationLookupsModel");
    try {
      let langs = await ApplicationLookupsModel.find({
        $or: [{ listName: "DynamicLanguage_en" }, { listName: "DynamicLanguage_es" }],
      }).exec();
      //console.log(langs)

      for (let DyLang of langs) {
        let langChk = DyLang.listName;
        switch (langChk) {
          case "DynamicLanguage_en":
            delete DyLang.opt1[langWord.key];
            break;
          case "DynamicLanguage_es":
            delete DyLang.opt1[langWord.key];
            break;
          default:
            null;
            break;
        }
        DyLang.markModified("opt1");
        let savedLang = await DyLang.save();
        resultObj = { value: "Deleted", status: 200 };
      }
    } catch (error) {
      console.log(error);
    }
    return resultObj;
  }
  async getLists(liststr) {
    let criteria = {};
    let resultObj = { errorVal: "default", status: 500 };
    let ApplicationLookupsModel = ServiceLocator.resolve("ApplicationLookupsModel");
    let remedialActionHook = ServiceLocator.resolve("RemedialActionListHook");

    try {
      if (liststr && liststr != "") {
        let lists = liststr.split(",");
        if (lists && lists.length) {
          criteria.listName = { $in: lists };
        }
      }

      let applicationlookups = await ApplicationLookupsModel.find(criteria);

      applicationlookups = remedialActionHook.processRequiredLists(applicationlookups); // process this list as required for remedial action

      resultObj = { value: applicationlookups, status: 200 };
    } catch (err) {
      resultObj = { errorVal: err.toString(), status: 500 };
      console.log("applicationlookups.service.getlists.catch", err.toString());
    }
    return resultObj;
  }

  async updateList(id, body) {
    try {
      let ApplicationLookupsModel = ServiceLocator.resolve("ApplicationLookupsModel");
      let remedialActionHook = ServiceLocator.resolve("RemedialActionListHook");
      let AssetTestsService = ServiceLocator.resolve("AssetTestsService");
      if (body.listName === remedialActionHook.getRemedialActionListName()) {
        let result = await remedialActionHook.updateList(body);
        return result;
      }

      let listField = await ApplicationLookupsModel.findOne({ _id: id });
      let beforeUpdate =
        listField.listName == "appForms"
          ? { ...listField, ...{ _doc: { ...listField._doc, opt2: { ...listField.opt2, config: _.cloneDeep(listField.opt2.config) } } } }
          : null;
      if (listField) {
        listField.description = body.description;
        listField.code = body.code;

        if (body.hasOwnProperty("opt1")) {
          listField.opt1 = body.opt1;
          listField.markModified("opt1");
        }
        if (body.hasOwnProperty("opt2")) {
          listField.opt2 = body.opt2;
          listField.markModified("opt2");
        }

        await listField.save();
        if (listField.listName == "appForms" && listField.opt2 && listField.opt2.config) {
          AssetTestsService.linkAssetTest(listField, beforeUpdate._doc, body.assetsList);
        }
        return { status: 200, value: listField };
      }
      return { status: 404, errorVal: "Item not found" };
    } catch (err) {
      console.log("applicationlookups.service.updateList.catch:", err.toString());
      return { status: 500, errorVal: err.toString() };
    }
  }

  async create(req) {
    try {
      let ApplicationLookupsModel = ServiceLocator.resolve("ApplicationLookupsModel");
      let remedialActionHook = ServiceLocator.resolve("RemedialActionListHook");

      if (req.body.applicationlookups.listName === remedialActionHook.getRemedialActionListName()) {
        let result = await remedialActionHook.create(req.body.applicationlookups);
        return result;
      }

      let newApplicationLookups = new ApplicationLookupsModel(req.body.applicationlookups);
      let tenantId = tenantInfo.getTenantId(req.hostname);
      newApplicationLookups.tenantId = tenantId;

      if (!newApplicationLookups.code) {
        let lk1 = await ApplicationLookupsModel.find({ listName: newApplicationLookups.listName }).sort({ code: -1 }).limit(1).exec();
        let code = newApplicationLookups.listName + "-1";

        if (lk1 && lk1.length > 0 && lk1[0] && lk1[0].code) {
          let recode = lk1[0].code.split("-").length > 1 ? lk1[0].code.split("-")[1] : lk1[0].code.split("-");

          if (!isNaN(parseInt(recode))) {
            code = newApplicationLookups.listName + "-" + (parseInt(recode) + 1);
          }
        }

        newApplicationLookups.code = code;
      }

      let newvalue = await newApplicationLookups.save();
      return { status: 200, value: newvalue };
    } catch (err) {
      console.log("applicationlookups.service.create", err.toString());
      return { status: 500, errVal: err.toString() };
    }
  }
  async deleteOne(id, req) {
    try {
      let ApplicationLookupsModel = ServiceLocator.resolve("ApplicationLookupsModel");
      let remedialActionHook = ServiceLocator.resolve("RemedialActionListHook");
      if (id.startsWith(remedialActionHook.idprefix)) {
        // check if its a remedial action list value
        let result = await remedialActionHook.deleteOne(req.body.description);
        return result;
      }

      await ApplicationLookupsModel.deleteOne({ _id: id });
      return { status: 200, value: "" };
    } catch (err) {
      return { status: 500, errorVal: err.toString() };
    }
  }
  async getAssetTypeTests(mode) {
    let ApplicationLookupsModel = ServiceLocator.resolve("ApplicationLookupsModel");
    let resultObj = {};
    try {
      let tests = [];
      if (mode == "noForm") {
        tests = await ApplicationLookupsModel.find({ listName: "appForms", "opt2.config": { $exists: true } }, { opt1: 0 }).exec();
      } else {
        tests = await ApplicationLookupsModel.find({ listName: "appForms", "opt2.config": { $exists: true } }).exec();
      }

      resultObj.value = tests;
      resultObj.status = 200;
    } catch (err) {
      resultObj = { errorVal: err.toString(), status: 500 };
      console.log("applicationlookups.service.getlists.catch", err.toString());
    }
    return resultObj;
  }
}
export default ApplicationLookupsService;
//exports.getSubdivisionService = getSubdivisionService;
