import { dynamicLanguageToDB } from "../../../dynamicLanguage/languageSeed";
import { addIfNotExist } from "../dbFunctions/dbHelperMethods";
import { frmSwitchInspection } from "./appForms/FingerLake_TIMPS_Forms/fingerLakeSwitchInspectionForm";
// import { form1 } from "./appForms/trackDisturbanceReport";
import { form2 } from "./appForms/relayTestForm";
import { frmAnnualSI4QNS } from "./appForms/IOC_TIMPS_Forms/IOCSwitchAnnualForm";
import { frmMonthlySI4QNS } from "./appForms/IOC_TIMPS_Forms/IOCSwitchMonthlyForm";
import { alphaVals } from "./YardRelated/iocAlphanumerics";
import { formGI303 } from "./appForms/IOCGIForms/Form303";
import { formFicheB12 } from "./appForms/IOCGIForms/Form305B12";
import { formFicheB24 } from "./appForms/IOCGIForms/Form305B24";
import { formFicheB12B24 } from "./appForms/IOCGIForms/Form305B12B24";
import { gi329fa } from "./appForms/IOCGIForms/Form329a";
import { gi329fb } from "./appForms/IOCGIForms/Form329b";
import { gi329fc } from "./appForms/IOCGIForms/Form329c";
import { gi329fd } from "./appForms/IOCGIForms/Form329d";
import { gi313f } from "./appForms/IOCGIForms/Form313";
import { gi334f } from "./appForms/IOCGIForms/Form334";
import { scp907f } from "./appForms/IOCGIForms/Form907";
import { scp902f } from "./appForms/IOCGIForms/Form902";
import { scp901f } from "./appForms/IOCGIForms/Form901";
import { suivimargingi335 } from "./appForms/IOCGIForms/Form335";
import { inspectionForm1, inspectionForm2, inspectionForm3 } from "./appForms/LinearInspections/InspectionForms";
let ApplicationLookupsModel = require("../../../api/ApplicationLookups/ApplicationLookups.model");

