let AssetModel = require("../../api/assets/assets.modal");
let AssetTypeModel = require("../../api/assetTypes/assetTypes.model");
import {defectCodes} from './defectCodes';

// import { guid } from "../UUID";

export async function addMinneapolisData() {
  await addAssetTypes();
  await addAssets();
}

async function addTrackWithGenericAssets(trackAsset, genericTrackAssets, lineId) {
  trackAsset.lineId = lineId;
  trackAsset.parentAsset = lineId;

  if (trackAsset.attributes) trackAsset.attributes = JSON.parse(trackAsset.attributes);

  let t1 = await addLampAsset(trackAsset.unitId, trackAsset);
  let track1Id = t1._id.toHexString();

  for (const a of genericTrackAssets) {
    try {
      let a1 = JSON.parse(JSON.stringify(a));
      a1.parentAsset = track1Id;

      if (a1.attributes) a1.attributes = JSON.parse(a1.attributes);

      a1.lineId = lineId;

      a1.start = t1.start;
      a1.end = t1.end;
      a1.assetLength = t1.assetLength;
      a1.unitId = a1.unitId + "." + t1.unitId;
      a1.name = a1.name + " " + t1.name;

      await addLampAsset(a1.unitId, a1);
    } catch (err) {
      console.log(
        "Minneapolis-Data.addTrackWithGenericAssets.catch: track:",
        trackAsset.unitId,
        "asset:",
        a1.unitId,
        "error:",
        err.toString(),
      );
    }
  }
}

async function addLineAssets(childAssets, lineId) {
  for (const childAsset of childAssets) {
    try {
      let ca = JSON.parse(JSON.stringify(childAsset));
      ca.lineId = lineId;
      ca.parentAsset = lineId;

      if (ca.attributes) ca.attributes = JSON.parse(ca.attributes);

      await addLampAsset(ca.unitId, ca);
    } catch (err) {
      console.log("Minneapolis-Data.addLineAssets.catch: line:", lineId, "asset:", ca.unitId, "error:", err.toString());
    }
  }
}

async function addIfNotExist(model, criteria, newEntry)
{
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
    console.log("addIfNotExist in Minneapolist-Data.js, err:", err.toString());
  }
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
    { name: "trackType", type: "string", order: 1 },
    { name: "trackNumber", type: "string", order: 2 },
    { name: "class", type: "string", order: 3 },
    { name: "geoJsonCord", type: "string", order: 4, required: false }
  ],
  surfacing: [{ name: "year", type: "string", order: 1 }],
  ties: [{ name: "year", type: "string", order: 1 }],
  adjRailTemp: [{ name: "year", type: "string", order: 1 }],
  brushCutting: [{ name: "year", type: "string", order: 1 }],
  Bridge: [{ name: "bridgeType", type: "string", order: 1, required: true }],
  line: [{ name: "geoJsonCord", type: "string", order: 1, required: true }, { name: "timezone", type: "string", order: 2, required: true }],
};

