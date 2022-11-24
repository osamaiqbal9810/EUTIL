// "use strict";
// var _ = require("lodash");
// let UserGroup = require("./../api/userGroup/userGroup.model");
// let GroupPermission = require("./../api/permission/permission.model");
// let Tenant = require("./../api/tenant/tenant.model");
// let User = require("./../api/user/user.model");
// let config = require("./environment/index");
// let ListModel = require("./../api/list/list.model");
// let ApplicationLookupsModel = require("./../api/ApplicationLookups/ApplicationLookups.model");
// let SODModel = require("./../api/SOD/SOD.model");
// let AssetTypeModel = require("./../api/assetTypes/assetTypes.model");
// let AssetModel = require("./../api/assets/assets.modal");
// // let JourneyPlanModel = require("./../api/journeyPlan/journeyPlan.model");
// // let WorkPlanTemplateModel = require("./../api/wPlanTemplate/wPlanTemplate.model");
// // let TrackModel = require("./../timps/api/track/track.model");
// //import { jPlanSeedHelper } from "./../utilities/jplanSeedHelper";
// //import { userDemoCreate } from "./../utilities/userDemoData";
// //import { tracks_Transformation_From_KmlJSON_DBTracks } from "./../utilities/data/data";
// import { guid } from "./../utilities/UUID";
// import { getDbTracksCSXSample } from "./../utilities/data/csxTrackFunction";

// import { trackAssetPopulateNSHL, lampNHSLAssets } from "./../utilities/nhslTracksAssetPopulate";
// import { lampT1NHSL } from "./../utilities/data/lampT1NHSL";
// import { dynamicLanguageToDB } from "../dynamicLanguage/languageSeed";
// //import {addtrack1NHSLAssets} from "./../utilities/data/track1NHSL";

// //import {addFerromexAssets} from "./../utilities/FerromexAssets";

// const jPlanSeedHelper = null;
// const userDemoCreate = null;
// const tracks_Transformation_From_KmlJSON_DBTracks = null;
// //const getDbTracksCSXSample = null;
// /*
//  ** input:
//  **            tenant: { tenantId: 'ps19', name:'PowerSoft19', email: 'ajaz_qureshi@hotmail.com', isDefault: true }
//  **
//  */
// async function createNewTenant(tenant) {
//   let tenantId = config.defaultData.tenant.id;
//   let name = config.defaultData.tenant.name;
//   let email = config.defaultData.email;
//   let group_id = config.defaultData.adminGroup.id;
//   let group_desc = config.defaultData.adminGroup.desc;
//   const isDefault = tenant.isDefault;
//   if (!tenant) {
//     return new Error("Please enter tenant information");
//   }
//   if (!isDefault) {
//     tenantId = tenant.tenantId;
//     name = tenant.name;
//     email = tenant.email;
//   }
//   //Check Default Tenant
//   let tenantCount = await Tenant.find({ tenantId: tenantId })
//     .limit(1)
//     .countDocuments()
//     .exec();