function getHtmlForTable(i) {
  if (i == 0 || i == 1) {
    return '<!DOCTYPE html><html lang="en"><head>  <title>Remedial Action Table</title>  <meta charset="utf-8">  <meta name="viewport" content="width=device-width, initial-scale=1">  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script><style>.center {  text-align: center;}p {font-size:17px;line-height:1.6;margin-bottom:20px;margin-left:5px;margin-right:5px;}</style></head><body><div class="container p-3 my-3 border">  <h2>Remedial Action Table</h2>  <table class="table table-hover" border=1>    <thead>      <tr><th rowspan=2 class="center">Defect</th><th colspan=2 class="center">Lenth of defect (inch(es))</th><th colspan=2 class="center">Percentage of existing rail head cross-sectional area</th><th rowspan=2 class="center">if the defective rail is not replaces or repaired, take the remedial action</th>      </tr>      <tr><th class="center">More than</th><th class="center">But not more than</th><th class="center">Less than</th><th class="center">But not less than</th>      </tr>    </thead>    <tbody>      <tr><td>Compound Fissure</td><td></td><td></td><td>70</td><td>5</td><td>B.</td>      </tr>      <tr><td></td><td></td><td></td><td>100</td><td>70</td><td>A2.</td>      </tr>      <tr><td></td><td></td><td></td><td></td><td>100</td><td>A.</td>      </tr><tr><td>Transverse Fissure</td><td></td><td></td><td>25</td><td>5</td><td>C.</td>      </tr><tr><td>Detail Fracture</td><td></td><td></td><td>60</td><td>25</td><td>D.</td>      </tr><tr><td>Engine Burn Fracture</td><td></td><td></td><td>100</td><td>60</td><td>A2, or [E and H]</td>      </tr><tr><td>Defective Weld</td><td></td><td></td><td></td><td>100</td><td>A, or [E and H].</td>      </tr><tr><td>Bolt Hole Crack</td><td>3/4</td><td>1</td><td></td><td></td><td>H and F.</td>      </tr><tr><td> </td><td>1</td><td>1 1/2</td><td></td><td></td><td>H and G.</td>      </tr><tr><td> </td><td>1</td><td></td><td></td><td></td><td>B.</td>      </tr><tr><td> </td><td>1 1/2</td><td></td><td></td><td></td><td></td>      </tr><tr><td> </td><td>(1)</td><td>(1)</td><td></td><td></td><td>A.</td>      </tr><tr><td>Broken Base </td><td>1</td><td>6</td><td></td><td></td><td>D.</td>      </tr><tr><td> </td><td>6 2</td><td></td><td></td><td></td><td>A, or [E and I].</td>      </tr><tr><td>Ordinary Break </td><td></td><td></td><td></td><td></td><td>A or E.</td>      </tr><tr><td>Damaged Rail </td><td></td><td></td><td></td><td></td><td>C.</td>      </tr><tr><td>Flattened Rail Crushed Head </td><td>Depth > 3/8 and Length >8</td><td></td><td></td><td></td><td>H.</td>      </tr></tbody>  </table><div><div><p><dt>A.<dl> Assign a person designated under 213.7 to visually supervise each operation over the defective rail.</dl></dt></p><dt>A2. <dl>Assign a person designated under 213.7 to make a visual inspection. After a visual inspection, that persion may authorize operation to continue without continuous visual supervision at a maximum of 10 m.p.h for up to 24 hours prior to another such viual inspection or replacement or repair of the rail.</dl></dt><dt>B. <dl>Limit operating speed over defective rail to that as authorized by a person designated under 213.7 a who has at least one year of supervisory experience in railroad track maintenance The operating speed cannot be over 30 mph or the maximum allowable speed under $213.9 for the class of track concerned whichever is lower </dl></dt><dt>C. <dl>Apply joint bars bolted only through the outermost holes to defect within 20 days after it is determined to continue the track in use In the case of Classes 3 through track limit operating speed over defective rail to 30 mph until joint bars are applied thereafter limit speed to 50 mph or the maximum allowable speed under 213.9 the class of track concerned whichever lower When a search for internal rail defects is conducted under 213.237 and defects are discovered in Classes 3 through 5 which require remedial action C the operating speed shall be limited to 50 mph or the maximum allowable speed under 213.9 for the class of track concerned whichever is lower for a period not to exceed 4 days If the defective rail has not been removed from the track or a permanent repair made within 4 days of the discovery limit operating speed over the defective rail to 30 mph until joint bars are applied thereafter limit speed to 50 mph or the maximum allowable speed under 213.9 for the class of track concerned whichever is lower </dl></dt><dt>D. <dl>Apply joint bars bolted only through the outermost holes to defect within 10 days after it is determined to continue the track in use In the case of Classes 3 through 5 track limit operating speed over the defective rail to 30 mph or less as authorized by a person designated under 213.7 a who has at least one year of supervisory experience in railroad track maintenance until joint bars are applied thereafter limit speed to 50 mph or the maximum allowable speed under 213.9 for the class of track concerned whichever is lower </dl></dt><dt>E. <dl>Apply joint bars to defect and bolt in accordance with 213.121 (d) and (e)</dl> </dt><dt>F <dl>Inspect rail 90 days after it is determined to continue the track in use.</dl></dt><dt>G. <dl>Inspect rail 30 days after it is determined to continue the track in use. </dl></dt><dt>H. <dl>Limit operating speed over defective rail to 50 mph or the maximum allowable speed under 213.9 for the class of track concerned whichever is lower </dl></dt><dt>I. <dl>Limit operating speed over defective rail to 30 mph or the maximum allowable speed under 213.9 for the class of track concerned whichever is lower </dl></dt></div></div></body></html>';
  } else {
    return "";
  }
}
let listOfAppLookups = [
  { tenantId: "ps19", listName: "Category", code: "1", description: "Rails" },
  { tenantId: "ps19", listName: "Category", code: "2", description: "Tiles" },
  { tenantId: "ps19", listName: "Category", code: "3", description: "Spikes" },
  { tenantId: "ps19", listName: "Category", code: "4", description: "Joint Bar" },
  { tenantId: "ps19", listName: "Category", code: "5", description: "Switch" },
  { tenantId: "ps19", listName: "Priority", code: "11", description: "High" },
  { tenantId: "ps19", listName: "Priority", code: "12", description: "Medium" },
  { tenantId: "ps19", listName: "Priority", code: "13", description: "Low" },
  { tenantId: "ps19", listName: "Priority", code: "14", description: "Info" },
  { tenantId: "ps19", listName: "Priority", code: "15", description: "Apply 213.9(b) Rule" },
  {
    tenantId: "ps19",
    listName: "AppPullList",
    code: "21",
    description: "ApplicationLookups",
    opt1: "ApplicationLookups",
    opt2:
      '{"criteria":{"listName": { "$in": ["config", "Priority","remedialAction","appForms","appInfoTable", "alphaNumericMilepostIOC"]}}, "fieldMap":{"code": "code", "description": "description", "optParam2": "listName"}}',
  },
  //////{ tenantId: "ps19", listName: "AppPullList", code: "22", description: "StartOfDay", opt1: "SOD", opt2: '{"criteria":{"employee": "<useremail>"}, "fieldMap":{"code":"day", "description":"employee" }, "limit":"1", "sort":{"day":"-1"}}'},
  {
    tenantId: "ps19",
    listName: "AppPullList",
    code: "23",
    description: "JourneyPlan",
    opt1: "JourneyPlan",
    opt2:
      '{"criteria":{ "$and": [{"user.id": "<userid>"},{"status": "In Progress"}]}, "fieldMap":{"code":"_id", "description":"privateKey" }, "sort":{"date":"-1"}}',
  },
  // Old workplantemplate criteria without customFilter//'{"criteria":{"$and":[{"$or":[{"user.email": "<teamLeadEmail>"},{"user.email":"<useremail>"},{"modifications.<currentDate>.user.email":"<useremail>"}]},{"isRemoved":"false"}]}, "fieldMap":{"code":"_id", "description":"title" }}'}
  {
    tenantId: "ps19",
    listName: "AppPullList",
    code: "24",
    description: "WorkPlanTemplate",
    opt1: "WorkPlanTemplate",
    opt2:
      '{"criteria":{"$and":[{"isRemoved":"false"}]}, "fieldMap":{"code":"_id", "description":"title" }, "customFilter":{"module":"WorkPlanTemplateService", "func":"filterForUser"}}',
  },

  {
    tenantId: "ps19",
    listName: "AppPullList",
    code: "25",
    description: "AssetTypes",
    opt1: "AssetTypes",
    opt2:
      '{"criteria":{"$or":[{"inspectable": "true"}, {"location":"true"}]}, "fieldMap":{"code": "assetType", "description": "assetType", "optParam2": "listName"}, "project":{"lampAttributes":0}}',
  },
  {
    tenantId: "ps19",
    listName: "AppPullList",
    code: "26",
    description: "Run",
    opt1: "Run",
    opt2: '{"criteria":{"isRemoved":false}, "fieldMap":{"code": "_id", "description": "runId"}, "project":{"createdAt":0,"updatedAt":0}}',
  },
  {
    tenantId: "ps19",
    listName: "AppPullList",
    code: "apl-27",
    description: "Maintenance",
    opt1: "Maintenance",
    opt2:
      '{"criteria":{}, "fieldMap":{"code":"_id", "description":"description" }, "customFilter":{"module":"MaintenanceService", "func":"filterForUser"}}',
  },
  { tenantId: "ps19", listName: "TrafficType", code: "TT-01", description: "Intermodal" },
  { tenantId: "ps19", listName: "TrafficType", code: "TT-02", description: "Amtrak" },
  { tenantId: "ps19", listName: "TrafficType", code: "TT-07", description: "Hazmat" },
  { tenantId: "ps19", listName: "TrafficType", code: "TT-04", description: "Coal" },
  { tenantId: "ps19", listName: "TrafficType", code: "TT-05", description: "Manifest Traffic" },
  { tenantId: "ps19", listName: "TrafficType", code: "TT-06", description: "Crude by Rail" },
  { tenantId: "ps19", listName: "TrafficType", code: "TT-03", description: "Freight" },
  { tenantId: "ps19", listName: "Subdivision", code: "sub-01", description: "Norristown" },
  //{ tenantId: "ps19", listName: "Subdivision", code: "sub-01", description: "Baltimore Subdivision"},
  //{ tenantId: "ps19", listName: "Subdivision", code: "sub-02", description: "Albany Subdivision"},
  //{ tenantId: "ps19", listName: "Subdivision", code: "sub-03", description: "Cumberland Subdivision"},
  { tenantId: "ps19", listName: "Class", code: "cls-01", description: "1", opt1: '{"frequency" : 10 }' },
  { tenantId: "ps19", listName: "Class", code: "cls-02", opt1: '{"frequency" : 60 }', description: "2" },
  { tenantId: "ps19", listName: "Class", code: "cls-03", description: "3", opt1: '{"frequency" : 20 }' },
  { tenantId: "ps19", listName: "Class", code: "cls-04", description: "4", opt1: '{"frequency" : 40 }' },
  { tenantId: "ps19", listName: "Class", code: "cls-05", description: "5", opt1: '{"frequency" : 30 }' },

  { tenantId: "ps19", listName: "maintenanceTypes", code: "maintenanceTypes-1", description: "Tie Replacement" },
  { tenantId: "ps19", listName: "maintenanceTypes", code: "maintenanceTypes-2", description: "Tamping" },
  { tenantId: "ps19", listName: "maintenanceTypes", code: "maintenanceTypes-3", description: "Rail Temperature Adjustment" },
  { tenantId: "ps19", listName: "maintenanceTypes", code: "maintenanceTypes-4", description: "Rail Grinding" },
  { tenantId: "ps19", listName: "maintenanceTypes", code: "maintenanceTypes-5", description: "Brush Cutting" },
  { tenantId: "ps19", listName: "maintenanceTypes", code: "maintenanceTypes-6", description: "Joint Welding" },
  { tenantId: "ps19", listName: "maintenanceTypes", code: "maintenanceTypes-7", description: "Track Type" },
  { tenantId: "ps19", listName: "maintenanceTypes", code: "maintenanceTypes-8", description: "Class" },

  { tenantId: "ps19", listName: "crewSkills", code: "crewSkills-1", description: "Laborer" },
  { tenantId: "ps19", listName: "crewSkills", code: "crewSkills-2", description: "Welder" },
  { tenantId: "ps19", listName: "crewSkills", code: "crewSkills-3", description: "Journey Man" },
  { tenantId: "ps19", listName: "crewSkills", code: "crewSkills-4", description: "Flaggers" },
  { tenantId: "ps19", listName: "crewSkills", code: "crewSkills-5", description: "Watchmen/Lookouts" },

  { tenantId: "ps19", listName: "equipmentTypes", code: "equipmentTypes-1", description: "Backhoe" },
  { tenantId: "ps19", listName: "equipmentTypes", code: "equipmentTypes-1", description: "Material/Log truck" },
  { tenantId: "ps19", listName: "equipmentTypes", code: "equipmentTypes-1", description: "Excavators " },
  { tenantId: "ps19", listName: "equipmentTypes", code: "equipmentTypes-1", description: "Loader (Gradall)" },
  { tenantId: "ps19", listName: "equipmentTypes", code: "equipmentTypes-1", description: "Tie installation machine " },
  { tenantId: "ps19", listName: "equipmentTypes", code: "equipmentTypes-1", description: "Welding truck" },
  { tenantId: "ps19", listName: "equipmentTypes", code: "equipmentTypes-1", description: "Section truck" },
  { tenantId: "ps19", listName: "equipmentTypes", code: "equipmentTypes-1", description: "Dump truck" },
  { tenantId: "ps19", listName: "equipmentTypes", code: "equipmentTypes-1", description: "Crane/Speed swing" },
  { tenantId: "ps19", listName: "equipmentTypes", code: "equipmentTypes-1", description: "Asphalting Equipment" },
  { tenantId: "ps19", listName: "equipmentTypes", code: "equipmentTypes-1", description: "Gondola" },
  { tenantId: "ps19", listName: "equipmentTypes", code: "equipmentTypes-1", description: "Dumpster" },
  { tenantId: "ps19", listName: "equipmentTypes", code: "equipmentTypes-1", description: "Tamping machine or tools" },
  {
    tenantId: "ps19",
    listName: "equipmentTypes",
    code: "equipmentTypes-1",
    description: "Hoisting/Lifting Equipment – Determined by length and weight of material.",
  },
  { tenantId: "ps19", listName: "equipmentTypes", code: "equipmentTypes-1", description: "Rigging and Lifting Device" },
  { tenantId: "ps19", listName: "equipmentTypes", code: "equipmentTypes-1", description: "Rail Saw" },
  { tenantId: "ps19", listName: "equipmentTypes", code: "equipmentTypes-1", description: "Rail Drill" },
  { tenantId: "ps19", listName: "equipmentTypes", code: "equipmentTypes-1", description: "Track Gauges" },
  { tenantId: "ps19", listName: "equipmentTypes", code: "equipmentTypes-1", description: "Oxygen/ Acetylene Gas Torch" },
  { tenantId: "ps19", listName: "equipmentTypes", code: "equipmentTypes-1", description: "Tamper" },
  { tenantId: "ps19", listName: "equipmentTypes", code: "equipmentTypes-1", description: "Regulator" },
  { tenantId: "ps19", listName: "equipmentTypes", code: "equipmentTypes-1", description: "Grinder" },
  { tenantId: "ps19", listName: "equipmentTypes", code: "equipmentTypes-1", description: "Lining Bar" },
  { tenantId: "ps19", listName: "equipmentTypes", code: "equipmentTypes-1", description: "Claw Bar" },
  { tenantId: "ps19", listName: "equipmentTypes", code: "equipmentTypes-1", description: "Spike Puller" },
  { tenantId: "ps19", listName: "equipmentTypes", code: "equipmentTypes-1", description: "Track Jack" },
  { tenantId: "ps19", listName: "equipmentTypes", code: "equipmentTypes-1", description: "Spike Driver" },
  { tenantId: "ps19", listName: "equipmentTypes", code: "equipmentTypes-1", description: "Track Jack" },
  { tenantId: "ps19", listName: "equipmentTypes", code: "equipmentTypes-1", description: "Spike Driver" },
  { tenantId: "ps19", listName: "equipmentTypes", code: "equipmentTypes-1", description: "Spike Lifter" },
  { tenantId: "ps19", listName: "equipmentTypes", code: "equipmentTypes-1", description: "Drift Pin" },
  { tenantId: "ps19", listName: "equipmentTypes", code: "equipmentTypes-1", description: "Leaf blower" },
  { tenantId: "ps19", listName: "equipmentTypes", code: "equipmentTypes-1", description: "Snow blower" },

  { tenantId: "ps19", listName: "equipmentTypes", code: "equipmentTypes-1", description: "Hydraulic tools" },
  { tenantId: "ps19", listName: "equipmentTypes", code: "equipmentTypes-1", description: "Asphalt Cutting Saw" },
  { tenantId: "ps19", listName: "equipmentTypes", code: "equipmentTypes-1", description: "Impact wrench" },
  { tenantId: "ps19", listName: "equipmentTypes", code: "equipmentTypes-1", description: "Track wrench" },
  { tenantId: "ps19", listName: "equipmentTypes", code: "equipmentTypes-1", description: "Spike maul" },
  { tenantId: "ps19", listName: "equipmentTypes", code: "equipmentTypes-1", description: "Track Punch" },
  { tenantId: "ps19", listName: "equipmentTypes", code: "equipmentTypes-1", description: "Sledgehammers" },
  { tenantId: "ps19", listName: "equipmentTypes", code: "equipmentTypes-1", description: "Shovel" },
  { tenantId: "ps19", listName: "equipmentTypes", code: "equipmentTypes-1", description: "Pick" },
  { tenantId: "ps19", listName: "equipmentTypes", code: "equipmentTypes-1", description: "Punch" },
  { tenantId: "ps19", listName: "equipmentTypes", code: "equipmentTypes-1", description: "Fork" },

  // { tenantId: "ps19", listName: "materialTypes", code: "materialTypes-1", description: "Backhoe"},
  // { tenantId: "ps19", listName: "materialTypes", code: "materialTypes-2", description: "Cable truck"},

  { tenantId: "ps19", listName: "materialTypes", code: "materialTypes-1", description: "Switch point and stock rail" },
  { tenantId: "ps19", listName: "materialTypes", code: "materialTypes-2", description: "Heel block (fixed or floating heel block)" },
  { tenantId: "ps19", listName: "materialTypes", code: "materialTypes-3", description: "Heel block bolts" },
  { tenantId: "ps19", listName: "materialTypes", code: "materialTypes-4", description: "Joint bar" },
  { tenantId: "ps19", listName: "materialTypes", code: "materialTypes-5", description: "Switch clip bolts" },
  { tenantId: "ps19", listName: "materialTypes", code: "materialTypes-6", description: "Fasteners (spikes, lags, clips)" },
  { tenantId: "ps19", listName: "materialTypes", code: "materialTypes-7", description: "Cotter pins" },
  { tenantId: "ps19", listName: "materialTypes", code: "materialTypes-8", description: "Tie plates" },
  { tenantId: "ps19", listName: "materialTypes", code: "materialTypes-9", description: "Switch plates" },
  { tenantId: "ps19", listName: "materialTypes", code: "materialTypes-10", description: "Gauge plates" },
  { tenantId: "ps19", listName: "materialTypes", code: "materialTypes-11", description: "Chair plates" },
  { tenantId: "ps19", listName: "materialTypes", code: "materialTypes-12", description: "Point protector" },
  { tenantId: "ps19", listName: "materialTypes", code: "materialTypes-13", description: "Lubrication products" },
  { tenantId: "ps19", listName: "materialTypes", code: "materialTypes-14", description: "Spike hole plugging materials" },
  { tenantId: "ps19", listName: "materialTypes", code: "materialTypes-15", description: "Ties" },
  { tenantId: "ps19", listName: "materialTypes", code: "materialTypes-16", description: "Crossties" },
  { tenantId: "ps19", listName: "materialTypes", code: "materialTypes-17", description: "Anchors" },
  { tenantId: "ps19", listName: "materialTypes", code: "materialTypes-18", description: "Field weld kits " },
  {
    tenantId: "ps19",
    listName: "materialTypes",
    code: "materialTypes-19",
    description: "Rock (for track repair and temporary crossing)",
  },
  { tenantId: "ps19", listName: "materialTypes", code: "materialTypes-20", description: "Road Crossing Boards" },
  { tenantId: "ps19", listName: "materialTypes", code: "materialTypes-21", description: "Drainage pipe" },
  { tenantId: "ps19", listName: "materialTypes", code: "materialTypes-22", description: "PVC pipe to hold C&S wires" },
  { tenantId: "ps19", listName: "materialTypes", code: "materialTypes-23", description: "Asphalt" },
  {
    tenantId: "ps19",
    listName: "materialTypes",
    code: "materialTypes-24",
    description: "Proper size frog—if on Pandrol timbers have proper joint clips for angle bars",
  },
  { tenantId: "ps19", listName: "materialTypes", code: "materialTypes-25", description: "Tie plugs (as needed)" },
  { tenantId: "ps19", listName: "materialTypes", code: "materialTypes-26", description: "Bolts" },
  { tenantId: "ps19", listName: "materialTypes", code: "materialTypes-27", description: "Spikes (as needed)" },
  { tenantId: "ps19", listName: "materialTypes", code: "materialTypes-28", description: "Replacement frog hook plates (as needed)" },
  { tenantId: "ps19", listName: "materialTypes", code: "materialTypes-29", description: "Joint bars (as needed)" },
  { tenantId: "ps19", listName: "materialTypes", code: "materialTypes-30", description: "Whistle boards" },
  { tenantId: "ps19", listName: "materialTypes", code: "materialTypes-31", description: "Jumper shunts" },
  { tenantId: "ps19", listName: "materialTypes", code: "materialTypes-32", description: "Rail" },
  { tenantId: "ps19", listName: "materialTypes", code: "materialTypes-34", description: "Guard rails (if needed)" },
  { tenantId: "ps19", listName: "materialTypes", code: "materialTypes-35", description: "Plug rail/Transition rails (as needed)" },

  { tenantId: "ps19", listName: "departments", code: "departments-1", description: "Management" },
  { tenantId: "ps19", listName: "departments", code: "departments-2", description: "Inspection" },
  {
    tenantId: "ps19",
    listName: "mWorkAssign",
    code: "mWOrkAssign",
    description: "Maintenance Work Assignment",
    opt2: {
      InspectorWork: ["inspector"],
      Maintainer: ["maintenance"],
    },
  },
  {
    tenantId: "ps19",
    listName: "appInfoTable",
    code: "infoTableRemedialAction",
    description: "Remedial Action Table",
    opt1: getHtmlForTable(0),
  },

  {
    tenantId: "ps19",
    listName: "remedialAction",
    code: "00 repaired",
    description: "Repaired",
    opt1: [
      {
        id: "fixDescribe",
        fieldName: "Describe",
        fieldType: "text",
      },
    ],
  },
  {
    tenantId: "ps19",
    listName: "remedialAction",
    code: "01 slowOrderApplied",
    description: "Slow Order Applied",
    opt1: [
      {
        id: "slowOrderNumber",
        fieldName: "Slow Order Authority #",
        fieldType: "text",
      },
      {
        id: "slowOrderSpeedRestict",
        fieldName: "Speed restricted to:",
        fieldType: "list",
        required: true,
        options: ["Class #4", "Class #3", "Class #2", "Class #1", "Excepted Track"],
      },
    ],
  },
  {
    tenantId: "ps19",
    listName: "remedialAction",
    code: "02 trackOOS",
    description: "Track OOS (Out of Service)",
    opt1: [
      {
        id: "describe",
        fieldName: "Describe",
        fieldType: "text",
        default: "Track OOS",
        enabled: false,
        visible: false,
      },
    ],
  },
  {
    tenantId: "ps19",
    listName: "remedialAction",
    code: "03 notrepaired",
    description: "Not Repaired",
    opt1: [
      {
        id: "describe",
        fieldName: "Describe",
        fieldType: "text",
      },
    ],
  },
  {
    tenantId: "ps19",
    listName: "resolveIssueRemedialAction",
    code: "resolveIssuesOnRemedialAction",
    description: "",
    opt1: ["Repaired"],
  },
];

