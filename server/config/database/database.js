var _ = require("lodash");
let UserGroup = require("../../api/userGroup/userGroup.model");
let GroupPermission = require("../../api/permission/permission.model");
let Tenant = require("../../api/tenant/tenant.model");
let User = require("../../api/user/user.model");
let config = require("../environment/index");
let ListModel = require("../../api/list/list.model");
let ApplicationLookupsModel = require("../../api/ApplicationLookups/ApplicationLookups.model");
let SODModel = require("../../api/SOD/SOD.model");

let AssetModel = require("../../api/assets/assets.modal");
let JourneyPlanModel = require("../../timps/api/journeyPlan/journeyPlan.model");
let WorkPlanTemplateModel = require("../../timps/api/wPlanTemplate/wPlanTemplate.model");
let Maintenance = require("../../api/Maintenance/Maintenance.model");
let AssetsTypeModel = require("../../api/assetTypes/assetTypes.model.js");
let ServiceLocator = require("../../framework/servicelocator");
let RunModel = require("../../api/run/run.model");

import { addSEPTAData } from "./Septa-Location";
import { addMinneapolisData } from "./Minneapolis-Data";
import { railRoadLocationsTemplate, YardTrack } from "../../template/railRoadLocationsTemplate";
import { permissionsToAdd, inspectorPermissions } from "./permissionRoles";
import { RioTinto } from "./RioTronto/RioTinto-Location";
import { LampAttributes } from "../../template/assetTypeAttributes";

import { addIfNotExist, renameField, update, UpdateOrAddIfNotExist } from "./dbFunctions/dbHelperMethods";
import { dbAnalyzerMethod } from "../../dbAnalyzer/dbAnalyzerMethod";
import { defectCodes } from "./defectCodes";
import { trackInspForm, inspectionInstructions } from "../../template/assetTypeAttributes";
import { addConfigurations, updateConfigurations } from "./configurations/configurations";
import {
  createApplicationLookups,
  updateApplicationLookups,
  deleteApplicationLookups,
  addApplookupIfNotExist,
} from "./configurations/applicationlookupslist";
import { setAssetTypesToInspectable, setAssetTypesDisplayNameProperty, removeRailsAssetType } from "./dbFunctions/assetTypesChangesOct2020";
import { removeAssetTypesForIOC, addIOCMissingAssetTypes } from "./dbFunctions/IOCMissingAssetTypes";
import { guid } from "../../utilities/UUID";

//import {addFerromexAssets} from "../../utilities/FerromexAssets";
//import { addLampAssetsForNHSLT1, trackAssetPopulateNSHL, lampNHSLAssets } from "../../utilities/nhslTracksAssetPopulate";

let appAccessService = ServiceLocator.resolve("AppAccessService");
//Assigning the word that if defect code contain such word then it will update the whole object
let defectToFind = "trainig";

async function createDatabase() {
  let configApplicationType = config.applicationType || "",
    configUpdateDatabaseForApplicationType = config.updateDatabaseForApplicationType || false,
    configUpdateOldDatabase = config.updateOldDatabase || false,
    configUpdateConfigurations = config.updateConfigurations || false,
    configUpdateApplicationLookups = config.updateApplicationLookups || false,
    configAddConfigurations = config.addConfigurations || false,
    configCreateNewDatabase = config.createNewDatabase || false,
    configNewDatabaseAppName = config.newDatabaseAppName || "",
    configAddIOCalphanumericMarkersList = config.addIOCaplphanumericMarkersList || false,
    runRangeOptimizationJPlansAndTemplates = config.runRangeOptimizationJPlansAndTemplates || false;

  // Essential Colllections
  await createTenant();
  await createPermissions();
  await createUserGroups();
  await createUsers();

  // Operational Essentials
  await createApplicationLookups(configApplicationType);
  await createListsForApp();
  await updateExistingDBLocationAssetTypeAttribute(false);
  await addConfigurations(configAddConfigurations);

  // Operational Contract Specific Data
  //await createAssetTypes();
  if (configCreateNewDatabase) await createAssets(configNewDatabaseAppName);

  await appAccessService.initializeDbOperation();
  // await createWorkplanTemplates();
  // await createJourneyPlans();
  // await createRuns();
  // await createMaintenances();

  await updateOldDatabase(configUpdateOldDatabase);
  await updatePermissionsOfUserGroups(configUpdateDatabaseForApplicationType);
  await updateConfigurations(configUpdateDatabaseForApplicationType, configApplicationType); // call this with true to hide required configs. second param: App name for which configs needs to be set, SCIM for scim app; TIMPS for timps app

  await updateAssetTypesMakeTrackLowestInspectable(false);
  let assetsTreeService = ServiceLocator.resolve("AssetsTreeService");
  await assetsTreeService.createHierarchyTree();
  await dbAnalyzerMethod(false, false);

  await addCWRTrackAssetType(false);
  await updateInspectionFrequenciesTemplates(false);

  await setAssetTypesToInspectable(configUpdateDatabaseForApplicationType, configApplicationType); // TIMPS or SCIM as second argument
  await setAssetTypesDisplayNameProperty(false);
  await removeRailsAssetType(configUpdateDatabaseForApplicationType);

  // delete unwanted application lookups
  if (configUpdateApplicationLookups) {
    await deleteApplicationLookups([
      { listName: "appForms", code: "form3" },
      { listName: "appForms", code: "form4" },
      { listName: "remedialAction", code: "trackOOS" },
      { listName: "remedialAction", code: "temporaryFix" },
      { listName: "remedialAction", code: "slowOrderApplied" },
      { listName: "remedialAction", code: "fixed" },
    ]); // this will delete appForms that are no longer required
  }

  await updateApplicationLookupsPrev(configUpdateApplicationLookups, configApplicationType);
  await removeAssetTypesForIOC(configUpdateDatabaseForApplicationType);
  await addIOCMissingAssetTypes(configUpdateDatabaseForApplicationType);
  await addMissingIssueIdsInJourneyPlans(false);
  await addYardTrackAssetTypesNonMilepost(false);

  if (configAddIOCalphanumericMarkersList) {
    await addApplookupIfNotExist([{ listName: "alphaNumericMilepostIOC", code: "alphaNumericMilepostIOC" }]);
  }

  await removeRunsFromTemplatesAndJPs(runRangeOptimizationJPlansAndTemplates);
}