//let defectCodes = ["Insufficient number of joint bolts", "Loose/worn joint bolts", "Torch-cut or burned-bolt hole in rail", "Stock rail/switch point not seated or functioning as intended", "Loose, worn, or missing switch components", "Heat kinks", "Worn or defective frog/frog components"];
//let defectCodes = {   "details": [     {       "code": 213.7,       "title": "Designation of qualified persons to supervise certain renewals and inspect track",       "details": [         {           "code": 7.01,           "title": "No written record of names of qualified persons to supervise restorations and enewals of track user traffic and/or to inspect track for defects, or to pass trains over broken rails or pull-aparts."         },         {           "code": 7.02,           "title": "Failure of track owner to provide written authorization to qualified designated individuals."         },         {           "code": 7.03,           "title": "Failure to use qualified person to pass trains over broken rails of pull aparts."         },         {           "code": 7.04,           "title": "Train speed exeeds 10 M.P.H over broken rails or pull apart."         },         {           "code": 7.05,           "title": "Failure to promptly notify and dispatch person fully qualified user 213.7 to the location of the broken rail or pull apart."         }       ]     },     {       "code": 213.9,       "title": "Classes of track; operating speed limits",       "details": [         {           "code": 9.01,           "title": "Failure to restore other than excepted track to compliance the Class 1 standards within 30 days after a person designated under 213.7(a) has determinded that operations may safely continue over defect(s) not meeting Class 1 or excepted track standards."         },         {           "code": 9.02,           "title": "Failure to track owner to enforce, over Class 1 defects, the limiting conditions imposed by person designated under 213.7(s)"         },         {           "code": 9.03,           "title": "Unused."         }       ]     },     {       "code": 213.11,       "title": "Restoration or renewal of track under traffic conditions",       "details": [         {           "code": 11.01,           "title": "Proper qualified supervision not provided at work site during work hours when track in being restored or renewed under traffic conditions."         }       ]     },     {       "code": 213.33,       "title": "Drainage",       "details": [         {           "code": 33.01,           "title": "Drainage or water-carrying facility not maintained."         },         {           "code": 33.02,           "title": "Drainage or water-carrying facility obstructed by debris."         },         {           "code": 33.03,           "title": "Drainage or water-carrying facility collapsed."         },         {           "code": 33.04,           "title": "Drainage or water-carrying facility obstructed by vegetation."         },         {           "code": 33.05,           "title": "Drainage or water-carrying facility obstructed by silting."         },         {           "code": 33.06,           "title": "Drainage or water-carrying facility deteriorated to allow subgrade saturation."         },         {           "code": 33.07,           "title": "Uncontrolled water undercutting track structure or embankment."         },         {           "code": 33.08,           "title": "Flood water reaches to within 1\" from the top of rail."         },         {           "code": 33.09,           "title": "Flood water if covering the top of rail."         }       ]     },     {       "code": 213.37,       "title": "Vegetation",       "details": [         {           "code": 37.01,           "title": "Combustible vegetation around track-carrying structures."         },         {           "code": 37.02,           "title": "Vegetation obstructs visibility of railroad signs and fixed signals."         },         {           "code": 37.03,           "title": "Vegetation obstructs passing of day and night signals by railroad employees."         },         {           "code": 37.04,           "title": "Vegetation interferes with railroad employees performing normal trackside duties. "         },         {           "code": 37.05,           "title": "Vegetation prevents proper functioning of signal and/or communication lines. "         },         {           "code": 37.06,           "title": "Excessive vegetation at train order office depot, interlocking plants, a carman's building, etc., prevents employees on duty from visually inspecting moving equipment when their duties so require. "         },         {           "code": 37.07,           "title": "Excessive vegetation at train meeting points prevents proper inspection by railroad employees of moving equipment."         },         {           "code": 37.08,           "title": "Excessive vegetation in toepaths and around switches where employees are performing normal trackside duties."         },         {           "code": 37.09,           "title": "Vegetation brushing sides of rolling stock."         },         {           "code": 37.1,           "title": "vegetation obstructs visibility of grade crossing warning signs and signals by the travelling public."         }       ]     },     {       "code": 213.39,       "title": "Highway Grade Crossings",       "details": [         {           "code": 39.01,           "title": "Flangeway blocked with foreign material - depth less than 1 1/2\"."         },         {           "code": 39.02,           "title": "Highway surface raised higher than the top of rail."         }       ]     }   ] };
//let inspectionForms = '{         "name" : "FRA 213.233 Track Inspection",         "fields" : [             {                 "title" : "Horizontal Split Head",                 "data" : [                     {                         "id" : "row1",                         "elements" : [                             {                                 "name" : "cbFirst",                                 "tag" : "cb-q1",                                 "type" : "BOOLEAN_CHECKBOX",                                 "defaultValue" : false                             },                             {                                 "name" : "tvFirst",                                 "type" : "STRING",                                 "description" : "Verify horizontal split heads?",                                 "minCharacters" : 10,                                 "maxCharacters" : 100                             },                             {                                 "name" : "swFirst",                                 "tag" : "sw-q1",                                 "type" : "BOOLEAN_SWITCH",                                 "defaultValue" : false                             }                         ]                     }                 ]             },             {                 "title" : "Vertical Split Head",                 "data" : [                     {                         "id" : "row1",                         "elements" : [                             {                                 "name" : "cbFirst",                                 "tag" : "cb-q5",                                 "type" : "BOOLEAN_CHECKBOX",                                 "defaultValue" : false                             },                             {                                 "name" : "tvFirst",                                 "type" : "STRING",                                 "description" : "Verify vertical split heads?",                                 "minCharacters" : 10,                                 "maxCharacters" : 100                             },                             {                                 "name" : "swFirst",                                 "tag" : "sw-q5",                                 "type" : "BOOLEAN_SWITCH",                                 "defaultValue" : false                             }                         ]                     }                 ]             },             {                 "title" : "Engine Burn",                 "data" : [                     {                         "id" : "row1",                         "elements" : [                             {                                 "name" : "cbFirst",                                 "tag" : "cb-q6",                                 "type" : "BOOLEAN_CHECKBOX",                                 "defaultValue" : false                             },                             {                                 "name" : "tvFirst",                                 "type" : "STRING",                                 "description" : "Verify engine burn fractures?",                                 "minCharacters" : 10,                                 "maxCharacters" : 100                             },                             {                                 "name" : "swFirst",                                 "tag" : "sw-q6",                                 "type" : "BOOLEAN_SWITCH",                                 "defaultValue" : false                             }                         ]                     }                 ]             },             {                 "title" : "Head and Web",                 "data" : [                     {                         "id" : "row1",                         "elements" : [                             {                                 "name" : "cbFirst",                                 "tag" : "cb-q7",                                 "type" : "BOOLEAN_CHECKBOX",                                 "defaultValue" : false                             },                             {                                 "name" : "tvFirst",                                 "type" : "STRING",                                 "description" : "Verify for head and web separation?",                                 "minCharacters" : 10,                                 "maxCharacters" : 100                             },                             {                                 "name" : "swFirst",                                 "tag" : "sw-q7",                                 "type" : "BOOLEAN_SWITCH",                                 "defaultValue" : false                             }                         ]                     }                 ]             },             {                 "title" : "Split Web",                 "data" : [                     {                         "id" : "row1",                         "elements" : [                             {                                 "name" : "cbFirst",                                 "tag" : "cb-q8",                                 "type" : "BOOLEAN_CHECKBOX",                                 "defaultValue" : false                             },                             {                                 "name" : "tvFirst",                                 "type" : "STRING",                                 "description" : "Verify for lengthwise crack along the side of web?",                                 "minCharacters" : 10,                                 "maxCharacters" : 100                             },                             {                                 "name" : "swFirst",                                 "tag" : "sw-q8",                                 "type" : "BOOLEAN_SWITCH",                                 "defaultValue" : false                             }                         ]                     }                 ]             },             {                 "title" : "Broken Base",                 "data" : [                     {                         "id" : "row1",                         "elements" : [                             {                                 "name" : "cbFirst",                                 "tag" : "cb-q9",                                 "type" : "BOOLEAN_CHECKBOX",                                 "defaultValue" : false                             },                             {                                 "name" : "tvFirst",                                 "type" : "STRING",                                 "description" : "Verify for break in the base of the rail?",                                 "minCharacters" : 10,                                 "maxCharacters" : 100                             },                             {                                 "name" : "swFirst",                                 "tag" : "sw-q9",                                 "type" : "BOOLEAN_SWITCH",                                 "defaultValue" : false                             }                         ]                     }                 ]             },             {                 "title" : "Bolt Hole Crack",                 "data" : [                     {                         "id" : "row1",                         "elements" : [                             {                                 "name" : "cbFirst",                                 "tag" : "cb-q10",                                 "type" : "BOOLEAN_CHECKBOX",                                 "defaultValue" : false                             },                             {                                 "name" : "tvFirst",                                 "type" : "STRING",                                 "description" : "Verify for bolt hole crack?",                                 "minCharacters" : 10,                                 "maxCharacters" : 100                             },                             {                                 "name" : "swFirst",                                 "tag" : "sw-q10",                                 "type" : "BOOLEAN_SWITCH",                                 "defaultValue" : false                             }                         ]                     }                 ]             },             {                 "title" : "Flattened Rail",                 "data" : [                     {                         "id" : "row1",                         "elements" : [                             {                                 "name" : "cbFirst",                                 "tag" : "cb-q11",                                 "type" : "BOOLEAN_CHECKBOX",                                 "defaultValue" : false                             },                             {                                 "name" : "tvFirst",                                 "type" : "STRING",                                 "description" : "Verify for flattened rail?",                                 "minCharacters" : 10,                                 "maxCharacters" : 100                             },                             {                                 "name" : "swFirst",                                 "tag" : "sw-q11",                                 "type" : "BOOLEAN_SWITCH",                                 "defaultValue" : false                             }                         ]                     }                 ]             }         ]     }';

let inspectionInstructions =
  "[1] Non-class-specific defects found during an inspection by a qualified railroad inspector and not immediately repaired must be noted on the track inspection form. If not immediately repaired, remedial action shall be taken by an individual qualified under §213.7 \n(a). The 30-day period represents the maximum duration that FRA permits any non-class-specific defect(s) to remain in the track. \nFurthermore, it is not intended to create a 30-day timeline for all types of defects as immediate repair or a more restrictive appropriate action may be required at the time of the defect(s) discovery.\n\n [2] While Part 213 does not require the railroad to take the track out of service, due to the severity of these defects, FRA recommends that railroads take the track out of service. \nAt a minimum, however, the railroad should invoke §213.9(b).\n\n [3] This class specific defect requires remedial action 213.9(b).";