//   if (tenantCount === 0) {
//     //Create default tenant record
//     await Tenant.create({
//       tenantId: tenantId,
//       name: name,
//       isDefault: isDefault,
//     });
//     if (isDefault) {
//       //create default permissions
//       let permissionCount = await GroupPermission.find({})
//         .countDocuments()
//         .exec();
//       if (permissionCount === 0) {
//         await GroupPermission.insertMany([
//           { name: "USER VIEW", resource: "USER", action: "view" },
//           { name: "USER READ", resource: "USER", action: "read" },
//           { name: "USER CREATE", resource: "USER", action: "create" },
//           { name: "USER UPDATE", resource: "USER", action: "update" },
//           { name: "USER DELETE", resource: "USER", action: "delete" },
//           {
//             name: "USER GROUP UPDATE",
//             resource: "USER",
//             action: "group_update",
//           },
//           { name: "SETUP PAGE", resource: "SETUP", action: "view" },
//           { name: "TRACK READ", resource: "TRACK", action: "read" },
//           { name: "TRACK CREATE", resource: "TRACK", action: "create" },
//           { name: "TRACK UPDATE", resource: "TRACK", action: "update" },
//           { name: "TRACK DELETE", resource: "TRACK", action: "delete" },
//           { name: "TRACK VIEW", resource: "TRACK", action: "view" },
//           { name: "WORKPLAN READ", resource: "WORKPLAN", action: "read" },
//           { name: "WORKPLAN CREATE", resource: "WORKPLAN", action: "create" },
//           { name: "WORKPLAN UPDATE", resource: "WORKPLAN", action: "update" },
//           { name: "WORKPLAN DELETE", resource: "WORKPLAN", action: "delete" },
//           { name: "WORKPLAN VIEW", resource: "WORKPLAN", action: "view" },
//           { name: "WORKPLAN SORTING", resource: "WORKPLAN", action: "plan_sort" },
//           { name: "ASSETGROUP WORKPLAN CREATE", resource: "TRACK WORKPLAN", action: "create" },
//         ]);
//       }
//       let permissions = await GroupPermission.find({}).exec(); // get all permissions
//       let groupCount = await UserGroup.find({})
//         .limit(1)
//         .countDocuments()
//         .exec();
//       if (groupCount === 0) {
//         //add new Group
//         let permissionAry = _.map(permissions, item => item._id);
//         //console.log(permissionAry);
//         let adminUG = new UserGroup();
//         await UserGroup.create({
//           group_id: group_id,
//           name: group_desc,
//           permissions: permissionAry,
//           isAdmin: true,
//           level: 0,
//         });
//         await UserGroup.create({
//           group_id: "manager",
//           name: "Management",
//           permissions: permissionAry,
//           isAdmin: false,
//           level: 1,
//         });
//         await UserGroup.create({
//           group_id: "supervisor",
//           name: "Supervision",
//           permissions: permissionAry,
//           isAdmin: false,
//           level: 2,
//         });
//         await UserGroup.create({
//           group_id: "inspector",
//           name: "Inspection Team",
//           permissions: [],
//           isAdmin: false,
//           level: 3,
//         });
//       }
//     }
//     //Creating Admin User
//     email = isDefault ? email : tenant.email;
//     let adminUG = await UserGroup.findOne({ group_id: group_id }).exec();
//     if (adminUG) {
//       await User.create({
//         _id: "5b8950f78aae6dadfc2721c5",
//         name: "admin",
//         tenantId: tenantId,
//         email: email,
//         password: config.defaultData.pass,
//         isAdmin: true,
//         userGroup: adminUG._id,
//         group_id: adminUG.group_id,
//       });
//       //console.log('User Created');
//       return tenantId;
//     }
//   } else {
//     if (!isDefault) {
//       return new Error("Tenant Already Exists");
//     }
//   }
// }

// async function checkDefaultTenant() {
//   //    let user= await User.findOne({tenantId:'ps19'}).populate({path:'userGroup',populate :{path: 'permissions'}}).exec();
//   //    console.log(user);
//   let tenantCount = await Tenant.find({
//     tenantId: config.defaultData.tenant.id,
//   })
//     .limit(1)
//     .countDocuments()
//     .exec();
//   if (tenantCount === 0) {
//     //No default tenant available , creating default tenant
//     //
//     return await createNewTenant({ isDefault: true });
//   }
//   return true;
// }
// function populateDefaultLists() {
//   ListModel.find({}, function(err, data) {
//     if (err || !data || data.length == 0) {
//       ListModel.create({
//         listName: "user",
//         settings: '{"criteria": {"email": "<useremail>"}, "fieldMap":{"code":"email", "description": "name"}}',
//         owner: null,
//         tenantId: "ps19",
//       });
//       ListModel.create({
//         listName: "ApplicationLookups",
//         settings: "",
//         owner: null,
//         tenantId: "ps19",
//       });
//       ListModel.create({
//         listName: "SOD",
//         settings:
//           '{"criteria":{"employee": "<useremail>"}, "fieldMap":{"code":"day", "description":"employee" }, "limit":"1", "sort":{"day":"-1"}}',
//         owner: null,
//         tenantId: "ps19",
//       });
//     }
//   });
// }

// // Not in Use in App js ... JplanHelper is used Instead
// function populateJourneyPlan() {
//   let j1 = {
//     supevisor: "",
//     user: { id: "5b8950f78aae6dadfc2721c5", name: "admin" },
//     date: new Date(),
//     title: "JPlan",
//     tasks: [
//       {
//         taskId: "",
//         taskDate: "String",
//         startLocation: [""],
//         endLocation: [""],
//         startTime: "",
//         endTime: "",
//         status: "",
//         title: "First Task",
//         desc: "None",
//         notes: "none",
//         imgs: [""],
//         units: [
//           {
//             id: "29143a56-27fb-1132-9aa9-51d784dedd44",
//             unitId: "T001-U002",
//             track_id: "5bf7eb2c5a6dd143e4dd01b7",
//           },
//         ],
//       },
//       {
//         taskId: "",
//         taskDate: "String",
//         startLocation: [""],
//         endLocation: [""],
//         startTime: "",
//         endTime: "",
//         status: "",
//         title: "Second Task",
//         desc: "None",
//         notes: "none",
//         imgs: [""],
//         units: [
//           {
//             id: "29143a56-27fb-1132-9aa9-51d784dedd44",
//             unitId: "T001-U002",
//             track_id: "5bf7eb2c5a6dd143e4dd01b7",
//           },
//         ],
//       },
//     ],
//     //tasks: Array,
//     status: "None",
//   };