module.exports.createDatabase = createDatabase;

async function createTenant() {
  await addIfNotExist(
    Tenant,
    { tenantId: "ps19" },
    {
      active: true,
      isDefault: true,
      tenantId: "ps19",
      name: "Powersoft19 Rail Group",
    },
  );
}
async function createPermissions() {
  for (const per of permissionsToAdd) {
    await addIfNotExist(GroupPermission, per, per);
  }
}

async function createUserGroups() {
  let permissions = await GroupPermission.find({}).exec(); // get all permissions
  let permissionAry = _.map(permissions, item => item._id);
  let inspectorPermissionArray = [];
  for (let perm of permissions) {
    if (_.find(inspectorPermissions, { name: perm.name })) {
      inspectorPermissionArray.push(perm._id);
    }
  }
  let groupsToAdd = [
    {
      group_id: config.defaultData.adminGroup.id,
      name: config.defaultData.adminGroup.desc,
      permissions: permissionAry,
      isAdmin: true,
      level: 0,
      category: "Role",
    },
    // { group_id: "manager", name: "Management", permissions: permissionAry, isAdmin: false, level: 1 },
    // { group_id: "supervisor", name: "Track Manager", permissions: permissionAry, isAdmin: false, level: 2 },
    // { group_id: "inspector", name: "Inspection Team", permissions: inspectorPermissionArray, isAdmin: false, level: 3 },
    // { group_id: "maintenance", name: "Maintenance Team", permissions: inspectorPermissionArray, isAdmin: false, level: 3 },
  ];

  for (const grp of groupsToAdd) {
    await UpdateOrAddIfNotExist(UserGroup, grp, grp, { group_id: grp.group_id });
  }
}
async function createUsers() {
  let tenantId = "ps19";
  let username = "admin";
  let email = "admin@timps.com";
  let adminUG = await UserGroup.findOne({ isAdmin: true });
  if (!adminUG) {
    console.log("error: createDatabase: createUsers: cannot find admin user group");
    return;
  }
  let usersToAdd = [
    {
      name: username,
      tenantId: tenantId,
      email: email,
      password: "admin",
      isAdmin: true,
      userGroup: adminUG._id,
      group_id: adminUG.group_id,
      genericEmail: "admin2@timps.com",
      department: "administration",
      mobile: "+1455555645",
    },
  ];

  for (const usr of usersToAdd) {
    await addIfNotExist(User, { email: email }, usr);
  }
}

async function createListsForApp() {
  await addIfNotExist(
    ListModel,
    { listName: "user", tenantId: "ps19" },
    {
      listName: "user",
      settings: '{"criteria": {"email": "<useremail>"}, "fieldMap":{"code":"email", "description": "name"}}',
      owner: null,
      tenantId: "ps19",
    },
  );
}

