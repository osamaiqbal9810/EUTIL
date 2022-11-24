let AssetModel = require("../../api/assets/assets.modal");
let User = require("../../api/user/user.model");
let AssetTypeModel = require("../../api/assetTypes/assetTypes.model");
import { defectCodes } from "./defectCodes";

import { addNHSLData } from "./Septa-NHSLData";
import { addMarketFrankfordData } from "./Septa-MFLData";
import { addAirportLineData } from "./Septa-AirportLineData";

export var septa = {
  inspectable: "false",
  parentAsset: null,
  images: [{}],
  documents: [{}],
  childAsset: [],
  isRemoved: "false",
  subdivision: "",
  unitId: "Septa",
  description: "",
  assetType: "Company",
  frequency: "",
  attributes: "{}",
  name: "Septa",
};

const regions = [
  {
    inspectable: "false",
    parentAsset: null,
    images: [{}],
    documents: [{}],
    childAsset: [],
    isRemoved: "false",
    subdivision: "",
    unitId: "City/Suburban",
    description: "",
    assetType: "Region",
    frequency: "",
    attributes: "{}",
    name: "City/Suburban",
  },
  {
    inspectable: "false",
    parentAsset: null,
    images: [{}],
    documents: [{}],
    childAsset: [],
    isRemoved: "false",
    subdivision: "",
    unitId: "Regional",
    description: "",
    assetType: "Region",
    frequency: "",
    attributes: "{}",
    name: "Regional",
  },
];
export async function addSEPTAData() {
  await createAssetTypes();

  await addLocation();
  await addNHSLData();
  await addMarketFrankfordData();
  await addAirportLineData();
}
export async function addLocation() {
  let company = await addLampAsset(septa.unitId, septa);

  let ast = await AssetModel.findOne({ unitId: septa.unitId });
  let admin = await User.findOne({ isAdmin: true });
  if (admin && ast) {
    admin.assignedLocation = ast._id;
    await admin.save();
  } else {
    console.log("Error in addLocation:  can not find Admin or created location");
  }
  for (let r of regions) {
    r.parentAsset = company._id;
    await addLampAsset(r.unitId, r);
  }
}
async function addIfNotExist(model, criteria, newEntry) {
  if (!model) {
    console.log("model not valid, exitting");
    return;
  }
  if (!criteria || criteria == {}) {
    console.log("Only one entry should be added, provide criteria");
    return;
  }
  if (!newEntry) {
    console.log("Entry to add is null");
    return;
  }

  try {
    let entry = await model.findOne(criteria).exec();
    if (!entry) {
      console.log("adding entry ", newEntry);
      await model.create(newEntry);
    }
  } catch (err) {
    console.log("addIfNotExist in Septa-Location.js, err:", err.toString());
  }
}

async function addLampAsset(unitId, newAst, createCallback = (err, obj) => {}) {
  let ast = await AssetModel.findOne({ unitId: unitId });

  if (!ast) {
    console.log("adding asset", unitId);
    ast = await AssetModel.create(newAst);
    return ast;
  }
  return ast;
}

let LampAttributes = {
  rail: [
    //{name:"weight",type:"string",order:1},
    { name: "section", type: "string", order: 1 }, // 15RE2019, 15 R-86 L-86 etc
    { name: "railType", type: "array", values: ["CWR", "Jointed"], order: 2 },
    { name: "railSide", type: "array", values: ["ER", "WR", "SR", "NR", "CR"], order: 3 },
    { name: "nearestStation", type: "string", order: 4 },
    { name: "stationSide", type: "array", values: ["East", "West", "South", "North", "Platform", "Shop", "Yard"], order: 5 },
  ],
  track: [
    //{ name: "trackType", type: "string", order: 1 },
    //{ name: "trackNumber", type: "string", order: 2 },
    //{ name: "class", type: "string", order: 3 },
    { name: "railOrientation", order: 1 },
    { name: "Local Track Name", type: "string", order: 2 },
    { name: "geoJsonCord", type: "string", order: 3, required: false },
  ],
  surfacing: [{ name: "year", type: "string", order: 1 }],
  ties: [{ name: "year", type: "string", order: 1 }],
  adjRailTemp: [{ name: "year", type: "string", order: 1 }],
  brushCutting: [{ name: "year", type: "string", order: 1 }],
  line: [
    { name: "geoJsonCord", type: "string", order: 1, required: true },
    { name: "timezone", type: "string", order: 2, required: true },
  ],
  Bridge: [{ name: "bridgeType", type: "string", order: 1, required: true }],
};