// let trackInspForm =
//   '{"name":"FRA 213.233 Track Inspection",    "headings": {"visible" : true, "field1": "Track ID", "field2": "Describe"},    "fields":[    {          "title":"RAILS",          "data":[             {                "id":"row1",                "elements":[                   {                      "name":"etID",                      "tag":"etId-rail1",                      "type":"EDITBOX-ID", 					 "description": "",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-rail1",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }, 			{                "id":"row2",                "elements":[                   {                      "name":"etID",                      "tag":"etId-rail2",                      "type":"EDITBOX-ID", 					 "description": "",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-rail2",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }, 			{                "id":"row3",                "elements":[                   {                      "name":"etID",                      "tag":"etId-rail3",                      "type":"EDITBOX-ID", 					 "description": "",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-rail3",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }          ]       }, 	  {          "title":"TIES",          "data":[             {                "id":"row1",                "elements":[                   {                      "name":"etID",                      "tag":"etId-ties1",                      "type":"EDITBOX-ID", 					 "description": "",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-ties1",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }, 			{                "id":"row2",                "elements":[                   {                      "name":"etID",                      "tag":"etId-ties2",                      "type":"EDITBOX-ID", 					 "description": "",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-ties2",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }, 			{                "id":"row3",                "elements":[                   {                      "name":"etID",                      "tag":"etId-ties3",                      "type":"EDITBOX-ID", 					 "description": "",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-ties3",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }          ]       }, 	  {          "title":"SPIKES and PLATES",          "data":[             {                "id":"row1",                "elements":[                   {                      "name":"etID",                      "tag":"etId-spike1",                      "type":"EDITBOX-ID", 					 "description": "",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-spike1",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }, 			{                "id":"row2",                "elements":[                   {                      "name":"etID",                      "tag":"etId-spike2",                      "type":"EDITBOX-ID", 					 "description": "",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-spike2",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }          ]       }, 	  {          "title":"JOINT BARS/BOLTS",          "data":[             {                "id":"row1",                "elements":[                   {                      "name":"etID",                      "tag":"etId-joint1",                      "type":"EDITBOX-ID", 					 "description": "",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-joint1",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }, 			{                "id":"row2",                "elements":[                   {                      "name":"etID",                      "tag":"etId-joint2",                      "type":"EDITBOX-ID", 					 "description": "",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-joint2",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }		          ]       }, 	  {          "title":"BALLAST",          "data":[             {                "id":"row1",                "elements":[                   {                      "name":"etID",                      "tag":"etId-ballast1",                      "type":"EDITBOX-ID", 					 "description": "",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-ballast1",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }, 			{                "id":"row2",                "elements":[                   {                      "name":"etID",                      "tag":"etId-ballast2",                      "type":"EDITBOX-ID", 					 "description": "",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-ballast2",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }          ]       }, 	  {          "title":"GAUGE RODS",          "data":[             {                "id":"row1",                "elements":[                   {                      "name":"etID",                      "tag":"etId-gauge1",                      "type":"EDITBOX-ID", 					 "description": "",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-gauge1",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }, 			{                "id":"row2",                "elements":[                   {                      "name":"etID",                      "tag":"etId-gauge2",                      "type":"EDITBOX-ID", 					 "description": "",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-gauge2",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }          ]       }, 	  {          "title":"TRACK GAUGE",          "data":[             {                "id":"row1",                "elements":[                   {                      "name":"etID",                      "tag":"etId-trackGauge1",                      "type":"EDITBOX-ID", 					 "description": "",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-trackGauge1",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }, 			{                "id":"row2",                "elements":[                   {                      "name":"etID",                      "tag":"etId-trackGauge2",                      "type":"EDITBOX-ID", 					 "description": "",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-trackGauge2",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }          ]       }, 	  {          "title":"TRACK GAUGE and SURFACE",          "data":[             {                "id":"row1",                "elements":[                   {                      "name":"etID",                      "tag":"etId-trackGaugeSurface1",                      "type":"EDITBOX-ID", 					 "description": "",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-trackGaugeSurface1",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }, 			{                "id":"row2",                "elements":[                   {                      "name":"etID",                      "tag":"etId-trackGaugeSurface2",                      "type":"EDITBOX-ID", 					 "description": "",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-trackGaugeSurface2",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }          ]       }, 	  {          "title":"TRACK CROSS-LEVEL",          "data":[             {                "id":"row1",                "elements":[                   {                      "name":"etID",                      "tag":"etId-trackCrossLevel1",                      "type":"EDITBOX-ID", 					 "description": "",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-trackCrossLevel1",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }, 			{                "id":"row2",                "elements":[                   {                      "name":"etID",                      "tag":"etId-trackCrossLevel2",                      "type":"EDITBOX-ID", 					 "description": "",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-trackCrossLevel2",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }		          ]       }     ]}';
// let switchInspForm =
//   '{"name":"Turnout Inspection",    "headings": {"visible" : false, "field1": "Track ID", "field2": "Describe"},    "fields":[    {          "title":"SWITCH NUMBER",          "data":[             {                "id":"row1",                "elements":[                   {                      "name":"tvTitle",                      "tag":"tvTitle-switchNumber1",                      "type":"TEXT", 					 "description": " ",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-switchNumber1",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }, 			{                "id":"row2",                "elements":[                   {                      "name":"tvTitle",                      "tag":"tvTitle-switchNumber2",                      "type":"TEXT", 					 "description": "Ballast: ",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-switchNumber2",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }, 			{                "id":"row3",                "elements":[                   {                      "name":"tvTitle",                      "tag":"tvTitle-switchNumber3",                      "type":"TEXT", 					 "description": "Rails: ",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-switchNumber3",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }, 			{                "id":"row4",                "elements":[                   {                      "name":"tvTitle",                      "tag":"tvTitle-switchNumber4",                      "type":"TEXT", 					 "description": "Ties: ",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-switchNumber4",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }, 			{                "id":"row5",                "elements":[                   {                      "name":"tvTitle",                      "tag":"tvTitle-switchNumber5",                      "type":"TEXT", 					 "description": "Spikes: ",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-switchNumber5",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }          ]       }, {          "title":"PLATES",          "data":[             {                "id":"row1",                "elements":[                   {                      "name":"tvTitle",                      "tag":"tvTitle-plates1",                      "type":"TEXT", 					 "description": "Single: ",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-plates1",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }, 			{                "id":"row2",                "elements":[                   {                      "name":"tvTitle",                      "tag":"tvTitle-plates2",                      "type":"TEXT", 					 "description": "Twin hook: ",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-plates2",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }, 			{                "id":"row3",                "elements":[                   {                      "name":"tvTitle",                      "tag":"tvTitle-plates3",                      "type":"TEXT", 					 "description": "Slide: ",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-plates3",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }          ]       }, {          "title":"BOLTS",          "data":[             {                "id":"row1",                "elements":[                   {                      "name":"tvTitle",                      "tag":"tvTitle-bolts1",                      "type":"TEXT", 					 "description": "Bolts: ",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-bolts1",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }          ]       }, {          "title":"SPLIT RAILS",          "data":[             {                "id":"row1",                "elements":[                   {                      "name":"tvTitle",                      "tag":"tvTitle-splitRails1",                      "type":"TEXT", 					 "description": "Wear of Points: ",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-splitRails1",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }, 			{                "id":"row2",                "elements":[                   {                      "name":"tvTitle",                      "tag":"tvTitle-splitRails2",                      "type":"TEXT", 					 "description": "Fit against stock rails: ",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-splitRails2",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }          ]       },	 {          "title":"RAIL BRACES",          "data":[             {                "id":"row1",                "elements":[                   {                      "name":"tvTitle",                      "tag":"tvTitle-railBraces1",                      "type":"TEXT", 					 "description": "Rail Braces: ",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-railBraces1",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }          ]       }, {          "title":"FROG",          "data":[             {                "id":"row1",                "elements":[                   {                      "name":"tvTitle",                      "tag":"tvTitle-frog1",                      "type":"TEXT", 					 "description": "Self-Guarding: ",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-frog1",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }, 			{                "id":"row2",                "elements":[                   {                      "name":"tvTitle",                      "tag":"tvTitle-frog2",                      "type":"TEXT", 					 "description": "Bolted Rigid Frog: ",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-frog2",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }, 			{                "id":"row3",                "elements":[                   {                      "name":"tvTitle",                      "tag":"tvTitle-frog3",                      "type":"TEXT", 					 "description": "Heal: ",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-frog3",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }, 			{                "id":"row4",                "elements":[                   {                      "name":"tvTitle",                      "tag":"tvTitle-frog4",                      "type":"TEXT", 					 "description": "Point: ",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-frog4",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }, 			{                "id":"row5",                "elements":[                   {                      "name":"tvTitle",                      "tag":"tvTitle-frog5",                      "type":"TEXT", 					 "description": "Throat: ",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-frog5",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }          ]       }, 	  {          "title":"GUARD RAILS",          "data":[             {                "id":"row1",                "elements":[                   {                      "name":"tvTitle",                      "tag":"tvTitle-guardRails1",                      "type":"TEXT", 					 "description": "Guard Rails: ",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-guardRails1",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }          ]       }, 	  {          "title":"SWITCH RODS",          "data":[             {                "id":"row1",                "elements":[                   {                      "name":"tvTitle",                      "tag":"tvTitle-switchRods1",                      "type":"TEXT", 					 "description": "Bridle bars: ",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-switchRods1",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }, 			{                "id":"row2",                "elements":[                   {                      "name":"tvTitle",                      "tag":"tvTitle-switchRods2",                      "type":"TEXT", 					 "description": "Tight: ",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-switchRods2",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }, 			{                "id":"row3",                "elements":[                   {                      "name":"tvTitle",                      "tag":"tvTitle-switchRods3",                      "type":"TEXT", 					 "description": "Not bent: ",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-switchRods3",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }          ]       }, 	  {          "title":"CONNECTING ROD",          "data":[             {                "id":"row1",                "elements":[                   {                      "name":"tvTitle",                      "tag":"tvTitle-connectingRod1",                      "type":"TEXT", 					 "description": "Connection Rod: ",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-connectingRod1",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }          ]       }, 	  {          "title":"SWITCH MACHINE",          "data":[             {                "id":"row1",                "elements":[                   {                      "name":"tvTitle",                      "tag":"tvTitle-switchMachine1",                      "type":"TEXT", 					 "description": "Ground throw: ",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-switchMachine1",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }, 			{                "id":"row2",                "elements":[                   {                      "name":"tvTitle",                      "tag":"tvTitle-switchMachine2",                      "type":"TEXT", 					 "description": "Throw Arm Locks: ",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-switchMachine2",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }, 			{                "id":"row3",                "elements":[                   {                      "name":"tvTitle",                      "tag":"tvTitle-switchMachine3",                      "type":"TEXT", 					 "description": "Industrial (High Level): ",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-switchMachine3",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }          ]       }, 	  {          "title":"SAFETY DEVICES",          "data":[             {                "id":"row1",                "elements":[                   {                      "name":"tvTitle",                      "tag":"tvTitle-safetyDevices1",                      "type":"TEXT", 					 "description": "Safety Devices: ",                      "defaultValue":""                   },                   {                      "name":"etDesc", 					 "tag":"etDesc-safetyDevices1",                      "type":"EDITBOX",                      "description":"",                      "minCharacters":10,                      "maxCharacters":100                   }                ]             }          ]       }    ]}';