async function createAssets(template = "") {
  if (template == "railroad") {
    await railRoadLocationsTemplate();
  } else if (template == "septa") {
    await addSEPTAData();
  } else if (template == "minneapolis") {
    await addMinneapolisData();
  } else if (template == "ferromex") {
    await addFerromexAssets();
  } else if (template == "RioTinto") {
    await RioTinto();
  }
}
async function addCWRTrackAssetType(execute) {
  if (!execute) return;
  let cwrTrack = {
    assetType: "CWR Track",
    assetTypeClassify: "linear",
    lampAttributes: LampAttributes["track"],
    timpsAttributes: { code: "0032", description: "CWR Track" },
    //defectCodes: defectCodes,
    inspectionInstructions: inspectionInstructions,
    //inspectionForms: trackInspForm,
    plannable: false,
    inspectable: true,
    location: false,
    defectCodesObj: defectCodes,
    inspectionFormsObj: JSON.parse(trackInspForm),
    allowedAssetTypes: ["rail", "3rd Rail", "Switch", "Crossing", "Signal", "Station"],
  };

  await addIfNotExist(AssetsTypeModel, { assetType: cwrTrack.assetType }, cwrTrack);
  // add this asset type to the possible children of all locations that have parent
  let criteria = { $and: [{ location: true }, { parentAssetType: { $exists: true, $ne: null } }] };

  let allLocations = await AssetsTypeModel.find(criteria);
  if (allLocations && allLocations.length) {
    for (let a of allLocations) {
      if (a.allowedAssetTypes && a.allowedAssetTypes.length && !a.allowedAssetTypes.includes(cwrTrack.assetType)) {
        a.allowedAssetTypes.push(cwrTrack.assetType);
        a.markModified("allowedAssetTypes");
        await a.save();
      }
    }
  }
}

async function updatePermissionsOfUserGroups(execute) {
  if (execute) {
    let permissions = await GroupPermission.find({}).exec(); // get all permissions
    let permissionAry = _.map(permissions, item => item._id);
    let inspectorPermissionArray = [];
    for (let perm of permissions) {
      if (_.find(inspectorPermissions, { name: perm.name })) {
        inspectorPermissionArray.push(perm._id);
      }
    }
    await update(UserGroup, { group_id: "supervisor" }, "permissions", permissionAry); // update permissions
    await update(UserGroup, { group_id: "manager" }, "permissions", permissionAry); // update permissions
    await update(UserGroup, { group_id: "admin" }, "permissions", permissionAry); // update permissions
    await update(UserGroup, { group_id: "supervisor", name: "Road Master" }, "name", "Track Manager"); // change supervisor's name, from t 'Road Master' to 'Track Manager'
    await update(UserGroup, { group_id: "inspector" }, "permissions", inspectorPermissionArray);
    await update(UserGroup, { group_id: "maintenance" }, "permissions", inspectorPermissionArray);
  }
}