//   JourneyPlanModel.find({}, function(err, data) {
//     if (err || !data || data.length == 0) {
//       JourneyPlanModel.create(j1);
//     }
//   });
// }

// function populateApplicationLookups() {
//   ApplicationLookupsModel.find({}, function(err, data) {
//     if (err || !data || data.length == 0) {
//       // populate Category List
//       ApplicationLookupsModel.create({
//         tenantId: "ps19",
//         listName: "Category",
//         code: "1",
//         description: "Rails",
//       });
//       ApplicationLookupsModel.create({
//         tenantId: "ps19",
//         listName: "Category",
//         code: "2",
//         description: "Tiles",
//       });
//       ApplicationLookupsModel.create({
//         tenantId: "ps19",
//         listName: "Category",
//         code: "3",
//         description: "Spikes",
//       });
//       ApplicationLookupsModel.create({
//         tenantId: "ps19",
//         listName: "Category",
//         code: "4",
//         description: "Joint Bar",
//       });
//       ApplicationLookupsModel.create({
//         tenantId: "ps19",
//         listName: "Category",
//         code: "5",
//         description: "Switch",
//       });

//       // populate Priority list
//       ApplicationLookupsModel.create({
//         tenantId: "ps19",
//         listName: "Priority",
//         code: "11",
//         description: "High",
//       });
//       ApplicationLookupsModel.create({
//         tenantId: "ps19",
//         listName: "Priority",
//         code: "12",
//         description: "Medium",
//       });
//       ApplicationLookupsModel.create({
//         tenantId: "ps19",
//         listName: "Priority",
//         code: "13",
//         description: "Low",
//       });
//       ApplicationLookupsModel.create({
//         tenantId: "ps19",
//         listName: "Priority",
//         code: "14",
//         description: "Info",
//       });

//       // Pull list
//       ApplicationLookupsModel.create({
//         tenantId: "ps19",
//         listName: "AppPullList",
//         code: "21",
//         description: "ApplicationLookups",
//         opt1: "ApplicationLookups",
//         opt2:
//           '{"criteria":{"listName": { "$in": ["assetType", "Priority"]}}, "fieldMap":{"code": "code", "description": "description", "optParam2": "listName"}}',
//       });
//       ApplicationLookupsModel.create({
//         tenantId: "ps19",
//         listName: "AppPullList",
//         code: "22",
//         description: "StartOfDay",
//         opt1: "SOD",
//         opt2:
//           '{"criteria":{"employee": "<useremail>"}, "fieldMap":{"code":"day", "description":"employee" }, "limit":"1", "sort":{"day":"-1"}}',
//       });
//       ApplicationLookupsModel.create({
//         tenantId: "ps19",
//         listName: "AppPullList",
//         code: "23",
//         description: "JourneyPlan",
//         opt1: "JourneyPlan",
//         opt2: '{"criteria":{"user.id": "<userid>"}, "fieldMap":{"code":"date", "description":"title" }, "limit":"1", "sort":{"date":"-1"}}',
//       });
//       //Work Plan Template
//       ApplicationLookupsModel.create({
//         tenantId: "ps19",
//         listName: "AppPullList",
//         code: "24",
//         description: "WorkPlanTemplate",
//         opt1: "WorkPlanTemplate",
//         opt2:
//           '{"criteria":{"$or":[{"user.email": "<teamLeadEmail>"},{"user.email":"<useremail>"}]}, "fieldMap":{"code":"_id", "description":"title" }}',
//       });
//       // Traffic Type
//       ApplicationLookupsModel.create({
//         tenantId: "ps19",
//         listName: "TrafficType",
//         code: "TT-01",
//         description: "Intermodal",
//         createdAt: "2018-12-07 8:00:00.000Z",
//         updateAt: "2018-12-07 8:00:00.000Z",
//       });
//       ApplicationLookupsModel.create({
//         tenantId: "ps19",
//         listName: "TrafficType",
//         code: "TT-02",
//         description: "Amtrak",
//         createdAt: "2018-12-07 8:00:00.000Z",
//         updateAt: "2018-12-07 8:00:00.000Z",
//       });
//       ApplicationLookupsModel.create({
//         tenantId: "ps19",
//         listName: "TrafficType",
//         code: "TT-07",
//         description: "Hazmat",
//         createdAt: "2018-12-07 8:00:00.000Z",
//         updateAt: "2018-12-07 8:00:00.000Z",
//       });
//       ApplicationLookupsModel.create({
//         tenantId: "ps19",
//         listName: "TrafficType",
//         code: "TT-04",
//         description: "Coal",
//         createdAt: "2018-12-07 8:00:00.000Z",
//         updateAt: "2018-12-07 8:00:00.000Z",
//       });
//       ApplicationLookupsModel.create({
//         tenantId: "ps19",
//         listName: "TrafficType",
//         code: "TT-05",
//         description: "Manifest Traffic",
//         createdAt: "2018-12-07 8:00:00.000Z",
//         updateAt: "2018-12-07 8:00:00.000Z",
//       });
//       ApplicationLookupsModel.create({
//         tenantId: "ps19",
//         listName: "TrafficType",
//         code: "TT-06",
//         description: "Crude by Rail",
//         createdAt: "2018-12-07 8:00:00.000Z",
//         updateAt: "2018-12-07 8:00:00.000Z",
//       });
//       ApplicationLookupsModel.create({
//         tenantId: "ps19",
//         listName: "TrafficType",
//         code: "TT-03",
//         description: "Freight",
//         createdAt: "2018-12-07 8:00:00.000Z",
//         updateAt: "2018-12-07 8:00:00.000Z",
//       });