//let defectCodes = ["Insufficient number of joint bolts", "Loose/worn joint bolts", "Torch-cut or burned-bolt hole in rail", "Stock rail/switch point not seated or functioning as intended", "Loose, worn, or missing switch components", "Heat kinks", "Worn or defective frog/frog components"];
//let defectCodes = {   "details": [     {       "code": 213.7,       "title": "Designation of qualified persons to supervise certain renewals and inspect track",       "details": [         {           "code": 7.01,           "title": "No written record of names of qualified persons to supervise restorations and enewals of track user traffic and/or to inspect track for defects, or to pass trains over broken rails or pull-aparts."         },         {           "code": 7.02,           "title": "Failure of track owner to provide written authorization to qualified designated individuals."         },         {           "code": 7.03,           "title": "Failure to use qualified person to pass trains over broken rails of pull aparts."         },         {           "code": 7.04,           "title": "Train speed exeeds 10 M.P.H over broken rails or pull apart."         },         {           "code": 7.05,           "title": "Failure to promptly notify and dispatch person fully qualified user 213.7 to the location of the broken rail or pull apart."         }       ]     },     {       "code": 213.9,       "title": "Classes of track; operating speed limits",       "details": [         {           "code": 9.01,           "title": "Failure to restore other than excepted track to compliance the Class 1 standards within 30 days after a person designated under 213.7(a) has determinded that operations may safely continue over defect(s) not meeting Class 1 or excepted track standards."         },         {           "code": 9.02,           "title": "Failure to track owner to enforce, over Class 1 defects, the limiting conditions imposed by person designated under 213.7(s)"         },         {           "code": 9.03,           "title": "Unused."         }       ]     },     {       "code": 213.11,       "title": "Restoration or renewal of track under traffic conditions",       "details": [         {           "code": 11.01,           "title": "Proper qualified supervision not provided at work site during work hours when track in being restored or renewed under traffic conditions."         }       ]     },     {       "code": 213.33,       "title": "Drainage",       "details": [         {           "code": 33.01,           "title": "Drainage or water-carrying facility not maintained."         },         {           "code": 33.02,           "title": "Drainage or water-carrying facility obstructed by debris."         },         {           "code": 33.03,           "title": "Drainage or water-carrying facility collapsed."         },         {           "code": 33.04,           "title": "Drainage or water-carrying facility obstructed by vegetation."         },         {           "code": 33.05,           "title": "Drainage or water-carrying facility obstructed by silting."         },         {           "code": 33.06,           "title": "Drainage or water-carrying facility deteriorated to allow subgrade saturation."         },         {           "code": 33.07,           "title": "Uncontrolled water undercutting track structure or embankment."         },         {           "code": 33.08,           "title": "Flood water reaches to within 1\" from the top of rail."         },         {           "code": 33.09,           "title": "Flood water if covering the top of rail."         }       ]     },     {       "code": 213.37,       "title": "Vegetation",       "details": [         {           "code": 37.01,           "title": "Combustible vegetation around track-carrying structures."         },         {           "code": 37.02,           "title": "Vegetation obstructs visibility of railroad signs and fixed signals."         },         {           "code": 37.03,           "title": "Vegetation obstructs passing of day and night signals by railroad employees."         },         {           "code": 37.04,           "title": "Vegetation interferes with railroad employees performing normal trackside duties. "         },         {           "code": 37.05,           "title": "Vegetation prevents proper functioning of signal and/or communication lines. "         },         {           "code": 37.06,           "title": "Excessive vegetation at train order office depot, interlocking plants, a carman's building, etc., prevents employees on duty from visually inspecting moving equipment when their duties so require. "         },         {           "code": 37.07,           "title": "Excessive vegetation at train meeting points prevents proper inspection by railroad employees of moving equipment."         },         {           "code": 37.08,           "title": "Excessive vegetation in toepaths and around switches where employees are performing normal trackside duties."         },         {           "code": 37.09,           "title": "Vegetation brushing sides of rolling stock."         },         {           "code": 37.1,           "title": "vegetation obstructs visibility of grade crossing warning signs and signals by the travelling public."         }       ]     },     {       "code": 213.39,       "title": "Highway Grade Crossings",       "details": [         {           "code": 39.01,           "title": "Flangeway blocked with foreign material - depth less than 1 1/2\"."         },         {           "code": 39.02,           "title": "Highway surface raised higher than the top of rail."         }       ]     }   ] };
//let inspectionForms = '{         "name" : "FRA 213.233 Track Inspection",         "fields" : [             {                 "title" : "Horizontal Split Head",                 "data" : [                     {                         "id" : "row1",                         "elements" : [                             {                                 "name" : "cbFirst",                                 "tag" : "cb-q1",                                 "type" : "BOOLEAN_CHECKBOX",                                 "defaultValue" : false                             },                             {                                 "name" : "tvFirst",                                 "type" : "STRING",                                 "description" : "Verify horizontal split heads?",                                 "minCharacters" : 10,                                 "maxCharacters" : 100                             },                             {                                 "name" : "swFirst",                                 "tag" : "sw-q1",                                 "type" : "BOOLEAN_SWITCH",                                 "defaultValue" : false                             }                         ]                     }                 ]             },             {                 "title" : "Vertical Split Head",                 "data" : [                     {                         "id" : "row1",                         "elements" : [                             {                                 "name" : "cbFirst",                                 "tag" : "cb-q5",                                 "type" : "BOOLEAN_CHECKBOX",                                 "defaultValue" : false                             },                             {                                 "name" : "tvFirst",                                 "type" : "STRING",                                 "description" : "Verify vertical split heads?",                                 "minCharacters" : 10,                                 "maxCharacters" : 100                             },                             {                                 "name" : "swFirst",                                 "tag" : "sw-q5",                                 "type" : "BOOLEAN_SWITCH",                                 "defaultValue" : false                             }                         ]                     }                 ]             },             {                 "title" : "Engine Burn",                 "data" : [                     {                         "id" : "row1",                         "elements" : [                             {                                 "name" : "cbFirst",                                 "tag" : "cb-q6",                                 "type" : "BOOLEAN_CHECKBOX",                                 "defaultValue" : false                             },                             {                                 "name" : "tvFirst",                                 "type" : "STRING",                                 "description" : "Verify engine burn fractures?",                                 "minCharacters" : 10,                                 "maxCharacters" : 100                             },                             {                                 "name" : "swFirst",                                 "tag" : "sw-q6",                                 "type" : "BOOLEAN_SWITCH",                                 "defaultValue" : false                             }                         ]                     }                 ]             },             {                 "title" : "Head and Web",                 "data" : [                     {                         "id" : "row1",                         "elements" : [                             {                                 "name" : "cbFirst",                                 "tag" : "cb-q7",                                 "type" : "BOOLEAN_CHECKBOX",                                 "defaultValue" : false                             },                             {                                 "name" : "tvFirst",                                 "type" : "STRING",                                 "description" : "Verify for head and web separation?",                                 "minCharacters" : 10,                                 "maxCharacters" : 100                             },                             {                                 "name" : "swFirst",                                 "tag" : "sw-q7",                                 "type" : "BOOLEAN_SWITCH",                                 "defaultValue" : false                             }                         ]                     }                 ]             },             {                 "title" : "Split Web",                 "data" : [                     {                         "id" : "row1",                         "elements" : [                             {                                 "name" : "cbFirst",                                 "tag" : "cb-q8",                                 "type" : "BOOLEAN_CHECKBOX",                                 "defaultValue" : false                             },                             {                                 "name" : "tvFirst",                                 "type" : "STRING",                                 "description" : "Verify for lengthwise crack along the side of web?",                                 "minCharacters" : 10,                                 "maxCharacters" : 100                             },                             {                                 "name" : "swFirst",                                 "tag" : "sw-q8",                                 "type" : "BOOLEAN_SWITCH",                                 "defaultValue" : false                             }                         ]                     }                 ]             },             {                 "title" : "Broken Base",                 "data" : [                     {                         "id" : "row1",                         "elements" : [                             {                                 "name" : "cbFirst",                                 "tag" : "cb-q9",                                 "type" : "BOOLEAN_CHECKBOX",                                 "defaultValue" : false                             },                             {                                 "name" : "tvFirst",                                 "type" : "STRING",                                 "description" : "Verify for break in the base of the rail?",                                 "minCharacters" : 10,                                 "maxCharacters" : 100                             },                             {                                 "name" : "swFirst",                                 "tag" : "sw-q9",                                 "type" : "BOOLEAN_SWITCH",                                 "defaultValue" : false                             }                         ]                     }                 ]             },             {                 "title" : "Bolt Hole Crack",                 "data" : [                     {                         "id" : "row1",                         "elements" : [                             {                                 "name" : "cbFirst",                                 "tag" : "cb-q10",                                 "type" : "BOOLEAN_CHECKBOX",                                 "defaultValue" : false                             },                             {                                 "name" : "tvFirst",                                 "type" : "STRING",                                 "description" : "Verify for bolt hole crack?",                                 "minCharacters" : 10,                                 "maxCharacters" : 100                             },                             {                                 "name" : "swFirst",                                 "tag" : "sw-q10",                                 "type" : "BOOLEAN_SWITCH",                                 "defaultValue" : false                             }                         ]                     }                 ]             },             {                 "title" : "Flattened Rail",                 "data" : [                     {                         "id" : "row1",                         "elements" : [                             {                                 "name" : "cbFirst",                                 "tag" : "cb-q11",                                 "type" : "BOOLEAN_CHECKBOX",                                 "defaultValue" : false                             },                             {                                 "name" : "tvFirst",                                 "type" : "STRING",                                 "description" : "Verify for flattened rail?",                                 "minCharacters" : 10,                                 "maxCharacters" : 100                             },                             {                                 "name" : "swFirst",                                 "tag" : "sw-q11",                                 "type" : "BOOLEAN_SWITCH",                                 "defaultValue" : false                             }                         ]                     }                 ]             }         ]     }';
export let inspectionInstructions =
  "[1] Non-class-specific defects found during an inspection by a qualified railroad inspector and not immediately repaired must be noted on the track inspection form. If not immediately repaired, remedial action shall be taken by an individual qualified under §213.7 \n(a). The 30-day period represents the maximum duration that FRA permits any non-class-specific defect(s) to remain in the track. \nFurthermore, it is not intended to create a 30-day timeline for all types of defects as immediate repair or a more restrictive appropriate action may be required at the time of the defect(s) discovery.\n\n [2] While Part 213 does not require the railroad to take the track out of service, due to the severity of these defects, FRA recommends that railroads take the track out of service. \nAt a minimum, however, the railroad should invoke §213.9(b).\n\n [3] This class specific defect requires remedial action 213.9(b).";