async function updateOldDatabase(execute) {
  if (!execute) return;

  console.log("Executing update Old Database Function");
  //await renameField(Maintenance, {}, { mwoNumber: "mrNumber" }); // no longer required as there is no older databases in the field
  // let permissions = await GroupPermission.find({}).exec(); // get all permissions
  // let permissionAry = _.map(permissions, (item) => item._id);
  // let inspectorPermissionArray = [];
  // for (let perm of permissions) {
  //   if (_.find(inspectorPermissions, { name: perm.name })) {
  //     inspectorPermissionArray.push(perm._id);
  //   }
  // }
  // await update(UserGroup, { group_id: "supervisor" }, "permissions", permissionAry); // update permissions
  // await update(UserGroup, { group_id: "manager" }, "permissions", permissionAry); // update permissions
  // await update(UserGroup, { group_id: "admin" }, "permissions", permissionAry); // update permissions
  // await update(UserGroup, { group_id: "supervisor", name: "Road Master" }, "name", "Track Manager"); // change supervisor's name, from t 'Road Master' to 'Track Manager'
  // await update(UserGroup, { group_id: "inspector" }, "permissions", inspectorPermissionArray);

  // await updateToAddSubdivisionUsingLineId(Maintenance);
  // await updateToAddSubdivisionUsingLineId(WorkPlanTemplateModel);
  // await updateToAddSubdivisionUsingLineId(JourneyPlanModel);

  await updateToAddMissingField(WorkPlanTemplateModel, "nextInspectionDate", "createdAt");
  await updateToAddMissingField(WorkPlanTemplateModel, "startDate", "createdAt");
  await updateToAddMissingField(WorkPlanTemplateModel, "inspectionFrequency", "dayFreq");
  await updateToAddMissingField(WorkPlanTemplateModel, "inspectionType", "fixed", null, true);

  // Assign all users to assigned location
  let location = await AssetModel.findOne({ parentAsset: null, assetType: "Company" });
  if (location) {
    await updateToAddMissingField(User, "assignedLocation", location._id, null, true);
    await updateToAddMissingField(User, "assignedLocationName", location.unitId, null, true);
  } else {
    console.log("database.js.updateOldDatabase.assignAlluserstoTopLocation: location does not exist");
  }

  // Correct asset's hierarchy to assign track
  let assets2Mod = await AssetModel.find({ $or: [{ assetType: "track" }, { assetType: "Station" }] });
  for (let a1 of assets2Mod) {
    if (!a1.parentAsset || a1.parentAsset === "") {
      a1.parentAsset = a1.lineId;
      await a1.save();
      console.log("Updated asset", a1.unitId, "to have parentAsset");
    }
  }

  // Remove "trackType" and "class" from track asset "attributes" field
  // Rename "trackNumber" to "Local Track Name"
  // Rename "trackOrientation" to "railOrientation" and switch it's value EW to NS and vice-versa

  // get all track assets with required attributes
  let or1 = {},
    or2 = {};
  or1["assetType"] = "track";
  or1["attributes.trackType"] = { $exists: true };
  or2["assetType"] = "track";
  or2["attributes.trackOrientation"] = { $exists: true };
  let criteria = { $or: [or1, or2] };

  let trackAssetsWithAttributes = await AssetModel.find(criteria);
  for (let a1 of trackAssetsWithAttributes) {
    if (a1.attributes) {
      let dirty = false;

      if (a1.attributes.trackType) {
        delete a1.attributes.trackType;
        dirty = true;
      }

      if (a1.attributes.class) {
        delete a1.attributes.class;
        dirty = true;
      }

      if (a1.attributes.trackNumber) {
        a1.attributes["Local Track Name"] = a1.attributes.trackNumber;
        delete a1.attributes.trackNumber;
        dirty = true;
      }

      if (a1.attributes.trackOrientation) {
        a1.attributes["railOrientation"] = a1.attributes.trackOrientation == "NS" ? "EW" : "NS";
        delete a1.attributes.trackOrientation;
        dirty = true;
      }

      if (dirty) {
        a1.markModified("attributes");
        await a1.save();
        console.log("Updated asset", a1.unitId, " to rename trackNumber to LocalTrackName and delete trackType and class attributes");
      }
    }
  }
  // change in existing assetTypes collection
  criteria = { assetType: "track" };
  let assettypesToMod = await AssetsTypeModel.find(criteria);

  if (assettypesToMod && assettypesToMod[0]) {
    let dirty = false;
    if (assettypesToMod[0].lampAttributes && assettypesToMod[0].lampAttributes.length) {
      let e = assettypesToMod[0].lampAttributes.findIndex(a => {
        return a.name === "trackType";
      });
      if (e > -1) {
        assettypesToMod[0].lampAttributes.splice(e, 1);
        dirty = true;
      }
      e = assettypesToMod[0].lampAttributes.findIndex(a => {
        return a.name === "class";
      });
      if (e > -1) {
        assettypesToMod[0].lampAttributes.splice(e, 1);
        dirty = true;
      }

      e = assettypesToMod[0].lampAttributes.findIndex(a => {
        return a.name === "railOrientation";
      });
      if (e === -1) {
        assettypesToMod[0].lampAttributes.push({ name: "railOrientation", order: 1 });
        dirty = true;
      }

      let item = assettypesToMod[0].lampAttributes.find(a => {
        return a.name === "trackNumber";
      });
      if (item) {
        item.name = "Local Track Name";
        item.order = 2;
        dirty = true;
      }

      item = assettypesToMod[0].lampAttributes.find(a => {
        return a.name === "Local Track Name" && a.order === 1;
      });
      if (item) {
        item.order = 2;
        dirty = true;
      }
    }
    if (dirty) {
      assettypesToMod[0].markModified("lampAttributes");
      await assettypesToMod[0].save();
      console.log("Updated assetType track to adjust fields");
    }
  }

  // update defectCodes in all asset types where it doesn't match
  criteria = { defectCodesObj: { $exists: true, $ne: null } };
  assettypesToMod = await AssetsTypeModel.find(criteria);
  if (assettypesToMod && assettypesToMod.length) {
    for (let at of assettypesToMod) {
      // update defect codes if required, currently checking the first element and updating.
      if (JSON.stringify(at.defectCodesObj).search(defectToFind) !== -1) {
        at.defectCodesObj = defectCodes;
        at.markModified("defectCodesObj");
        if (at.defectCodes) {
          at.defectCodes = defectCodes;
          at.markModified("defectCodes");
        }
        console.log("Updated assettype", at.assetType, "to have new defect codes.");
        await at.save();
      }
      //Commented the old logic
      /*if (defectCodes.details[0] !== at.defectCodesObj.details[0]) {
          at.defectCodesObj = defectCodes;
          at.markModified("defectCodesObj");

          if(at.defectCodes)
          {  
            at.defectCodes    = defectCodes;
            at.markModified("defectCodes");
          }

          console.log("Updated assettype", at.assetType, "to have new defect codes.");
          await at.save();
        }*/
    }
  }

  // update existing databases where new location scheme doesn't exist
  // activate if following conditions are not fulfilled
  //   exists an attribute named parentAssetType in assettypes collection
  //   exists a Parent Company AssetType that is (location(!plannable), allowedAssetType has 1 location child, )
  //   exists child of parent (Company) that has 2 further children and one of parent or child must be 'plannable locaiton'
  // upon activation do the following:
  //    find the level of hierarchy exists among assettypes
  //    add missing number of asset types and make them only 'location' (not plannable)
  //    add 'parentAssetType' field to make 2 way hierarchy

  criteria = { location: true, $or: [{ parentAssetType: { $exists: false } }, { parentAssetType: null }] };
  let allLocations = await AssetsTypeModel.find(criteria);
  if (allLocations && allLocations.length) {
    // only move forward if existing db has some locations that doesn't have 'parentAssetType' field
    let childAssetTypes = [];
    //console.log('all locations', allLocations);
    for (let a of allLocations) {
      if (a.allowedAssetTypes && a.allowedAssetTypes.length) {
        //console.log('type', a.assetType, 'children', a.allowedAssetTypes );
        childAssetTypes = childAssetTypes.concat(a.allowedAssetTypes);
      }
    }
    //console.log('all children ats:', childAssetTypes);
    if (childAssetTypes.length) {
      let parentAT = allLocations.find(a => {
        return !childAssetTypes.includes(a.assetType);
      });
      if (parentAT) {
        //console.log('top parent:', parentAT.assetType);
        let depth = findAssetTypeDepth(allLocations, parentAT);
        if (depth > 1 && depth < 4) {
          // add number of missing asset types if depth is less than 4
          let levelsToAdd = 4 - depth;
          let plannableLocation = allLocations.find(a => {
            return a.plannable;
          });
          if (plannableLocation) {
            console.log("Required levels to be added:", levelsToAdd);
            console.log("Plannable Location Asset Type:", plannableLocation.assetType);

            // add parentAssetType parameter
            for (let at of allLocations) {
              let parent = allLocations.find(at1 => {
                return at1.allowedAssetTypes.includes(at.assetType);
              });

              if (parent) at.parentAssetType = parent._id;
              else at.parentAssetType = null;

              at.markModified("parentAssetType");
              await at.save();
            }

            let assetTypeTemplate = {
              assetType: "",
              assetTypeClassify: "point",
              lampAttributes: [],
              timpsAttributes: {},
              defectCodes: [],
              inspectionInstructions: "",
              inspectionForms: "",
              plannable: false,
              inspectable: false,
              menuFilter: false,
              location: true,
              allowedAssetTypes: [],
            };
            if (levelsToAdd == 1) {
              assetTypeTemplate.assetType = "Location Identifier";
              assetTypeTemplate.allowedAssetTypes = plannableLocation.allowedAssetTypes;
              assetTypeTemplate.parentAssetType = plannableLocation._id;
              await AssetsTypeModel.create(assetTypeTemplate);
              console.log("added 1 asset type: ", assetTypeTemplate.assetType);
            }

            if (levelsToAdd == 2) {
              //
              console.log("added 2 asset types");
              assetTypeTemplate.assetType = "Minor Geographical Identifier";
              assetTypeTemplate.allowedAssetTypes = plannableLocation.allowedAssetTypes;
              assetTypeTemplate.parentAssetType = plannableLocation._id;
              let addedAT = await AssetsTypeModel.create(assetTypeTemplate);
              console.log(assetTypeTemplate.assetType);

              assetTypeTemplate.assetType = "Location Identifier";
              assetTypeTemplate.allowedAssetTypes = [...plannableLocation.allowedAssetTypes, "Minor Geographical Identifier"];
              assetTypeTemplate.parentAssetType = addedAT._id;
              await AssetsTypeModel.create(assetTypeTemplate);
              console.log(assetTypeTemplate.assetType);
            }
          } else {
            console.log("Seed.AssetTypeHierarchy.Logic.Error: No plannable location");
          }
        } else if (depth <= 1) console.log("Seed.AssetTypeHierarchy.Logic.Error: asset type depth is <= 1.", depth);
      }
    }
  }
  //else console.log('all location asset types returned 0');

  // See in all plannable locations if there is no primary track then
  //    make the longest track primary

  criteria = { location: true, plannable: true };
  let plannableLocationAssettype = await AssetsTypeModel.find(criteria);
  if (plannableLocationAssettype && plannableLocationAssettype.length && plannableLocationAssettype[0]) {
    let plat = plannableLocationAssettype[0].assetType;
    criteria = { assetType: plat };
    let plannableLocations = await AssetModel.find(criteria);
    if (plannableLocations && plannableLocations.length) {
      for (let pl of plannableLocations) {
        criteria = { assetType: "track", parentAsset: pl._id };
        let trackAssets = await AssetModel.find(criteria);
        if (trackAssets && trackAssets.length) {
          let primaryTrack = trackAssets.find(ta => {
            return ta.attributes && ta.attributes.primaryTrack;
          });
          //console.log(' location', pl.unitId, 'primary track', primaryTrack?primaryTrack.unitId: 'no');
          if (!primaryTrack) {
            console.log("Seed.UpdateOldDatabase No primary track found in", pl.unitId, " setting one");
            let maxLength = 0,
              longest = null;
            for (let ta of trackAssets) {
              let length = ta.end - ta.start;
              if (length > maxLength) {
                maxLength = length;
                longest = ta;
              }
            }

            if (longest && longest._id) {
              longest.attributes["primaryTrack"] = true;
              longest.markModified("attributes");
              await longest.save();
              if (pl.start !== longest.start || pl.end !== longest.end) {
                pl.start = longest.start;
                pl.end = longest.end;
                pl.length = longest.length;
                await pl.save();
              }
            }
          }
        } else console.log("no track asset ");
      }
    } else console.log("no plannable location asset");
  } else console.log("no plannable location asset type");
}