function searchItemInLists(listName, code) {
  let listsToLook = [listOfAppLookups, timpsAppForms, scimAppForms, mpAlphaNmericListIOC];
  for (let list of listsToLook) {
    let listItem = list.find((itm) => {
      return itm.listName === listName && itm.code === code;
    });
    if (listItem) {
      return listItem;
    }
  }
  return null;
}
export async function createApplicationLookups(appName) {
  for (const al of listOfAppLookups) {
    await addIfNotExist(ApplicationLookupsModel, { listName: al.listName, code: al.code }, al);
  }

  if (appName === "TIMPS") {
    for (const al of timpsAppForms) {
      await addIfNotExist(ApplicationLookupsModel, { listName: al.listName, code: al.code }, al);
    }
  } else if (appName === "SCIM") {
    for (const al of timpsAppForms) {
      await addIfNotExist(ApplicationLookupsModel, { listName: al.listName, code: al.code }, al);
    }
  }

  dynamicLanguageToDB();
}
export async function deleteApplicationLookups(list) {
  if (list && list.length) {
    for (let l2d of list) {
      if (!l2d.listName || !l2d.code) continue;
      console.log("attempting to delete applicaitonlookup: listname:", l2d.listName, "code:", l2d.code);
      await ApplicationLookupsModel.deleteOne({ listName: l2d.listName, code: l2d.code });
    }
  }
}