//       // Lookup Asset Type
//       // ApplicationLookupsModel.create({
//       //   tenantId: "ps19",
//       //   listName: "assetType",
//       //   code: "ast-1",
//       //   description: "Ties",
//       //   createdAt: "2018-12-07 8:00:00.000Z",
//       //   updateAt: "2018-12-07 8:00:00.000Z",
//       // });
//       // ApplicationLookupsModel.create({
//       //   tenantId: "ps19",
//       //   listName: "assetType",
//       //   code: "ast-2",
//       //   description: "Rail",
//       //   createdAt: "2018-12-07 8:00:00.000Z",
//       //   updateAt: "2018-12-07 8:00:00.000Z",
//       // });
//       // ApplicationLookupsModel.create({
//       //   tenantId: "ps19",
//       //   listName: "assetType",
//       //   code: "ast-3",
//       //   description: "Rail Clips",
//       //   createdAt: "2018-12-07 8:00:00.000Z",
//       //   updateAt: "2018-12-07 8:00:00.000Z",
//       // });
//       // ApplicationLookupsModel.create({
//       //   tenantId: "ps19",
//       //   listName: "assetType",
//       //   code: "ast-4",
//       //   description: "spikes",
//       //   createdAt: "2018-12-07 8:00:00.000Z",
//       //   updateAt: "2018-12-07 8:00:00.000Z",
//       // });
//       // ApplicationLookupsModel.create({
//       //   tenantId: "ps19",
//       //   listName: "assetType",
//       //   code: "ast-5",
//       //   description: "Manual Switch",
//       //   createdAt: "2018-12-07 8:00:00.000Z",
//       //   updateAt: "2018-12-07 8:00:00.000Z",
//       // });
//       // ApplicationLookupsModel.create({
//       //   tenantId: "ps19",
//       //   listName: "assetType",
//       //   code: "ast-6",
//       //   description: "Powered Switch",
//       //   createdAt: "2018-12-07 8:00:00.000Z",
//       //   updateAt: "2018-12-07 8:00:00.000Z",
//       // });
//       // ApplicationLookupsModel.create({
//       //   tenantId: "ps19",
//       //   listName: "assetType",
//       //   code: "ast-7",
//       //   description: "Turnout",
//       //   createdAt: "2018-12-07 8:00:00.000Z",
//       //   updateAt: "2018-12-07 8:00:00.000Z",
//       // });
//       // ApplicationLookupsModel.create({
//       //   tenantId: "ps19",
//       //   listName: "assetType",
//       //   code: "ast-8",
//       //   description: "Connecting Rod",
//       //   createdAt: "2018-12-07 8:00:00.000Z",
//       //   updateAt: "2018-12-07 8:00:00.000Z",
//       // });
//       // ApplicationLookupsModel.create({
//       //   tenantId: "ps19",
//       //   listName: "assetType",
//       //   code: "ast-9",
//       //   description: "Frogs",
//       //   createdAt: "2018-12-07 8:00:00.000Z",
//       //   updateAt: "2018-12-07 8:00:00.000Z",
//       // });
//       // ApplicationLookupsModel.create({
//       //   tenantId: "ps19",
//       //   listName: "assetType",
//       //   code: "ast-10",
//       //   description: "Diamonds",
//       //   createdAt: "2018-12-07 8:00:00.000Z",
//       //   updateAt: "2018-12-07 8:00:00.000Z",
//       // });
//       // ApplicationLookupsModel.create({
//       //   tenantId: "ps19",
//       //   listName: "assetType",
//       //   code: "ast-11",
//       //   description: "Switch points",
//       //   createdAt: "2018-12-07 8:00:00.000Z",
//       //   updateAt: "2018-12-07 8:00:00.000Z",
//       // });