// do not need inspection forms for assets other than parent stations
let trackInspForm={}, switchInspForm={};


async function addAssetTypes()
{
  let assetTypesToAdd = [
    {
      assetType: "Big Lake Station",
      assetTypeClassify: "linear",
      lampAttributes: LampAttributes["line"], // use line attributes e.g. geoJsonCord and timezone
      timpsAttributes: { code: "0101", description: "Big Lake Station" },
      defectCodes: "",
      defectCodesObj: defectCodes,
      inspectionInstructions: inspectionInstructions,
      inspectionForms: "",
      plannable: true,
      inspectable: false,
      location: true,
      allowedAssetTypes: ['track', 'Switch'],
      inspectionFormsObj : {
        "name" : "Northstar Monthly Track and Switch Maintenance (Big Lake)",
        "fields" : [ 
            {
                "title" : "1. Inspect all joint bars. Ensure all bolts/nuts are tightened. Apply WD40 to all bolts.",
                "data" : [ 
                    {
                        "id" : "row1",
                        "elements" : [ 
                            {
                                "name" : "cbFirst",
                                "tag" : "cb-q1",
                                "type" : "BOOLEAN_CHECKBOX",
                                "defaultValue" : false
                            }, 
                            {
                                "name" : "tvFirst",
                                "type" : "STRING",
                                "description" : "Repair track",
                                "minCharacters" : 10,
                                "maxCharacters" : 100
                            }, 
                            {
                                "name" : "swFirst",
                                "tag" : "sw-q1",
                                "type" : "BOOLEAN_SWITCH",
                                "defaultValue" : false
                            }
                        ]
                    }, 
                    {
                        "id" : "row1",
                        "elements" : [ 
                            {
                                "name" : "cbFirst",
                                "tag" : "cb-q1.2",
                                "type" : "BOOLEAN_CHECKBOX",
                                "defaultValue" : false
                            }, 
                            {
                                "name" : "tvFirst",
                                "type" : "STRING",
                                "description" : "S&I Track",
                                "minCharacters" : 10,
                                "maxCharacters" : 100
                            }, 
                            {
                                "name" : "swFirst",
                                "tag" : "sw-q1.2",
                                "type" : "BOOLEAN_SWITCH",
                                "defaultValue" : false
                            }
                        ]
                    }, 
                    {
                        "id" : "row1",
                        "elements" : [ 
                            {
                                "name" : "cbFirst",
                                "tag" : "cb-q1.3",
                                "type" : "BOOLEAN_CHECKBOX",
                                "defaultValue" : false
                            }, 
                            {
                                "name" : "tvFirst",
                                "type" : "STRING",
                                "description" : "Pass Through",
                                "minCharacters" : 10,
                                "maxCharacters" : 100
                            }, 
                            {
                                "name" : "swFirst",
                                "tag" : "sw-q1.3",
                                "type" : "BOOLEAN_SWITCH",
                                "defaultValue" : false
                            }
                        ]
                    }, 
                    {
                        "id" : "row1",
                        "elements" : [ 
                            {
                                "name" : "cbFirst",
                                "tag" : "cb-q1.4",
                                "type" : "BOOLEAN_CHECKBOX",
                                "defaultValue" : false
                            }, 
                            {
                                "name" : "tvFirst",
                                "type" : "STRING",
                                "description" : "Wash Track",
                                "minCharacters" : 10,
                                "maxCharacters" : 100
                            }, 
                            {
                                "name" : "swFirst",
                                "tag" : "sw-q1.4",
                                "type" : "BOOLEAN_SWITCH",
                                "defaultValue" : false
                            }
                        ]
                    }, 
                    {
                        "id" : "row1",
                        "elements" : [ 
                            {
                                "name" : "cbFirst",
                                "tag" : "cb-q1.5",
                                "type" : "BOOLEAN_CHECKBOX",
                                "defaultValue" : false
                            }, 
                            {
                                "name" : "tvFirst",
                                "type" : "STRING",
                                "description" : "Storage Track",
                                "minCharacters" : 10,
                                "maxCharacters" : 100
                            }, 
                            {
                                "name" : "swFirst",
                                "tag" : "sw-q1.5",
                                "type" : "BOOLEAN_SWITCH",
                                "defaultValue" : false
                            }
                        ]
                    }
                ]
            }, 
            {
                "title" : "2. Inspect all switches. Ensure all bolts are tight and all cotter pins are in place. Apply Triflow or WD-40 to all switch bolts and derail locks. Lubricate switch plates using Glidex. Apply approved lithium grease to all grease zerks.",
                "data" : [ 
                    {
                        "id" : "row1",
                        "elements" : [ 
                            {
                                "name" : "cbFirst",
                                "tag" : "cb-q5",
                                "type" : "BOOLEAN_CHECKBOX",
                                "defaultValue" : false
                            }, 
                            {
                                "name" : "tvFirst",
                                "type" : "STRING",
                                "description" : "Switch 1",
                                "minCharacters" : 10,
                                "maxCharacters" : 100
                            }, 
                            {
                                "name" : "swFirst",
                                "tag" : "sw-q5",
                                "type" : "BOOLEAN_SWITCH",
                                "defaultValue" : false
                            }
                        ]
                    }, 
                    {
                        "id" : "row1",
                        "elements" : [ 
                            {
                                "name" : "cbFirst",
                                "tag" : "cb-q5.2",
                                "type" : "BOOLEAN_CHECKBOX",
                                "defaultValue" : false
                            }, 
                            {
                                "name" : "tvFirst",
                                "type" : "STRING",
                                "description" : "Switch 2",
                                "minCharacters" : 10,
                                "maxCharacters" : 100
                            }, 
                            {
                                "name" : "swFirst",
                                "tag" : "sw-q5.2",
                                "type" : "BOOLEAN_SWITCH",
                                "defaultValue" : false
                            }
                        ]
                    }, 
                    {
                        "id" : "row1",
                        "elements" : [ 
                            {
                                "name" : "cbFirst",
                                "tag" : "cb-q5.3",
                                "type" : "BOOLEAN_CHECKBOX",
                                "defaultValue" : false
                            }, 
                            {
                                "name" : "tvFirst",
                                "type" : "STRING",
                                "description" : "Switch 3",
                                "minCharacters" : 10,
                                "maxCharacters" : 100
                            }, 
                            {
                                "name" : "swFirst",
                                "tag" : "sw-q5.3",
                                "type" : "BOOLEAN_SWITCH",
                                "defaultValue" : false
                            }
                        ]
                    }, 
                    {
                        "id" : "row1",
                        "elements" : [ 
                            {
                                "name" : "cbFirst",
                                "tag" : "cb-q5.4",
                                "type" : "BOOLEAN_CHECKBOX",
                                "defaultValue" : false
                            }, 
                            {
                                "name" : "tvFirst",
                                "type" : "STRING",
                                "description" : "Switch 4",
                                "minCharacters" : 10,
                                "maxCharacters" : 100
                            }, 
                            {
                                "name" : "swFirst",
                                "tag" : "sw-q5.4",
                                "type" : "BOOLEAN_SWITCH",
                                "defaultValue" : false
                            }
                        ]
                    }, 
                    {
                        "id" : "row1",
                        "elements" : [ 
                            {
                                "name" : "cbFirst",
                                "tag" : "cb-q5.5",
                                "type" : "BOOLEAN_CHECKBOX",
                                "defaultValue" : false
                            }, 
                            {
                                "name" : "tvFirst",
                                "type" : "STRING",
                                "description" : "Switch 5",
                                "minCharacters" : 10,
                                "maxCharacters" : 100
                            }, 
                            {
                                "name" : "swFirst",
                                "tag" : "sw-q5.5",
                                "type" : "BOOLEAN_SWITCH",
                                "defaultValue" : false
                            }
                        ]
                    }, 
                    {
                        "id" : "row1",
                        "elements" : [ 
                            {
                                "name" : "cbFirst",
                                "tag" : "cb-q5.6",
                                "type" : "BOOLEAN_CHECKBOX",
                                "defaultValue" : false
                            }, 
                            {
                                "name" : "tvFirst",
                                "type" : "STRING",
                                "description" : "Switch 6",
                                "minCharacters" : 10,
                                "maxCharacters" : 100
                            }, 
                            {
                                "name" : "swFirst",
                                "tag" : "sw-q5.6",
                                "type" : "BOOLEAN_SWITCH",
                                "defaultValue" : false
                            }
                        ]
                    }, 
                    {
                        "id" : "row1",
                        "elements" : [ 
                            {
                                "name" : "cbFirst",
                                "tag" : "cb-q5.7",
                                "type" : "BOOLEAN_CHECKBOX",
                                "defaultValue" : false
                            }, 
                            {
                                "name" : "tvFirst",
                                "type" : "STRING",
                                "description" : "Switch 7",
                                "minCharacters" : 10,
                                "maxCharacters" : 100
                            }, 
                            {
                                "name" : "swFirst",
                                "tag" : "sw-q5.7",
                                "type" : "BOOLEAN_SWITCH",
                                "defaultValue" : false
                            }
                        ]
                    }
                ]
            }, 
            {
                "title" : "3.",
                "data" : [ 
                    {
                        "id" : "row1",
                        "elements" : [ 
                            {
                                "name" : "cbFirst",
                                "tag" : "cb-q6",
                                "type" : "BOOLEAN_CHECKBOX",
                                "defaultValue" : false
                            }, 
                            {
                                "name" : "tvFirst",
                                "type" : "STRING",
                                "description" : "Inspect all derails. Using approved lithium grease, grease all zerks. Apply Triflow lubricant to derail locks.",
                                "minCharacters" : 10,
                                "maxCharacters" : 100
                            }, 
                            {
                                "name" : "swFirst",
                                "tag" : "sw-q6",
                                "type" : "BOOLEAN_SWITCH",
                                "defaultValue" : false
                            }
                        ]
                    }
                ]
            }, 
            {
                "title" : "4.",
                "data" : [ 
                    {
                        "id" : "row1",
                        "elements" : [ 
                            {
                                "name" : "cbFirst",
                                "tag" : "cb-q7",
                                "type" : "BOOLEAN_CHECKBOX",
                                "defaultValue" : false
                            }, 
                            {
                                "name" : "tvFirst",
                                "type" : "STRING",
                                "description" : "Inspect all rail clips. Ensure they are properly in place with a ¼” gap.",
                                "minCharacters" : 10,
                                "maxCharacters" : 100
                            }, 
                            {
                                "name" : "swFirst",
                                "tag" : "sw-q7",
                                "type" : "BOOLEAN_SWITCH",
                                "defaultValue" : false
                            }
                        ]
                    }
                ]
            }, 
            {
                "title" : "5.",
                "data" : [ 
                    {
                        "id" : "row1",
                        "elements" : [ 
                            {
                                "name" : "cbFirst",
                                "tag" : "cb-q8",
                                "type" : "BOOLEAN_CHECKBOX",
                                "defaultValue" : false
                            }, 
                            {
                                "name" : "tvFirst",
                                "type" : "STRING",
                                "description" : "Ensure all spikes, anchors, and all other fastening devices are in place.",
                                "minCharacters" : 10,
                                "maxCharacters" : 100
                            }, 
                            {
                                "name" : "swFirst",
                                "tag" : "sw-q8",
                                "type" : "BOOLEAN_SWITCH",
                                "defaultValue" : false
                            }
                        ]
                    }
                ]
            }, 
            {
                "title" : "6.",
                "data" : [ 
                    {
                        "id" : "row1",
                        "elements" : [ 
                            {
                                "name" : "cbFirst",
                                "tag" : "cb-q9",
                                "type" : "BOOLEAN_CHECKBOX",
                                "defaultValue" : false
                            }, 
                            {
                                "name" : "tvFirst",
                                "type" : "STRING",
                                "description" : "Remove all trash/debris from in and around the tracks and switch.",
                                "minCharacters" : 10,
                                "maxCharacters" : 100
                            }, 
                            {
                                "name" : "swFirst",
                                "tag" : "sw-q9",
                                "type" : "BOOLEAN_SWITCH",
                                "defaultValue" : false
                            }
                        ]
                    }
                ]
            }, 
            {
                "title" : "7.",
                "data" : [ 
                    {
                        "id" : "row1",
                        "elements" : [ 
                            {
                                "name" : "cbFirst",
                                "tag" : "cb-q10",
                                "type" : "BOOLEAN_CHECKBOX",
                                "defaultValue" : false
                            }, 
                            {
                                "name" : "tvFirst",
                                "type" : "STRING",
                                "description" : "Inspect all blue lights.",
                                "minCharacters" : 10,
                                "maxCharacters" : 100
                            }, 
                            {
                                "name" : "swFirst",
                                "tag" : "sw-q10",
                                "type" : "BOOLEAN_SWITCH",
                                "defaultValue" : false
                            }
                        ]
                    }
                ]
            }
        ]
       }
    },
    {
      assetType: "track",
      assetTypeClassify: "linear",
      lampAttributes: LampAttributes["track"],
      timpsAttributes: { code: "0106", description: "track" },
      defectCodes: "",
      inspectionInstructions: inspectionInstructions,
      inspectionForms: "",
      plannable: false,
      inspectable: true,
      location: false,
      defectCodesObj: defectCodes,
      inspectionFormsObj: trackInspForm,
      allowedAssetTypes: ['rail', '3rd Rail', 'Switch']
    },
    {
      assetType: "rail",
      assetTypeClassify: "linear",
      lampAttributes: LampAttributes["rail"],
      timpsAttributes: { code: "0107", description: "rail" },
      defectCodes: "",
      inspectionInstructions: inspectionInstructions,
      inspectionForms: "",
      plannable: false,
      inspectable: true,
      location: false,
      defectCodesObj: defectCodes,
      inspectionFormsObj: trackInspForm,
      allowedAssetTypes: []
    },
    {
      assetType: "3rd Rail",
      assetTypeClassify: "linear",
      lampAttributes: LampAttributes["rail"],
      timpsAttributes: { code: "0131", description: "3rd Rail" },
      defectCodes: "",
      inspectionInstructions: inspectionInstructions,
      inspectionForms: "",
      plannable: false,
      inspectable: true,
      location: false,
      defectCodesObj: defectCodes,
      inspectionFormsObj: trackInspForm,
      allowedAssetTypes: []
    },
    {
      assetType: "Switch",
      assetTypeClassify: "point",
      lampAttributes: [],
      timpsAttributes: { code: "0113", description: "Switch" },
      defectCodes: "",
      inspectionInstructions: inspectionInstructions,
      inspectionForms: "",
      plannable: false,
      inspectable: true,
      location: false,
      defectCodesObj: defectCodes,
      inspectionFormsObj: switchInspForm,
      allowedAssetTypes: []
    },
    {
      assetType: "Downtown Station",
      assetTypeClassify: "linear",
      lampAttributes: LampAttributes["line"],
      timpsAttributes: { code: "0130", description: "Downtown Station" },
      defectCodes: "",
      defectCodesObj: defectCodes,
      inspectionInstructions: inspectionInstructions,
      inspectionForms: "",
      plannable: true,
      inspectable: false,
      location: true,
      allowedAssetTypes: ['track', 'Switch'],
      inspectionFormsObj : {
        "name" : "Northstar Monthly Track and Switch Maintenance (Downtown)",
        "fields" : [ 
            {
                "title" : "1. Inspect all joint bars. Ensure all bolts/nuts are tightened. Apply WD40 to all bolts",
                "data" : [ 
                    {
                        "id" : "row1",
                        "elements" : [ 
                            {
                                "name" : "cbFirst",
                                "tag" : "cb-q1",
                                "type" : "BOOLEAN_CHECKBOX",
                                "defaultValue" : false
                            }, 
                            {
                                "name" : "tvFirst",
                                "type" : "STRING",
                                "description" : "Track 1",
                                "minCharacters" : 10,
                                "maxCharacters" : 100
                            }, 
                            {
                                "name" : "swFirst",
                                "tag" : "sw-q1",
                                "type" : "BOOLEAN_SWITCH",
                                "defaultValue" : false
                            }
                        ]
                    }, 
                    {
                        "id" : "row1",
                        "elements" : [ 
                            {
                                "name" : "cbFirst",
                                "tag" : "cb-q1.2",
                                "type" : "BOOLEAN_CHECKBOX",
                                "defaultValue" : false
                            }, 
                            {
                                "name" : "tvFirst",
                                "type" : "STRING",
                                "description" : "Track 2",
                                "minCharacters" : 10,
                                "maxCharacters" : 100
                            }, 
                            {
                                "name" : "swFirst",
                                "tag" : "sw-q1.2",
                                "type" : "BOOLEAN_SWITCH",
                                "defaultValue" : false
                            }
                        ]
                    }
                ]
            }, 
            {
                "title" : "2.",
                "data" : [ 
                    {
                        "id" : "row1",
                        "elements" : [ 
                            {
                                "name" : "cbFirst",
                                "tag" : "cb-q5",
                                "type" : "BOOLEAN_CHECKBOX",
                                "defaultValue" : false
                            }, 
                            {
                                "name" : "tvFirst",
                                "type" : "STRING",
                                "description" : "Inspect switch. Ensure all bolts are tight and all cotter pins are in place. Apply WD40 to all switch bolts. Lubricate switch plates using Glidex. Apply approved lithium grease to all grease zerks.",
                                "minCharacters" : 10,
                                "maxCharacters" : 100
                            }, 
                            {
                                "name" : "swFirst",
                                "tag" : "sw-q5",
                                "type" : "BOOLEAN_SWITCH",
                                "defaultValue" : false
                            }
                        ]
                    }
                ]
            }, 
            {
                "title" : "3.",
                "data" : [ 
                    {
                        "id" : "row1",
                        "elements" : [ 
                            {
                                "name" : "cbFirst",
                                "tag" : "cb-q6",
                                "type" : "BOOLEAN_CHECKBOX",
                                "defaultValue" : false
                            }, 
                            {
                                "name" : "tvFirst",
                                "type" : "STRING",
                                "description" : "Inspect all derails. Using approved lithium grease, grease all zerks. Apply Triflow lubricant to derail locks",
                                "minCharacters" : 10,
                                "maxCharacters" : 100
                            }, 
                            {
                                "name" : "swFirst",
                                "tag" : "sw-q6",
                                "type" : "BOOLEAN_SWITCH",
                                "defaultValue" : false
                            }
                        ]
                    }
                ]
            }, 
            {
                "title" : "4.",
                "data" : [ 
                    {
                        "id" : "row1",
                        "elements" : [ 
                            {
                                "name" : "cbFirst",
                                "tag" : "cb-q7",
                                "type" : "BOOLEAN_CHECKBOX",
                                "defaultValue" : false
                            }, 
                            {
                                "name" : "tvFirst",
                                "type" : "STRING",
                                "description" : "Inspect all rail clips. Ensure they are properly in place with a ¼” gap.",
                                "minCharacters" : 10,
                                "maxCharacters" : 100
                            }, 
                            {
                                "name" : "swFirst",
                                "tag" : "sw-q7",
                                "type" : "BOOLEAN_SWITCH",
                                "defaultValue" : false
                            }
                        ]
                    }
                ]
            }, 
            {
                "title" : "5.",
                "data" : [ 
                    {
                        "id" : "row1",
                        "elements" : [ 
                            {
                                "name" : "cbFirst",
                                "tag" : "cb-q8",
                                "type" : "BOOLEAN_CHECKBOX",
                                "defaultValue" : false
                            }, 
                            {
                                "name" : "tvFirst",
                                "type" : "STRING",
                                "description" : "Ensure all spikes, anchors, and all other fastening devices are in place.",
                                "minCharacters" : 10,
                                "maxCharacters" : 100
                            }, 
                            {
                                "name" : "swFirst",
                                "tag" : "sw-q8",
                                "type" : "BOOLEAN_SWITCH",
                                "defaultValue" : false
                            }
                        ]
                    }
                ]
            }, 
            {
                "title" : "6.",
                "data" : [ 
                    {
                        "id" : "row1",
                        "elements" : [ 
                            {
                                "name" : "cbFirst",
                                "tag" : "cb-q9",
                                "type" : "BOOLEAN_CHECKBOX",
                                "defaultValue" : false
                            }, 
                            {
                                "name" : "tvFirst",
                                "type" : "STRING",
                                "description" : "Remove all trash/debris from in and around the tracks and switch",
                                "minCharacters" : 10,
                                "maxCharacters" : 100
                            }, 
                            {
                                "name" : "swFirst",
                                "tag" : "sw-q9",
                                "type" : "BOOLEAN_SWITCH",
                                "defaultValue" : false
                            }
                        ]
                    }
                ]
            }
        ]
    },

    },
    {
      assetType: "Company",
      assetTypeClassify: "point",
      lampAttributes: [],
      timpsAttributes: {},
      defectCodes: "",
      inspectionInstructions: "",
      inspectionForms: "",
      plannable: false,
      inspectable: false,
      location: true,
      allowedAssetTypes: ['Downtown Station','Big Lake Station'] //Downtown Station 
    },
    // {
    //   assetType: "Region",
    //   assetTypeClassify: "point",
    //   lampAttributes: [],
    //   timpsAttributes: {},
    //   defectCodes: [],
    //   inspectionInstructions: "",
    //   inspectionForms: "",
    //   plannable: false,
    //   inspectable: false,
    //   location: true,
    //   menuFilter: true,
    //   allowedAssetTypes: ['line']
    // },
  ];

  for (const at of assetTypesToAdd) {
    await addIfNotExist(AssetTypeModel, { assetType: at.assetType }, at);
  }

}