async function updateApplicationLookupsPrev(execute, applicationType) {
  if (execute) {
    await updateApplicationLookups([
      { listName: "resolveIssueRemedialAction", code: "resolveIssuesOnRemedialAction", compare: "opt1" },
      { listName: "remedialAction", code: "01 slowOrderApplied", compare: "opt1" },
      { listName: "appForms", code: "form1", compare: "opt1" },
      { listName: "AppPullList", code: "25", compare: "opt2" },
      { listName: "AppPullList", code: "21", compare: "opt2" },
      { listName: "appForms", code: "frmAnnualSI4QNS", compare: "opt1" },
      { listName: "appForms", code: "frmMonthlySI4QNS", compare: "opt1" },
    ]);

    if (applicationType === "TIMPS") {
      await deleteApplicationLookups([
        { listName: "appForms", code: "formFicheB12" },
        { listName: "appForms", code: "formFicheB24" },
        { listName: "appForms", code: "gi329f" },
        { listName: "appForms", code: "gi334f" },
        { listName: "appForms", code: "scp901f" },
        { listName: "appForms", code: "scp902f" },
        { listName: "appForms", code: "scp907f" },
        { listName: "appForms", code: "suivimargingi335" },
      ]);

      await addApplookupIfNotExist([
        { listName: "appForms", code: "frmSwitchInspection" },
        { listName: "appForms", code: "form1" },
        { listName: "appForms", code: "form2" },
        { listName: "appForms", code: "frmMonthlySI4QNS" },
        { listName: "appForms", code: "frmAnnualSI4QNS" },
      ]);
    } else if (applicationType === "SCIM") {
      await deleteApplicationLookups([
        { listName: "appForms", code: "frmSwitchInspection" },
        { listName: "appForms", code: "form1" },
        { listName: "appForms", code: "form2" },
        { listName: "appForms", code: "frmMonthlySI4QNS" },
        { listName: "appForms", code: "frmAnnualSI4QNS" },
      ]);

      await addApplookupIfNotExist([
        { listName: "appForms", code: "formFicheB12" },
        { listName: "appForms", code: "formFicheB24" },
        { listName: "appForms", code: "gi329f" },
        { listName: "appForms", code: "gi334f" },
        { listName: "appForms", code: "scp901f" },
        { listName: "appForms", code: "scp902f" },
        { listName: "appForms", code: "scp907f" },
        { listName: "appForms", code: "suivimargingi335" },
      ]);
    }
  }
}