//       // Sub Divison Lookup

//       ApplicationLookupsModel.create({
//         tenantId: "ps19",
//         listName: "Subdivision",
//         code: "sub-01",
//         description: "Baltimore Subdivision",
//         createdAt: "2018-12-07 8:00:00.000Z",
//         updateAt: "2018-12-07 8:00:00.000Z",
//       });
//       ApplicationLookupsModel.create({
//         tenantId: "ps19",
//         listName: "Subdivision",
//         code: "sub-02",
//         description: "Albany Subdivision",
//         createdAt: "2018-12-07 8:00:00.000Z",
//         updateAt: "2018-12-07 8:00:00.000Z",
//       });
//       ApplicationLookupsModel.create({
//         tenantId: "ps19",
//         listName: "Subdivision",
//         code: "sub-03",
//         description: "Cumberland Subdivision",
//         createdAt: "2018-12-07 8:00:00.000Z",
//         updateAt: "2018-12-07 8:00:00.000Z",
//       });
//       ApplicationLookupsModel.create({
//         tenantId: "ps19",
//         listName: "Class",
//         code: "cls-01",
//         description: "1",
//         opt1: '{"frequency" : 10 }',
//         createdAt: "2018-12-07 8:00:00.000Z",
//         updateAt: "2018-12-07 8:00:00.000Z",
//       });
//       ApplicationLookupsModel.create({
//         tenantId: "ps19",
//         listName: "Class",
//         code: "cls-02",
//         opt1: '{"frequency" : 60 }',
//         description: "2",
//         createdAt: "2018-12-07 8:00:00.000Z",
//         updateAt: "2018-12-07 8:00:00.000Z",
//       });
//       ApplicationLookupsModel.create({
//         tenantId: "ps19",
//         listName: "Class",
//         code: "cls-03",
//         description: "3",
//         opt1: '{"frequency" : 20 }',
//         createdAt: "2018-12-07 8:00:00.000Z",
//         updateAt: "2018-12-07 8:00:00.000Z",
//       });
//       ApplicationLookupsModel.create({
//         tenantId: "ps19",
//         listName: "Class",
//         code: "cls-04",
//         description: "4",
//         opt1: '{"frequency" : 40 }',
//         createdAt: "2018-12-07 8:00:00.000Z",
//         updateAt: "2018-12-07 8:00:00.000Z",
//       });
//       ApplicationLookupsModel.create({
//         tenantId: "ps19",
//         listName: "Class",
//         code: "cls-05",
//         description: "5",
//         opt1: '{"frequency" : 30 }',
//         createdAt: "2018-12-07 8:00:00.000Z",
//         updateAt: "2018-12-07 8:00:00.000Z",
//       });
//     }
//   });
// }
// // // Discontinued using SODs
// // function addSomeSODs() {
// //   SODModel.find({}, function(err, data) {
// //     if (err || !data || data.length == 0) {
// //       let now = new Date();
// //       let today = now;
// //       today.setUTCHours(0);
// //       today.setMinutes(0);
// //       today.setSeconds(0);

// //       let yesterday = today - 86400000;