async function addAssets() {
  try {

    let mMetro = await addLampAsset(minneapolisMetro.unitId, minneapolisMetro);

    bigLakeStation.parentAsset = mMetro._id;

    let bLS = await addLampAsset(bigLakeStation.unitId, bigLakeStation);

    let bigLakeStationId = bLS._id.toHexString();
   
    await addTrackWithGenericAssets(stationTrack, genericTrackAssets1, bigLakeStationId);
    await addTrackWithGenericAssets(sAndItrack, genericTrackAssets1, bigLakeStationId);
    await addTrackWithGenericAssets(repairTrack, genericTrackAssets1, bigLakeStationId);
    await addTrackWithGenericAssets(passThroughTrack, genericTrackAssets1, bigLakeStationId);
    await addTrackWithGenericAssets(storageTrack, genericTrackAssets1, bigLakeStationId);
    await addTrackWithGenericAssets(washTrack, genericTrackAssets1, bigLakeStationId);

    await addLineAssets(bigLakeSwitches, bigLakeStationId);

    downTownStation.parentAsset = mMetro._id;
    let dTS = await addLampAsset(downTownStation.unitId, downTownStation);
    let downtownStationId = dTS._id.toHexString();
    
    await addTrackWithGenericAssets(downtownTrack1, genericTrackAssetsDowntown , downtownStationId);
    await addTrackWithGenericAssets(downtownTrack2, genericTrackAssetsDowntown , downtownStationId);
    await addLineAssets(downtownSwitches, downtownStationId);
    
  }
  catch (err) 
  {
    console.log("Minneapolis-Data, addAssets, error: ", err.toString());
  }
}
async function addLampAsset(unitId, newAst, createCallback = (err, obj) => {}) {
  let ast = await AssetModel.findOne({ unitId: unitId });
  if (!ast) {
    console.log("adding asset", unitId);
    
    if(typeof newAst.start==="string")
      {
        newAst.start=+(parseFloat(newAst.start).toFixed(2));
      }

      if(newAst.end==="")
      {
        newAst.end=+newAst.start;
        console.log('parsed', newAst.end);
      }

      if(typeof newAst.end==="string")
        newAst.end = +(parseFloat(newAst.end).toFixed(2));

    if(newAst.assetLength==="")
      newAst.assetLength = newAst.end - newAst.start;


    return await AssetModel.create(newAst);
  }
  return ast;
}
 var minneapolisMetro = {
  inspectable: "false",
  parentAsset: null,
  images: [{}],
  documents: [{}],
  childAsset: [],
  isRemoved: "false",
  subdivision: "",
  unitId: "Northstar Metro Transit",
  description: "",
  assetType: "Company",
  frequency: "",
  attributes: "{}",
  name: "Northstar Metro Transit",
};