// async function updateInspectionAndTemplates() {
//   try {
//     let templates = await WorkPlanTemplateModel.find().exec();
//     for (let temp of templates) {
//       let index = 0;
//       for (let task of temp.tasks) {
//         if (temp.runRanges[index]) {
//           task.runStart = temp.runRanges[index].mpStart;
//           task.runEnd = temp.runRanges[index].mpEnd;
//         }
//         index++;
//       }
//       let inspections = await JourneyPlanModel.find({ workplanTemplateId: temp.id }).exec();

//       for (let inspection of inspections) {
//         let i = 0;
//         for (let task of inspection.tasks) {
//           if (temp.runRanges[i]) {
//             task.runStart = temp.runRanges[i].mpStart;
//             task.runEnd = temp.runRanges[i].mpEnd;
//           }
//           i++;
//         }
//         inspection.markModified("tasks");
//         await inspection.save();
//       }
//       temp.markModified("tasks");
//       await temp.save();
//     }
//   } catch (err) {
//     console.log("err in updateInspectionAndTemplates() : " + err);
//   }
// }
function findAssetTypeDepth(allLocations, parentAT, max = 1) {
  if (parentAT.allowedAssetTypes && parentAT.allowedAssetTypes.length) {
    for (let i = 0; i < parentAT.allowedAssetTypes.length; i++) {
      //console.log('finding ', parentAT.allowedAssetTypes[i]);
      let at = allLocations.find(a => {
        return a.assetType === parentAT.allowedAssetTypes[i];
      });

      if (at) {
        let d = findAssetTypeDepth(allLocations, at, max + 1);
        //console.log('type:', at.assetType, 'depth', d);
        if (d > max) {
          max = d;
        }
      }
      //else console.log('Not found ');
    }
  }

  return max;
}