// //       SODModel.create({
// //         employee: "ajaz_qureshi@hotmail.com",
// //         location: "unknown",
// //         day: today,
// //         start: now,
// //       });
// //       SODModel.create({
// //         employee: "ajaz_qureshi@hotmail.com",
// //         location: "unknown",
// //         day: yesterday,
// //         start: yesterday,
// //         end: yesterday,
// //       });
// //       SODModel.create({
// //         employee: "random@random.com",
// //         location: "unknown",
// //         day: today,
// //         start: now,
// //       });
// //     }
// //   });
// // }
// function enterTracksFromKMLToDB() {
//   let tracks = tracks_Transformation_From_KmlJSON_DBTracks();
//   console.log(tracks);
//   createTIMPS_ASSETTYPES();
//   tracks.forEach(track => {
//     TrackModel.create(track);
//   });
// }
// function createTIMPS_ASSETTYPES() {
//   ApplicationLookupsModel.create({
//     tenantId: "ps19",
//     listName: "assetType",
//     code: "ast-100",
//     description: "bridges",
//     createdAt: "2018-12-07 8:00:00.000Z",
//     updateAt: "2018-12-07 8:00:00.000Z",
//   });
//   ApplicationLookupsModel.create({
//     tenantId: "ps19",
//     listName: "assetType",
//     code: "ast-101",
//     description: "crossings",
//     createdAt: "2018-12-07 8:00:00.000Z",
//     updateAt: "2018-12-07 8:00:00.000Z",
//   });
//   ApplicationLookupsModel.create({
//     tenantId: "ps19",
//     listName: "assetType",
//     code: "ast-102",
//     description: "diamonds",
//     createdAt: "2018-12-07 8:00:00.000Z",
//     updateAt: "2018-12-07 8:00:00.000Z",
//   });
//   ApplicationLookupsModel.create({
//     tenantId: "ps19",
//     listName: "assetType",
//     code: "ast-103",
//     description: "switches",
//     createdAt: "2018-12-07 8:00:00.000Z",
//     updateAt: "2018-12-07 8:00:00.000Z",
//   });
//   ApplicationLookupsModel.create({
//     tenantId: "ps19",
//     listName: "assetType",
//     code: "ast-104",
//     description: "whistle post",
//     createdAt: "2018-12-07 8:00:00.000Z",
//     updateAt: "2018-12-07 8:00:00.000Z",
//   });
//   ApplicationLookupsModel.create({
//     tenantId: "ps19",
//     listName: "assetType",
//     code: "ast-105",
//     description: "signals",
//     createdAt: "2018-12-07 8:00:00.000Z",
//     updateAt: "2018-12-07 8:00:00.000Z",
//   });
//   ApplicationLookupsModel.create({
//     tenantId: "ps19",
//     listName: "assetType",
//     code: "ast-106",
//     description: "culvets",
//     createdAt: "2018-12-07 8:00:00.000Z",
//     updateAt: "2018-12-07 8:00:00.000Z",
//   });
//   ApplicationLookupsModel.create({
//     tenantId: "ps19",
//     listName: "assetType",
//     code: "ast-107",
//     description: "signs",
//     createdAt: "2018-12-07 8:00:00.000Z",
//     updateAt: "2018-12-07 8:00:00.000Z",
//   });
//   ApplicationLookupsModel.create({
//     tenantId: "ps19",
//     listName: "assetType",
//     code: "ast-108",
//     description: "rail",
//     createdAt: "2018-12-07 8:00:00.000Z",
//     updateAt: "2018-12-07 8:00:00.000Z",
//   });
//   ApplicationLookupsModel.create({
//     tenantId: "ps19",
//     listName: "Subdivision",
//     code: "sub-100",
//     description: "US-SUGAR",
//     createdAt: "2018-12-07 8:00:00.000Z",
//     updateAt: "2018-12-07 8:00:00.000Z",
//   });
// }

// function checkCSXSampleDataExistenceAndCreate() {
//   let dbDataTracks = getDbTracksCSXSample();
//   //console.log(dbDataTracks);
//   // dbDataTracks.forEach(track => {
//   //   console.log("Track")
//   //   console.log(track)
//   //   track.units.forEach(unit => {
//   //     console.log("Unit")
//   //     console.log(unit)
//   //   })
//   // })
//   let possibleAssetTypes = ["Crossing", "Bridge", "Access Point", "Switch", "Derail", "Xing", "Signal", "Overpass"];

//   TrackModel.findOne({ mp_prefix: "CSX", subdivision: "Albany Subdivision" }, function(err, track) {
//     if (!track) {
//       console.log("Creating Tracks of CSX");
//       console.log(dbDataTracks);

//       dbDataTracks.forEach(dbTrack => {
//         TrackModel.create(dbTrack);
//       });
//     }
//   });
//   ApplicationLookupsModel.findOne({ description: "Albany Subdivision", listName: "Subdivision" }, function(err, subDiv) {
//     if (!subDiv) {
//       console.log("Creating Subdivision Albany Subdivision");
//       ApplicationLookupsModel.create({
//         tenantId: "ps19",
//         listName: "Subdivision",
//         code: "sub-1500",
//         description: "Albany Subdivision",
//         createdAt: "2019-01-25 4:34:00.000Z",
//         updateAt: "2019-01-25 4:34:00.000Z",
//       });
//     }
//   });
//   possibleAssetTypes.forEach((assetType, index) => {
//     ApplicationLookupsModel.findOne({ description: assetType, listName: "assetType" }, function(err, aType) {
//       if (!aType) {
//         console.log("Adding Asset Type : " + assetType);
//         ApplicationLookupsModel.create({
//           tenantId: "ps19",
//           listName: "assetType",
//           code: "ast-csx-1050" + index,
//           description: assetType,
//           createdAt: "2019-01-25 4:34:00.000Z",
//           updateAt: "2019-01-25 4:34:00.000Z",
//         });
//       }
//     });
//   });
// }
// // {name:"heMethod",type:"string",order:1,description:"Hydrogen elemination method"},
// // {name:"yearRolled",type:"string",order:1},
// // {name:"yearLaid",type:"string",order:1},