export let trackInspForm =
  '{"name":"FRA 213.233 Track Inspection",    "headings": {"visible" : true, "field1": "Track ID", "field2": "Describe"},    "fields":[    {          "title":"RAILS",          "data":[             {                "id":"row1",                "elements":[                   {                      "name":"etID",                      "tag":"etId-rail1",                      "type":"EDITBOX-ID", 					 "description": "",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-rail1",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }, 			{                "id":"row2",                "elements":[                   {                      "name":"etID",                      "tag":"etId-rail2",                      "type":"EDITBOX-ID", 					 "description": "",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-rail2",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }, 			{                "id":"row3",                "elements":[                   {                      "name":"etID",                      "tag":"etId-rail3",                      "type":"EDITBOX-ID", 					 "description": "",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-rail3",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }          ]       }, 	  {          "title":"TIES",          "data":[             {                "id":"row1",                "elements":[                   {                      "name":"etID",                      "tag":"etId-ties1",                      "type":"EDITBOX-ID", 					 "description": "",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-ties1",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }, 			{                "id":"row2",                "elements":[                   {                      "name":"etID",                      "tag":"etId-ties2",                      "type":"EDITBOX-ID", 					 "description": "",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-ties2",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }, 			{                "id":"row3",                "elements":[                   {                      "name":"etID",                      "tag":"etId-ties3",                      "type":"EDITBOX-ID", 					 "description": "",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-ties3",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }          ]       }, 	  {          "title":"SPIKES and PLATES",          "data":[             {                "id":"row1",                "elements":[                   {                      "name":"etID",                      "tag":"etId-spike1",                      "type":"EDITBOX-ID", 					 "description": "",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-spike1",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }, 			{                "id":"row2",                "elements":[                   {                      "name":"etID",                      "tag":"etId-spike2",                      "type":"EDITBOX-ID", 					 "description": "",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-spike2",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }          ]       }, 	  {          "title":"JOINT BARS/BOLTS",          "data":[             {                "id":"row1",                "elements":[                   {                      "name":"etID",                      "tag":"etId-joint1",                      "type":"EDITBOX-ID", 					 "description": "",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-joint1",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }, 			{                "id":"row2",                "elements":[                   {                      "name":"etID",                      "tag":"etId-joint2",                      "type":"EDITBOX-ID", 					 "description": "",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-joint2",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }		          ]       }, 	  {          "title":"BALLAST",          "data":[             {                "id":"row1",                "elements":[                   {                      "name":"etID",                      "tag":"etId-ballast1",                      "type":"EDITBOX-ID", 					 "description": "",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-ballast1",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }, 			{                "id":"row2",                "elements":[                   {                      "name":"etID",                      "tag":"etId-ballast2",                      "type":"EDITBOX-ID", 					 "description": "",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-ballast2",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }          ]       }, 	  {          "title":"GAUGE RODS",          "data":[             {                "id":"row1",                "elements":[                   {                      "name":"etID",                      "tag":"etId-gauge1",                      "type":"EDITBOX-ID", 					 "description": "",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-gauge1",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }, 			{                "id":"row2",                "elements":[                   {                      "name":"etID",                      "tag":"etId-gauge2",                      "type":"EDITBOX-ID", 					 "description": "",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-gauge2",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }          ]       }, 	  {          "title":"TRACK GAUGE",          "data":[             {                "id":"row1",                "elements":[                   {                      "name":"etID",                      "tag":"etId-trackGauge1",                      "type":"EDITBOX-ID", 					 "description": "",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-trackGauge1",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }, 			{                "id":"row2",                "elements":[                   {                      "name":"etID",                      "tag":"etId-trackGauge2",                      "type":"EDITBOX-ID", 					 "description": "",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-trackGauge2",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }          ]       }, 	  {          "title":"TRACK GAUGE and SURFACE",          "data":[             {                "id":"row1",                "elements":[                   {                      "name":"etID",                      "tag":"etId-trackGaugeSurface1",                      "type":"EDITBOX-ID", 					 "description": "",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-trackGaugeSurface1",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }, 			{                "id":"row2",                "elements":[                   {                      "name":"etID",                      "tag":"etId-trackGaugeSurface2",                      "type":"EDITBOX-ID", 					 "description": "",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-trackGaugeSurface2",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }          ]       }, 	  {          "title":"TRACK CROSS-LEVEL",          "data":[             {                "id":"row1",                "elements":[                   {                      "name":"etID",                      "tag":"etId-trackCrossLevel1",                      "type":"EDITBOX-ID", 					 "description": "",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-trackCrossLevel1",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }, 			{                "id":"row2",                "elements":[                   {                      "name":"etID",                      "tag":"etId-trackCrossLevel2",                      "type":"EDITBOX-ID", 					 "description": "",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-trackCrossLevel2",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }		          ]       }     ]}';