//
// provide this function array of {listName:'', code:'', compare:''}
// listName and code identifies the unique entry
// compare contains the field to match, if match fails, the entry will be updated
//
export async function updateApplicationLookups(list, addIfNotFound = false) {
  if (list && list.length) {
    for (let l2u of list) {
      if (!l2u.listName || !l2u.code || !l2u.compare) continue;
      let item2u = await ApplicationLookupsModel.findOne({ listName: l2u.listName, code: l2u.code }).exec();
      // let item2compare = listOfAppLookups.find((a) => {
      //   return a.listName === l2u.listName && a.code === l2u.code;
      // });
      let item2compare = searchItemInLists(l2u.listName, l2u.code);

      if (item2u && (item2u[l2u.compare] !== undefined || addIfNotFound) && item2compare && item2compare[l2u.compare] !== undefined) {
        ////if(item2u && item2u[l2u.compare] && item2compare && item2compare[l2u.compare])
        let f1 = item2u[l2u.compare] || {};
        let f2 = item2compare[l2u.compare];
        try {
          if (JSON.stringify(f1) !== JSON.stringify(f2)) {
            item2u[l2u.compare] = item2compare[l2u.compare];
            item2u.markModified(l2u.compare);
            await item2u.save();
          }
        } catch (err) {
          console.log("applicationlookupslist.js.updateApplicationLookups.catch:", err);
        }
      } else {
        console.log("applicationlookupslist.js.updateApplicationLookups compare item not match", item2u, item2compare);
      }
    }
  }
}