var bigLakeStation = {
  coordinates: [["", ""], ["", ""]],
  inspectable: false,
  parentAsset: null,
  images: [],
  documents: [],
  childAsset: [],
  isRemoved: false,
  unitId: "BIG LAKE STATION",
  description: "BIG LAKE STATION",
  end: 46.91,
  start: 46.26,
  assetLength: 0.65,
  assetType: "Big Lake Station",
  frequency: null,
  name: "BIG LAKE STATION",
  attributes: {
    geoJsonCord: '{ "type": "FeatureCollection", "name": "BigLake Station Minneapolis", "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } }, "features": [ { "type": "Feature", "properties": { "Name": "BigLake Station Minneapolis", "description": null, "tessellate": 1 }, "geometry": { "type": "LineString", "coordinates": [ [ -93.726942356049179, 45.329535706443281 ], [ -93.725940142000553, 45.329437496546547 ], [ -93.725031371001236, 45.329277381069119 ], [ -93.723160844179105, 45.328793432570073 ], [ -93.714856001894219, 45.328031670774777 ], [ -93.713492134749316, 45.328072163324819 ], [ -93.712375232503533, 45.32798753386443 ] ] } } ] }',
    timezone:'America/Chicago'
      },
  systemAttributes: {
    tooltipText: "BIG LAKE STATION",
    stroke: "#000080",
    strokeWidth: "5",
    tension: "0.1",
    points: '[]',
  },
};