export let switchInspForm =
  '{"name":"Turnout Inspection",    "headings": {"visible" : false, "field1": "Track ID", "field2": "Describe"},    "fields":[    {          "title":"SWITCH NUMBER",          "data":[             {                "id":"row1",                "elements":[                   {                      "name":"tvTitle",                      "tag":"tvTitle-switchNumber1",                      "type":"TEXT", 					 "description": " ",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-switchNumber1",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }, 			{                "id":"row2",                "elements":[                   {                      "name":"tvTitle",                      "tag":"tvTitle-switchNumber2",                      "type":"TEXT", 					 "description": "Ballast: ",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-switchNumber2",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }, 			{                "id":"row3",                "elements":[                   {                      "name":"tvTitle",                      "tag":"tvTitle-switchNumber3",                      "type":"TEXT", 					 "description": "Rails: ",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-switchNumber3",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }, 			{                "id":"row4",                "elements":[                   {                      "name":"tvTitle",                      "tag":"tvTitle-switchNumber4",                      "type":"TEXT", 					 "description": "Ties: ",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-switchNumber4",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }, 			{                "id":"row5",                "elements":[                   {                      "name":"tvTitle",                      "tag":"tvTitle-switchNumber5",                      "type":"TEXT", 					 "description": "Spikes: ",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-switchNumber5",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }          ]       }, {          "title":"PLATES",          "data":[             {                "id":"row1",                "elements":[                   {                      "name":"tvTitle",                      "tag":"tvTitle-plates1",                      "type":"TEXT", 					 "description": "Single: ",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-plates1",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }, 			{                "id":"row2",                "elements":[                   {                      "name":"tvTitle",                      "tag":"tvTitle-plates2",                      "type":"TEXT", 					 "description": "Twin hook: ",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-plates2",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }, 			{                "id":"row3",                "elements":[                   {                      "name":"tvTitle",                      "tag":"tvTitle-plates3",                      "type":"TEXT", 					 "description": "Slide: ",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-plates3",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }          ]       }, {          "title":"BOLTS",          "data":[             {                "id":"row1",                "elements":[                   {                      "name":"tvTitle",                      "tag":"tvTitle-bolts1",                      "type":"TEXT", 					 "description": "Bolts: ",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-bolts1",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }          ]       }, {          "title":"SPLIT RAILS",          "data":[             {                "id":"row1",                "elements":[                   {                      "name":"tvTitle",                      "tag":"tvTitle-splitRails1",                      "type":"TEXT", 					 "description": "Wear of Points: ",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-splitRails1",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }, 			{                "id":"row2",                "elements":[                   {                      "name":"tvTitle",                      "tag":"tvTitle-splitRails2",                      "type":"TEXT", 					 "description": "Fit against stock rails: ",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-splitRails2",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }          ]       },	 {          "title":"RAIL BRACES",          "data":[             {                "id":"row1",                "elements":[                   {                      "name":"tvTitle",                      "tag":"tvTitle-railBraces1",                      "type":"TEXT", 					 "description": "Rail Braces: ",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-railBraces1",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }          ]       }, {          "title":"FROG",          "data":[             {                "id":"row1",                "elements":[                   {                      "name":"tvTitle",                      "tag":"tvTitle-frog1",                      "type":"TEXT", 					 "description": "Self-Guarding: ",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-frog1",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }, 			{                "id":"row2",                "elements":[                   {                      "name":"tvTitle",                      "tag":"tvTitle-frog2",                      "type":"TEXT", 					 "description": "Bolted Rigid Frog: ",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-frog2",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }, 			{                "id":"row3",                "elements":[                   {                      "name":"tvTitle",                      "tag":"tvTitle-frog3",                      "type":"TEXT", 					 "description": "Heal: ",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-frog3",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }, 			{                "id":"row4",                "elements":[                   {                      "name":"tvTitle",                      "tag":"tvTitle-frog4",                      "type":"TEXT", 					 "description": "Point: ",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-frog4",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }, 			{                "id":"row5",                "elements":[                   {                      "name":"tvTitle",                      "tag":"tvTitle-frog5",                      "type":"TEXT", 					 "description": "Throat: ",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-frog5",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }          ]       }, 	  {          "title":"GUARD RAILS",          "data":[             {                "id":"row1",                "elements":[                   {                      "name":"tvTitle",                      "tag":"tvTitle-guardRails1",                      "type":"TEXT", 					 "description": "Guard Rails: ",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-guardRails1",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }          ]       }, 	  {          "title":"SWITCH RODS",          "data":[             {                "id":"row1",                "elements":[                   {                      "name":"tvTitle",                      "tag":"tvTitle-switchRods1",                      "type":"TEXT", 					 "description": "Bridle bars: ",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-switchRods1",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }, 			{                "id":"row2",                "elements":[                   {                      "name":"tvTitle",                      "tag":"tvTitle-switchRods2",                      "type":"TEXT", 					 "description": "Tight: ",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-switchRods2",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }, 			{                "id":"row3",                "elements":[                   {                      "name":"tvTitle",                      "tag":"tvTitle-switchRods3",                      "type":"TEXT", 					 "description": "Not bent: ",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-switchRods3",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }          ]       }, 	  {          "title":"CONNECTING ROD",          "data":[             {                "id":"row1",                "elements":[                   {                      "name":"tvTitle",                      "tag":"tvTitle-connectingRod1",                      "type":"TEXT", 					 "description": "Connection Rod: ",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-connectingRod1",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }          ]       }, 	  {          "title":"SWITCH MACHINE",          "data":[             {                "id":"row1",                "elements":[                   {                      "name":"tvTitle",                      "tag":"tvTitle-switchMachine1",                      "type":"TEXT", 					 "description": "Ground throw: ",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-switchMachine1",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }, 			{                "id":"row2",                "elements":[                   {                      "name":"tvTitle",                      "tag":"tvTitle-switchMachine2",                      "type":"TEXT", 					 "description": "Throw Arm Locks: ",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-switchMachine2",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }, 			{                "id":"row3",                "elements":[                   {                      "name":"tvTitle",                      "tag":"tvTitle-switchMachine3",                      "type":"TEXT", 					 "description": "Industrial (High Level): ",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-switchMachine3",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }          ]       }, 	  {          "title":"SAFETY DEVICES",          "data":[             {                "id":"row1",                "elements":[                   {                      "name":"tvTitle",                      "tag":"tvTitle-safetyDevices1",                      "type":"TEXT", 					 "description": "Safety Devices: ",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-safetyDevices1",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }          ]       }    ]}';