// var LampAttributes = {
//   rail: [
//     //{name:"weight",type:"string",order:1},
//     { name: "section", type: "string", order: 1 }, // 15RE2019, 15 R-86 L-86 etc
//     { name: "railType", type: "array", values: ["CWR", "Jointed"], order: 2 },
//     { name: "railSide", type: "array", values: ["ER", "WR", "SR", "NR", "CR"], order: 3 },
//     { name: "nearestStation", type: "string", order: 4 },
//     { name: "stationSide", type: "array", values: ["East", "West", "South", "North", "Platform", "Shop", "Yard"], order: 5 },
//   ],
//   track: [
//     { name: "trackType", type: "string", order: 1 },
//     { name: "trackNumber", type: "string", order: 2 },
//     { name: "class", type: "string", order: 3 },
//   ],
//   surfacing: [{ name: "year", type: "string", order: 1 }],
//   ties: [{ name: "year", type: "string", order: 1 }],
//   adjRailTemp: [{ name: "year", type: "string", order: 1 }],
//   brushCutting: [{ name: "year", type: "string", order: 1 }],
//   line: [{ name: "geoJsonCord", type: "string", order: 1, required: true }],
// };

// function transformAssetTypesToTable() {
//   AssetTypeModel.findOne({}, function(err, at) {
//     if (!at) {
//       ApplicationLookupsModel.findOne({ listName: "AppPullList", description: "AssetTypes", opt1: "AssetTypes" }, function(err, pl) {
//         if (!pl) {
//           ApplicationLookupsModel.create({
//             tenantId: "ps19",
//             listName: "AppPullList",
//             description: "AssetTypes",
//             code: 231,
//             opt1: "AssetTypes",
//             opt2:
//               '{"fieldMap":{"code": "timpsAttributes.code", "description": "timpsAttributes.description", "optParam2": "listName"}, "project":{"lampAttributes":0}}',
//           });
//         }
//       });
//       let assetTypeLst = [];
//       ApplicationLookupsModel.find({ listName: "assetType" }, function(err, atypes) {
//         let count = atypes.length;

//         atypes.forEach(atype => {
//           try {
//             let opt1 = JSON.parse(atype.opt1);

//             let inspIns = "";
//             let inspForms = {};
//             let dcs = "";
//             if (opt1 && opt1.hasOwnProperty("instructions")) {
//               inspIns = opt1.instructions;
//             }
//             if (opt1 && opt1.hasOwnProperty("name") && opt1.hasOwnProperty("fields")) {
//               inspForms = { name: opt1.name, fields: opt1.fields };
//             }
//             if (opt1 && opt1.hasOwnProperty("defectCodes")) {
//               dcs = opt1.defectCodes;
//             }
//             let newAt = {
//               assetType: atype.description,
//               lampAttributes: LampAttributes[atype.description] != undefined ? LampAttributes[atype.description] : [],
//               timpsAttributes: { code: atype.code, description: atype.description },
//               inspectionInstructions: inspIns,
//               inspectionForms: inspForms,
//               defectCodes: dcs,
//             };
//             assetTypeLst.push(atype.description);
//             AssetTypeModel.create(newAt);

//             if (--count == 0) {
//               console.log("Transformed ", atypes.length, " assetTypes from ApplicationLookups to assetstypes table");
//               for (const la of Object.keys(LampAttributes)) {
//                 if (!assetTypeLst.includes(la)) {
//                   let newAt = {
//                     assetType: la,
//                     lampAttributes: LampAttributes[la],
//                     timpsAttributes: { code: "21" + count, description: la },
//                     inspectionInstructions: {}, //inspIns,
//                     inspectionForms: {}, //inspForms,
//                     defectCodes: [], //dcs
//                   };
//                   AssetTypeModel.create(newAt);

//                   count++;
//                 }
//               }
//               console.log("created ", count, " new assetTypes for Lamp attributes");
//             }
//           } catch (err) {
//             console.log(err);
//           }
//         });
//       });
//     }
//   });
// }
// function addLampAssetsForNHSLT1() {
//   AssetModel.findOne({}, function(err, asset) {
//     if (!asset) {
//       let idMap = new Map();
//       let count = 0;
//       for (var lt1asset of lampT1NHSL) {
//         idMap.set(lt1asset.id, lt1asset.unitId);
//         //console.log('pair ',lt1asset.id,'-',lt1asset.unitId);
//         if (lt1asset.parentAsset) {
//           //console.log('b:',lt1asset.parentAsset);
//           lt1asset.parentAsset = idMap.get(lt1asset.parentAsset);
//           //console.log('a:', lt1asset.parentAsset);
//         }
//         if (typeof lt1asset.attributes === "string") {
//           try {
//             lt1asset.attributes = JSON.parse(lt1asset.attributes);
//           } catch (er) {
//             console.log(er);
//           }
//         }