async function updateToAddSubdivisionUsingLineId(model) {
  await updateToAddMissingField(model, "subdivision", "lineId", getLineSubdivision);
}
async function getLineSubdivision(lineId) {
  try {
    let line = await AssetModel.findOne({ _id: lineId }).exec();
    if (!line || !line.subdivision || line.subdivision === "") {
      // todo: log
      console.log("Error while getting subdivision: lineId:", lineId);
      return "";
    }

    return line.subdivision;
  } catch (err) {
    console.log("maintenance.service.getLineSubdivision.catch:", err.toString());
  }

  return "";
}
async function updateToAddMissingField(model, fieldName, fieldToUse, applyFunction = null, immediate = false) {
  //applyFunction must be async
  try {
    let criteria = {};
    criteria[fieldName] = { $exists: false };

    let records = await model.find(criteria);
    for (let rec of records) {
      if (immediate) rec[fieldName] = fieldToUse;
      else if (applyFunction) rec[fieldName] = await applyFunction(rec[fieldToUse]);
      else rec[fieldName] = rec[fieldToUse];

      rec.markModified(fieldName);
      await rec.save();
      console.log(
        "seed: added missing field: ",
        fieldName,
        rec[fieldName].toString(),
        "to",
        model.modelName,
        "using:",
        fieldToUse,
        "=",
        rec[fieldToUse] ? rec[fieldToUse].toString() : "",
        rec._id.toString(),
      );
    }
  } catch (err) {
    console.log("database.js.updateToAddMissingField.catch", model.modelName, err.toString());
  }
}
async function updateExistingDBLocationAssetTypeAttribute(execute) {
  if (execute) {
    let LocationTypes = await AssetsTypeModel.find({ location: true }).exec();
    let locTypesCountUpdated = 0;
    let locAssetUpdated = 0;
    for (let loc of LocationTypes) {
      if (loc.assetType !== "Company") {
        loc.lampAttributes = LampAttributes.line;
        loc.timpsAttributes = { code: "0001", description: "line" };
        let locationAssets = await AssetModel.find({ assetType: loc.assetType }).exec();
        for (let locAsset of locationAssets) {
          if (!locAsset.attributes) {
            for (let lampKey of loc.lampAttributes) {
              !locAsset.attributes && (locAsset.attributes = {});
              locAsset.attributes[lampKey.name] = "";
            }
            locAssetUpdated++;
          }

          await locAsset.save();
        }
        locTypesCountUpdated++;
        await loc.save();
      }
    }
    console.log(locTypesCountUpdated + " Location Asset Types attributes types updated ");
    console.log(locAssetUpdated + " Location Asset attribute updated ");
  }
}
async function updateAssetTypesMakeTrackLowestInspectable(execute) {
  if (execute) {
    let trackAssetType = await AssetsTypeModel.findOne({ assetType: "track" }).exec();
    if (trackAssetType) {
      for (let allowedTrackItem of trackAssetType.allowedAssetTypes) {
        let aItem = await AssetsTypeModel.findOne({ assetType: allowedTrackItem }).exec();
        if (aItem) {
          aItem.inspectable = false;
          await aItem.save();
          console.log("AssetType " + aItem.assetType + " changed to not inspectable");
        }
      }
    }
  }
}
async function updateInspectionFrequenciesTemplates(execute) {
  let freqObj = {
    freq: 1,
    timeFrame: "Month",
    timeFrameNumber: 1,
    recurNumber: 1,
    recurTimeFrame: "Month",
    maxInterval: 0,
    minDays: 0,
  };
  if (execute) {
    let templates = await WorkPlanTemplateModel.find().exec();
    for (let temps of templates) {
      if (!temps.inspectionFrequencies || temps.inspectionFrequencies.length == 0) {
        let freqObject = { ...freqObj };
        temps.perTime && (freqObject.freq = temps.perTime);
        temps.minDays && (freqObject.minDays = temps.minDays);
        temps.timeFrame && (freqObj.timeFrame = temps.timeFrame);
        temps.timeFrame && (freqObj.recurTimeFrame = temps.timeFrame);
        temps.inspectionFrequencies = [freqObject];
        temps.markModified("inspectionFrequencies");
        await temps.save();
        console.log("updating : ", temps);
      }
    }
  }
}