async function createAssetTypes() {
  let assetTypesToAdd = [
    {
      assetType: "line",
      assetTypeClassify: "linear",
      lampAttributes: LampAttributes["line"],
      timpsAttributes: { code: "0001", description: "line" },
      defectCodes: [],
      inspectionInstructions: "",
      inspectionForms: "",
      plannable: true,
      inspectable: false,
      location: true,
      allowedAssetTypes: ["track", "Station", "Interlocking", "Bridge", "Crossing"],
    },
    // { assetType : "brushCutting", assetTypeClassify : "linear", lampAttributes: LampAttributes['brushCutting'], timpsAttributes: {code:'0002', description:'brushCutting'}, defectCodes : [], inspectionInstructions : "", inspectionForms : "", plannable: false inspectable: true,, location: false},
    //{ assetType : "adjRailTemp", assetTypeClassify : "linear", lampAttributes:LampAttributes['adjRailTemp'], timpsAttributes: {code:'0003', description:'adjRailTemp'}, defectCodes : [], inspectionInstructions : "", inspectionForms : "", plannable: false inspectable: true,, location: false},
    // { assetType : "ties", assetTypeClassify : "linear", lampAttributes:LampAttributes['ties'], timpsAttributes: {code:'0004', description:'ties'}, defectCodes : [], inspectionInstructions : "", inspectionForms : "", plannable: false inspectable: true, location: false},
    // { assetType : "surfacing", assetTypeClassify : "linear", lampAttributes:LampAttributes['surfacing'], timpsAttributes: {code:'0005', description:'surfacing'}, defectCodes : [], inspectionInstructions : "", inspectionForms : "", plannable: false inspectable: true,, location: false},
    {
      assetType: "track",
      assetTypeClassify: "linear",
      lampAttributes: LampAttributes["track"],
      timpsAttributes: { code: "0006", description: "track" },
      defectCodes: defectCodes,
      inspectionInstructions: inspectionInstructions,
      inspectionForms: trackInspForm,
      plannable: false,
      inspectable: true,
      location: false,
      defectCodesObj: defectCodes,
      inspectionFormsObj: JSON.parse(trackInspForm),
      allowedAssetTypes: ["rail", "3rd Rail", "Switch", "Crossing", "Signal", "Station"],
    },
    {
      assetType: "rail",
      assetTypeClassify: "linear",
      lampAttributes: LampAttributes["rail"],
      timpsAttributes: { code: "0007", description: "rail" },
      defectCodes: defectCodes,
      inspectionInstructions: inspectionInstructions,
      inspectionForms: trackInspForm,
      plannable: false,
      inspectable: false,
      location: false,
      defectCodesObj: defectCodes,
      inspectionFormsObj: JSON.parse(trackInspForm),
      allowedAssetTypes: [],
    },
    {
      assetType: "3rd Rail",
      assetTypeClassify: "linear",
      lampAttributes: LampAttributes["rail"],
      timpsAttributes: { code: "0031", description: "3rd Rail" },
      defectCodes: defectCodes,
      inspectionInstructions: inspectionInstructions,
      inspectionForms: trackInspForm,
      plannable: false,
      inspectable: true,
      location: false,
      defectCodesObj: defectCodes,
      inspectionFormsObj: JSON.parse(trackInspForm),
      allowedAssetTypes: [],
    },
    //{ assetType : "Access Point", assetTypeClassify : "point", lampAttributes:[], timpsAttributes: {code:'0008', description:'Access Point'}, defectCodes : defectCodes, inspectionInstructions : inspectionInstructions, inspectionForms : inspectionForms, plannable: false inspectable: true,, location: false},

    //{ assetType : "Overpass", assetTypeClassify : "point", lampAttributes:[], timpsAttributes: {code:'0010', description:'Overpass'}, defectCodes : defectCodes, inspectionInstructions : inspectionInstructions, inspectionForms : inspectionForms, plannable: false inspectable: true, location: false},
    //{ assetType : "Derail", assetTypeClassify : "point", lampAttributes:[], timpsAttributes: {code:'0012', description:'Derail'}, defectCodes : defectCodes, inspectionInstructions : inspectionInstructions, inspectionForms : inspectionForms, plannable: false inspectable: true, location: false},
    {
      assetType: "Switch",
      assetTypeClassify: "point",
      lampAttributes: [],
      timpsAttributes: { code: "0013", description: "Switch" },
      defectCodes: defectCodes,
      inspectionInstructions: inspectionInstructions,
      inspectionForms: switchInspForm,
      plannable: false,
      inspectable: true,
      location: false,
      defectCodesObj: defectCodes,
      inspectionFormsObj: JSON.parse(switchInspForm),
      allowedAssetTypes: [],
    },
    {
      assetType: "Crossing",
      assetTypeClassify: "point",
      lampAttributes: [],
      timpsAttributes: { code: "0014", description: "Crossing" },
      defectCodes: defectCodes,
      inspectionInstructions: inspectionInstructions,
      inspectionForms: trackInspForm,
      plannable: false,
      inspectable: true,
      location: false,
      defectCodesObj: defectCodes,
      inspectionFormsObj: JSON.parse(trackInspForm),
      allowedAssetTypes: [],
    },
    //{ assetType : "Access point", assetTypeClassify : "point", lampAttributes:[], timpsAttributes: {code:'0015', description:'Access point'}, defectCodes : defectCodes, inspectionInstructions : inspectionInstructions, inspectionForms : inspectionForms, plannable: false inspectable: true,, location: false},

    //{ assetType : "signs", assetTypeClassify : "point", lampAttributes:[], timpsAttributes: {code:'0017', description:'signs'}, defectCodes : defectCodes, inspectionInstructions : inspectionInstructions, inspectionForms : inspectionForms, plannable: false inspectable: true,, location: false},
    // { assetType : "culvets", assetTypeClassify : "point", lampAttributes:[], timpsAttributes: {code:'0018', description:'culvets'}, defectCodes : defectCodes, inspectionInstructions : inspectionInstructions, inspectionForms : inspectionForms, plannable: false inspectable: true,, location: false},
    //{ assetType : "signals", assetTypeClassify : "point", lampAttributes:[], timpsAttributes: {code:'0019', description:'signals'}, defectCodes : defectCodes, inspectionInstructions : inspectionInstructions, inspectionForms : inspectionForms, plannable: false inspectable: true,, location: false},
    //{ assetType : "whistle post", assetTypeClassify : "point", lampAttributes:[], timpsAttributes: {code:'0020', description:'whistle post'}, defectCodes : defectCodes, inspectionInstructions : inspectionInstructions, inspectionForms : inspectionForms, plannable: false inspectable: true,, location: false},
    //{ assetType : "switches", assetTypeClassify : "point", lampAttributes:[], timpsAttributes: {code:'0021', description:'switches'}, defectCodes : defectCodes, inspectionInstructions : inspectionInstructions, inspectionForms : inspectionForms, plannable: false inspectable: true,, location: false},
    //{ assetType : "diamonds", assetTypeClassify : "point", lampAttributes:[], timpsAttributes: {code:'0022', description:'diamonds'}, defectCodes : defectCodes, inspectionInstructions : inspectionInstructions, inspectionForms : inspectionForms, plannable: false inspectable: true,, location: false},
    //{ assetType : "Switch", assetTypeClassify : "point", lampAttributes:[], timpsAttributes: {code:'0025', description:'Switch'}, defectCodes : defectCodes, inspectionInstructions : inspectionInstructions, inspectionForms : inspectionForms, plannable: false inspectable: true,, location: false},
    //{ assetType : "Stone Xing", assetTypeClassify : "point", lampAttributes:[], timpsAttributes: {code:'0026', description:'Stone Xing'}, defectCodes : defectCodes, inspectionInstructions : inspectionInstructions, inspectionForms : inspectionForms, plannable: false inspectable: true,, location: false},
    //{ assetType : "Platform", assetTypeClassify : "point", lampAttributes:[], timpsAttributes: {code:'0027', description:'Platform'}, defectCodes : defectCodes, inspectionInstructions : inspectionInstructions, inspectionForms : inspectionForms, plannable: false inspectable: true,, location: false},
    //{ assetType : "Gas Pipeline", assetTypeClassify : "point", lampAttributes:[], timpsAttributes: {code:'0028', description:'Gas Pipeline'}, defectCodes : defectCodes, inspectionInstructions : inspectionInstructions, inspectionForms : inspectionForms, plannable: false inspectable: true,, location: false},
    //{ assetType : "speed change", assetTypeClassify : "point", lampAttributes:[], timpsAttributes: {code:'0029', description:'speed change'}, defectCodes : defectCodes, inspectionInstructions : inspectionInstructions, inspectionForms : inspectionForms, plannable: false inspectable: true,, location: false},
    {
      assetType: "Station",
      assetTypeClassify: "point",
      lampAttributes: [],
      timpsAttributes: { code: "0030", description: "Station" },
      defectCodes: [],
      inspectionInstructions: "",
      inspectionForms: "",
      plannable: false,
      inspectable: true,
      location: false,
      allowedAssetTypes: [],
    },
    {
      assetType: "Bridge",
      assetTypeClassify: "point",
      lampAttributes: [],
      timpsAttributes: { code: "0016", description: "Bridge" },
      defectCodes: defectCodes,
      inspectionInstructions: inspectionInstructions,
      inspectionForms: "",
      plannable: false,
      inspectable: true,
      location: false,
      allowedAssetTypes: [],
    },
    {
      assetType: "Signal",
      assetTypeClassify: "point",
      lampAttributes: [],
      timpsAttributes: { code: "0011", description: "Signal" },
      defectCodes: defectCodes,
      inspectionInstructions: inspectionInstructions,
      inspectionForms: "",
      plannable: false,
      inspectable: true,
      location: false,
      allowedAssetTypes: [],
    },
    {
      assetType: "Interlocking",
      assetTypeClassify: "point",
      lampAttributes: [],
      timpsAttributes: { code: "0030", description: "Interlocking" },
      defectCodes: defectCodes,
      inspectionInstructions: inspectionInstructions,
      inspectionForms: "",
      plannable: false,
      inspectable: false,
      location: false,
      allowedAssetTypes: [],
    },
    {
      assetType: "Company",
      assetTypeClassify: "point",
      lampAttributes: LampAttributes["line"],
      timpsAttributes: { code: "0001", description: "line" },
      defectCodes: [],
      inspectionInstructions: "",
      inspectionForms: "",
      plannable: false,
      inspectable: false,
      location: true,
      allowedAssetTypes: ["Region"],
    },
    {
      assetType: "Region",
      assetTypeClassify: "point",
      lampAttributes: LampAttributes["line"],
      timpsAttributes: { code: "0001", description: "line" },
      defectCodes: [],
      inspectionInstructions: "",
      inspectionForms: "",
      plannable: false,
      inspectable: false,
      location: true,
      menuFilter: true,
      allowedAssetTypes: ["line"],
    },
  ];

  //   for(const at of assetTypesToAdd)
  //   {
  //     assetType: "Station",
  //     assetTypeClassify: "point",
  //     lampAttributes: [],
  //     timpsAttributes: { code: "0030", description: "Station" },
  //     defectCodes: [],
  //     inspectionInstructions: "",
  //     inspectionForms: "",
  //     plannable: false,
  //     inspectable: true,
  //     location: false,
  //   },
  //   {
  //     assetType: "Location",
  //     assetTypeClassify: "point",
  //     lampAttributes: [],
  //     timpsAttributes: {},
  //     defectCodes: [],
  //     inspectionInstructions: "",
  //     inspectionForms: "",
  //     plannable: false,
  //     inspectable: false,
  //     location: true,
  //   },
  // ];

  for (const at of assetTypesToAdd) {
    await addIfNotExist(AssetTypeModel, { assetType: at.assetType }, at);
  }
}