//         count++;
//       }
//       for (var lt1asset of lampT1NHSL) {
//         AssetModel.create(lt1asset, (err, lta) => {
//           idMap.set(lta.unitId, lta._id.toHexString());
//           //console.log(lta._id.toHexString());
//           if (--count == 0) {
//             AssetModel.find({}, function(err, assets) {
//               assets.forEach(asset => {
//                 if (asset.parentAsset) {
//                   asset.parentAsset = idMap.get(asset.parentAsset);
//                   asset.save();
//                 }
//               });
//             });
//           }
//         });
//       }
//     }
//   });
// }

// function addAssetTypeFields() {
//   let linearAssetTypes = ["rail", "track", "surfacing", "ties", "adjRailTemp", "brushCutting", "line"];
//   // only adds when the collection is empty
//   AssetTypeModel.find({}, function(err, asttypes) {
//     asttypes.forEach(asttype => {
//       if (!asttype.assetTypeClassify) {
//         //console.log(asttype.assetType,' doesnt contain assetTypeClassify');
//         if (linearAssetTypes.includes(asttype.assetType)) asttype.assetTypeClassify = "linear";
//         else asttype.assetTypeClassify = "point";

//         asttype.save();
//       }
//     });
//   });
// }

// // Add database entry if not exist
// async function addIfNotExist(model, criteria, newEntry) {
//   if (!model) {
//     console.log("model not valid, exitting");
//     return;
//   }
//   if (!criteria || criteria == {}) {
//     console.log("Only one entry should be added, provide criteria");
//     return;
//   }
//   if (!newEntry) {
//     console.log("Entry to add is null");
//     return;
//   }

//   let entry = await model.findOne(criteria).exec();
//   if (!entry) {
//     console.log("adding entry ", newEntry);
//     await model.create(newEntry);
//   }
// }

// async function addNewPermissions() {
//   let permissionsToAdd = [
//     { name: "MAINTENANCE READ", resource: "MAINTENANCE", action: "read" },
//     { name: "MAINTENANCE CREATE", resource: "MAINTENANCE", action: "create" },
//     { name: "MAINTENANCE UPDATE", resource: "MAINTENANCE", action: "update" },
//     { name: "MAINTENANCE DELETE", resource: "MAINTENANCE", action: "delete" },
//     { name: "MAINTENANCE VIEW", resource: "MAINTENANCE", action: "view" },
//   ];

//   for (const per of permissionsToAdd) {
//     addIfNotExist(GroupPermission, per, per);
//   }

//   //addAllPermissionsToAdmin()
//   let ugAdmin = await UserGroup.findOne({ isAdmin: true }).exec();
//   if (ugAdmin) {
//     //let adperms = ugAdmin.permissions;
//     let allperms = await GroupPermission.find({}).exec();
//     let reqSave = false;
//     for (const perm of allperms) {
//       if (!ugAdmin.permissions.map(p => p.toString()).includes(perm._id.toString())) {
//         ugAdmin.permissions.push(perm._id);
//         reqSave = true;
//       }
//     }
//     if (reqSave) {
//       console.log("updating admin usergroup to include new permissions");
//       ugAdmin.markModified("permissions");
//       ugAdmin.save((err, res) => {
//         if (err) {
//           console.log("error saving admin usergroup:", err.toString());
//         }
//       });
//     }
//   } else {
//     console.log("Could not find admin user group");
//   }
// }

// // Uncomment only for demo user data

// //userDemoCreate()

// checkDefaultTenant();

// // TIMPS DEMO 25 January
// //enterTracksFromKMLToDB();
// //checkCSXSampleDataExistenceAndCreate();
// //createNewTenant({ tenantId: 'swt', name:'Software Transform', email: 'ajaz@hotmail.com', isDefault: false }) ;

// // NSHL TRACK ASSETS ONLY
// // trackAssetPopulateNSHL();
// // addLampAssetsForNHSLT1();
// // lampNHSLAssets();

// // addAssetTypeFields();

// //addFerromexAssets();

// // add lines, linestrings for geodata get ids 
// // add assets


// addNewPermissions();

// dynamicLanguageToDB();

// module.exports.createNewTenant = createNewTenant;
// module.exports.checkDefaultTenant = checkDefaultTenant;
// module.exports.populateDefaultLists = populateDefaultLists;
// module.exports.populateApplicationLookups = populateApplicationLookups;
// module.exports.populateJourneyPlan = populateJourneyPlan;
// //module.exports.addSomeSODs = addSomeSODs;
// module.exports.jPlanSeedHelper = jPlanSeedHelper;
// module.exports.transformAssetTypesToTable = transformAssetTypesToTable;
// //module.exports.addLampAssetsForNHSLT1 = addLampAssetsForNHSLT1;