var stationTrack = {
  inspectable: "true",
  parentAsset: "",
  images: [],
  documents: [],
  childAsset: "",
  isRemoved: "false",

  unitId: "Station Track",
  description: "Station Track",
  start: 46.26,
  end: 46.91,
  assetLength: 0.65,
  assetType: "track",
  frequency: "",
  attributes: '{"trackType":"","trackNumber":"1","class":""}',
  name: "Station Track",
};
var sAndItrack = {
  inspectable: "true",
  parentAsset: "",
  images: [],
  documents: [],
  childAsset: "",
  isRemoved: "false",

  unitId: "S&I Track",
  description: "S&I Track",
  start: 46.42,
  end: 46.81,
  assetLength: 0.39,
  assetType: "track",
  frequency: "",
  attributes: '{"trackType":"","trackNumber":"2","class":""}',
  name: "S&I Track",
};
var repairTrack = {
  inspectable: "true",
  parentAsset: "",
  images: [],
  documents: [],
  childAsset: "",
  isRemoved: "false",

  unitId: "Repair Track",
  description: "Repair Track",
  start: 46.49,
  end: 46.74,
  assetLength: 0.25,
  assetType: "track",
  frequency: "",
  attributes: '{"trackType":"","trackNumber":"3","class":""}',
  name: "Repair Track",
};
var passThroughTrack = {
  inspectable: "true",
  parentAsset: "",
  images: [],
  documents: [],
  childAsset: "",
  isRemoved: "false",

  unitId: "Pass-through Track",
  description: "Pass-through Track",
  start: 46.49,
  end: 46.74,
  assetLength: 0.25,
  assetType: "track",
  frequency: "",
  attributes: '{"trackType":"","trackNumber":"4","class":""}',
  name: "Pass-through Track",
};
var storageTrack = {
  inspectable: "true",
  parentAsset: "",
  images: [],
  documents: [],
  childAsset: "",
  isRemoved: "false",

  unitId: "Storage Track",
  description: "Storage Track",
  start: 46.49,
  end: 46.74,
  assetLength: 0.25,
  assetType: "track",
  frequency: "",
  attributes: '{"trackType":"","trackNumber":"5","class":""}',
  name: "Storage Track",
};
var washTrack = {
  inspectable: "true",
  parentAsset: "",
  images: [],
  documents: [],
  childAsset: "",
  isRemoved: "false",

  unitId: "Wash Track",
  description: "Wash Track",
  start: 46.49,
  end: 46.74,
  assetLength: 0.25,
  assetType: "track",
  frequency: "",
  attributes: '{"trackType":"","trackNumber":"6","class":""}',
  name: "Wash Track",
};