//
// provide this function array of {listName:'', code:''}
// listName and code identifies the unique entry and returns true if any of the items exists
//
export async function checkIfExist(list) {
  try {
    if (list && list.length) {
      let criteriaItems = list.map((l2c) => {
        return { listName: l2c.listName, code: l2c.code };
      });
      let criteria = { $or: criteriaItems };
      let items2check = await ApplicationLookupsModel.find(criteria).exec();
      if (items2check && items2check.length) {
        // if length > 0 it means some of the item(s) exist(s)
        return true;
      }
    }
  } catch (err) {
    console.log("applicationlookupslist.checkIfExist.catch:", err);
  }
  return false;
}
//
// provide this function array of {listName:'', code:''}
// listName and code identifies the entries that will be deleted
//
export async function deleteIfExist(list) {
  try {
    if (list && list.length) {
      let criteriaItems = list.map((l2c) => {
        return { listName: l2c.listName, code: l2c.code };
      });
      let criteria = { $or: criteriaItems };
      await ApplicationLookupsModel.deleteMany(criteria).exec();
    }
  } catch (err) {
    console.log("applicationlookuplist.deleteIfExist.catch:", err);
  }
}
//
// provide this function array of {listName:'', code:''}
// listName and code identifies the entries that will be added if not exist
//
export async function addApplookupIfNotExist(list) {
  try {
    if (list && list.length) {
      for (let item of list) {
        let itemToAdd = searchItemInLists(item.listName, item.code);
        await addIfNotExist(ApplicationLookupsModel, { listName: itemToAdd.listName, code: itemToAdd.code }, itemToAdd);
      }
    }
  } catch (err) {
    console.log("applicationlookuplist.addApplookupIfNotExist.catch:", err);
  }
}

const mpAlphaNmericListIOC = [
  {
    tenantId: "ps19",
    listName: "alphaNumericMilepostIOC",
    code: "alphaNumericMilepostIOC",
    description: "MarkerList",
    opt1: alphaVals,
  },
];
export const timpsAppForms = [
  frmSwitchInspection,
  // form1,
  form2,
  frmAnnualSI4QNS,
  frmMonthlySI4QNS,
  inspectionForm1,
  inspectionForm2,
  inspectionForm3,
];
export const scimAppForms = [
  formGI303,
  formFicheB12,
  formFicheB24,
  formFicheB12B24,
  gi329fa,
  gi329fb,
  gi329fc,
  gi329fd,
  gi313f,
  gi334f,
  scp901f,
  scp902f,
  scp907f,
  suivimargingi335,
];