async function addMissingIssueIdsInJourneyPlans(execute) {
  if (execute) {
    let journeyPlans = await JourneyPlanModel.find({}).exec();

    // Check if journeyPlan array not empty
    if (journeyPlans && journeyPlans.length) {
      for (let jIndex = 0; jIndex < journeyPlans.length; jIndex++) {
        let isUpdateIndex = null;

        // Check if journey plan have tasks
        if (journeyPlans[jIndex].tasks && journeyPlans[jIndex].tasks.length) {
          for (let tIndex = 0; tIndex < journeyPlans[jIndex].tasks.length; tIndex++) {
            // Check if tasks have issues.
            if (journeyPlans[jIndex].tasks[tIndex].issues && journeyPlans[jIndex].tasks[tIndex].issues.length) {
              for (let iIndex = 0; iIndex < journeyPlans[jIndex].tasks[tIndex].issues.length; iIndex++) {
                // Check if issues don't have issues id
                if (!journeyPlans[jIndex].tasks[tIndex].issues[iIndex].issueId) {
                  journeyPlans[jIndex].tasks[tIndex].issues[iIndex].issueId = guid();
                  isUpdateIndex = jIndex;
                }
              }
            }
          }
        }

        // If journey plan to be updated.
        if (isUpdateIndex !== null) {
          journeyPlans[jIndex].markModified("tasks");
          await journeyPlans[jIndex].save();
          isUpdateIndex = null;
          console.log("updating issues of : ", journeyPlans[jIndex]);
        }
      }
    }
  }
}
async function addYardTrackAssetTypesNonMilepost(execute) {
  if (execute) {
    // if yard exist
    let yardAType = await AssetsTypeModel.findOne({ assetType: "Yard", allowedAssetTypes: { $nin: ["Yard Track"] } }).exec();
    if (yardAType) {
      yardAType.allowedAssetTypes.push("Yard Track");
      yardAType.save();
    }
    let plannableLocation = await AssetsTypeModel.findOne({ plannable: true, allowedAssetTypes: { $nin: ["Yard Track"] } }).exec();
    if (plannableLocation) {
      plannableLocation.allowedAssetTypes.push("Yard Track");
      plannableLocation.save();
    }
    await addIfNotExist(AssetsTypeModel, { assetType: "Yard Track" }, YardTrack);
  }
}

// await createWorkplanTemplates();
// await createJourneyPlans();
// await createRuns();
// await createMaintenances();

async function removeRunsFromTemplatesAndJPs(execute) {
  if (execute) {
    let criteria = { "runRanges.geoJsonCord.geometry.coordinates": { $exists: true, $not: { $size: 0 } } };
    //let  workPlans = await WorkPlanTemplateModel.find(criteria).limit(2).exec();
    let workPlans = await WorkPlanTemplateModel.find(criteria).exec();
    let runs = await RunModel.find({}).exec();
    //console.log("Workplans:" + journeyPlans.length);
    if (workPlans && workPlans.length) {
      for (let jIndex = 0; jIndex < workPlans.length; jIndex++) {
        let wPlan = workPlans[jIndex];
        let runRanges = wPlan.runRanges;
        let _runRange = {};
        for (let r1 = 0; r1 < runRanges.length; r1++) {
          let runRange = runRanges[r1];
          let rangeId = runRange.id;
          //let run = await RunModel.findOne({ "runRange.id": rangeId }).exec();
          let _runIndex = _.findIndex(runs, run => _.findIndex(run.runRange, rr => rr.id == rangeId) >= 0);
          let run = _runIndex >= 0 ? runs[_runIndex] : null;
          let runId = run ? run._id.toString() : "";
          //console.log("runId:" + runId);
          _runRange.id = rangeId;
          _runRange.runId = runId;
          runRanges[r1] = _runRange;
          wPlan.markModified("runRanges");
        }
        if (wPlan.tasks.length == 1) {
          if (_runRange) {
            let lineCord = { ..._runRange };
            lineCord.geometry = {
              type: "LineString",
              coordinates: [],
            };
            wPlan.tasks[0].lineCords = lineCord;
            wPlan.markModified("tasks");
          }
        }
        await wPlan.save();
        console.log("template run updated:" + wPlan.title);
      }
    }

    criteria = { "tasks.lineCords.geometry.coordinates": { $exists: true, $not: { $size: 0 } } };
    //let journeyPlans = await WorkPlanTemplateModel.find(criteria).limit(1).exec();
    let journeyPlans = await JourneyPlanModel.find(criteria).exec();
    //let jpTemplate = await WorkPlanTemplateModel.find({}).exec();
    //console.log("Workplans:" + journeyPlans.length);
    if (journeyPlans && journeyPlans.length) {
      for (let jIndex1 = 0; jIndex1 < journeyPlans.length; jIndex1++) {
        let jPlan = journeyPlans[jIndex1];
        let subCriteria = { _id: jPlan.workplanTemplateId };
        let jpTemplate = await WorkPlanTemplateModel.findOne(subCriteria).exec();
        if (jpTemplate) {
          let runRanges = jpTemplate.runRanges;
          if (runRanges && runRanges.length > 0) {
            let runRange = runRanges[0];
            let rangeId = runRange.id;
            let runId = runRange.runId;
            if (jPlan.tasks.length == 1) {
              let lineCords = {
                id: rangeId,
                runId: runId,
                geometry: {
                  type: "LineString",
                  coordinates: [],
                },
              };

              jPlan.tasks[0].lineCords = lineCords;
              jPlan.markModified("tasks");
              await jPlan.save();
              console.log("JPlan lineCords updated:", jPlan.title, jPlan._id.toString());
            }
          }
        }
      }
    }
  }
}