var genericTrackAssets1 = [
  {
    inspectable: "true",
    parentAsset: "",
    images: [],
    documents: [],
    childAsset: [],
    isRemoved: "false",

    unitId: "Southern Rail",
    description: "",
    start: 0, // to be populated by parent
    end: 0,
    assetLength: 0,
    assetType: "rail",
    frequency: null,
    attributes: "{}",
    name: "Southern Rail",
    lineId: "",
  },
  {
    inspectable: "true",
    parentAsset: "",
    images: [],
    documents: [],
    childAsset: [],
    isRemoved: "false",

    unitId: "Northern Rail",
    description: "",
    start: 0,
    end: 0,
    assetLength: 0,
    assetType: "rail",
    frequency: null,
    attributes: "{}",
    name: "Northern Rail",
    lineId: "",
  }/*, // do not need 3rd Rail in Minneapolis
  {
    inspectable: "true",
    parentAsset: "",
    images: [],
    documents: [],
    childAsset: [],
    isRemoved: "false",

    unitId: "3rd Rail",
    description: "",
    start: 0,
    end: 0,
    assetLength: 0,
    assetType: "3rd Rail",
    frequency: null,
    attributes: "{}",
    name: "3rd rail",
    lineId: "",
  },*/
];

var bigLakeSwitches=[
    {
    inspectable: "true",
    parentAsset: "",
    images: [],
    documents: [],
    childAsset: [],
    isRemoved: "false",

    unitId: "Switch 1",
    description: "",
    start: 46.85,
    end: 46.85,
    assetLength: 0,
    assetType: "Switch",
    frequency: "",
    attributes: "{}",
    name: "Switch 1",
    lineId: "",
    },
    {
    inspectable: "true",
    parentAsset: "",
    images: [],
    documents: [],
    childAsset: [],
    isRemoved: "false",

    unitId: "Switch 2",
    description: "",
    start: 46.81,
    end: 46.81,
    assetLength: 0,
    assetType: "Switch",
    frequency: "",
    attributes: "{}",
    name: "Switch 2",
    lineId: "",
    },
    {
    inspectable: "true",
    parentAsset: "",
    images: [],
    documents: [],
    childAsset: [],
    isRemoved: "false",

    unitId: "Switch 3",
    description: "",
    start: 46.80,
    end: 46.80,
    assetLength: 0,
    assetType: "Switch",
    frequency: "",
    attributes: "{}",
    name: "Switch 3",
    lineId: "",
    },
    {
    inspectable: "true",
    parentAsset: "",
    images: [],
    documents: [],
    childAsset: [],
    isRemoved: "false",

    unitId: "Switch 4",
    description: "",
    start: 46.74,
    end: 46.74,
    assetLength: 0,
    assetType: "Switch",
    frequency: "",
    attributes: "{}",
    name: "Switch 4",
    lineId: "",
    },
    {
    inspectable: "true",
    parentAsset: "",
    images: [],
    documents: [],
    childAsset: [],
    isRemoved: "false",

    unitId: "Switch 5",
    description: "",
    start: 46.49,
    end: 46.49,
    assetLength: 0,
    assetType: "Switch",
    frequency: "",
    attributes: "{}",
    name: "Switch 5",
    lineId: "",
    },
    {
    inspectable: "true",
    parentAsset: "",
    images: [],
    documents: [],
    childAsset: [],
    isRemoved: "false",

    unitId: "Switch 6",
    description: "",
    start: 46.42,
    end: 46.42,
    assetLength: 0,
    assetType: "Switch",
    frequency: "",
    attributes: "{}",
    name: "Switch 6",
    lineId: "",
    },
    {
    inspectable: "true",
    parentAsset: "",
    images: [],
    documents: [],
    childAsset: [],
    isRemoved: "false",

    unitId: "Switch 7",
    description: "",
    start: 46.38,
    end: 46.38,
    assetLength: 0,
    assetType: "Switch",
    frequency: "",
    attributes: "{}",
    name: "Switch 7",
    lineId: "",
    }
];

var downTownStation= 
{
  coordinates: [["", ""], ["", ""]],
  inspectable: false,
  parentAsset: null,
  images: [],
  documents: [],
  childAsset: [],
  isRemoved: false,
  unitId: "Downtown Layover",
  description: "Downtown Layover",
  start: 11.18,
  end: 11.69,
  assetLength: 0.51,
  assetType: "Downtown Station",
  frequency: null,
  name: "Downtown Layover",
  attributes: {
    geoJsonCord: '{ "type": "FeatureCollection", "name": "TargetField Downtown station Minneapolis", "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } }, "features": [ { "type": "Feature", "properties": { "Name": "TargetField Downtown station Minneapolis", "description": null, "tessellate": 1 }, "geometry": { "type": "LineString", "coordinates": [ [ -93.274110306297686, 44.985347588523759 ], [ -93.274859313386131, 44.984971879970743 ], [ -93.275970845478724, 44.984198277062497 ], [ -93.277468805786043, 44.983161811827593 ], [ -93.278653141862065, 44.982423097397557 ], [ -93.279721372615626, 44.981632826132362 ], [ -93.281134225939141, 44.98053225107374 ], [ -93.282223542136364, 44.979755795944648 ] ] } } ] } ',
    timezone:'America/Chicago'
      },
  systemAttributes: {
    tooltipText: "Downtown Layover",
    stroke: "#000080",
    strokeWidth: "5",
    tension: "0.1",
    points: '[]',
  },
};

var downtownTrack1 = {
  inspectable: "true",
  parentAsset: "",
  images: [],
  documents: [],
  childAsset: "",
  isRemoved: "false",

  unitId: "Track 1",
  description: "Track 1",
  start: 11.18,
  end: 11.69,
  assetLength: 0.51,
  assetType: "track",
  frequency: "",
  attributes: '{"trackType":"","trackNumber":"1","class":""}',
  name: "Track 1",
};

var downtownTrack2 = {
  inspectable: "true",
  parentAsset: "",
  images: [],
  documents: [],
  childAsset: "",
  isRemoved: "false",

  unitId: "Track 2",
  description: "Track 2",
  start: 11.18,
  end: 11.69,
  assetLength: 0.51,
  assetType: "track",
  frequency: "",
  attributes: '{"trackType":"","trackNumber":"2","class":""}',
  name: "Track 2",
};

var genericTrackAssetsDowntown = [
  {
    inspectable: "true",
    parentAsset: "",
    images: [],
    documents: [],
    childAsset: [],
    isRemoved: "false",

    unitId: "Eastern Rail",
    description: "",
    start: 0, // to be populated by parent
    end: 0,
    assetLength: 0,
    assetType: "rail",
    frequency: null,
    attributes: "{}",
    name: "Eastern Rail",
    lineId: "",
  },
  {
    inspectable: "true",
    parentAsset: "",
    images: [],
    documents: [],
    childAsset: [],
    isRemoved: "false",

    unitId: "Western Rail",
    description: "",
    start: 0,
    end: 0,
    assetLength: 0,
    assetType: "rail",
    frequency: null,
    attributes: "{}",
    name: "Western Rail",
    lineId: "",
  },
  /*{ // 3rd rail not required in Minneapolis
    inspectable: "true",
    parentAsset: "",
    images: [],
    documents: [],
    childAsset: [],
    isRemoved: "false",

    unitId: "3rd Rail",
    description: "",
    start: 0,
    end: 0,
    assetLength: 0,
    assetType: "3rd Rail",
    frequency: null,
    attributes: "{}",
    name: "3rd rail",
    lineId: "",
  },*/
];
var downtownSwitches = [{
    inspectable: "true",
    parentAsset: "",
    images: [],
    documents: [],
    childAsset: [],
    isRemoved: "false",

    unitId: "South Turnout Switch",
    description: "",
    start: 11.19,
    end: 11.19,
    assetLength: 0,
    assetType: "Switch",
    frequency: "",
    attributes: "{}",
    name: "South Turnout Switch",
    lineId: "",
    }];

