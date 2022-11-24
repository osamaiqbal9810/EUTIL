import { guid } from "../../utilities/UUID";
let ServiceLocator = require("../../framework/servicelocator");
import { isJSON } from "../../utilities/isJson.js";
// dependsOn:
export default class WorkplanTemplateService {
  constructor(logger, validationUtil) {
    this.logger = logger;
    this.validation = validationUtil;
    this.verbose = false;
    this.assetGroupSample = {
      _id: "5c4cca5f5b20771958108476",
      units: [
        {
          assetType: "Signal",
          start: "1",
          end: "1",
          length: "0",
          id: "7f04880a-83c9-1f22-3ab9-0c0f32aac468",
          unitId: "CSX Signal",
          coordinates: [-77.5547058130188, 43.1468624754564, 0],
          railRoad: "CSX",
        },
        {
          assetType: "Signal",
          start: "2",
          end: "2",
          length: "0",
          id: "8982e745-928c-3603-5683-8eca8b4e741b",
          unitId: "CSX Signal",
          coordinates: [-77.5547058130188, 43.1468624754564, 0],
          railRoad: "CSX",
        },
        {
          assetType: "Signal",
          start: "3",
          end: "3",
          length: "0",
          id: "f2490474-eacd-9d0a-0bc8-0e8c7a292c74",
          unitId: "CSX Intermediate Signal",
          coordinates: [-77.5158936663373, 43.1259120129687, 0],
          railRoad: "CSX",
        },
        {
          assetType: "Overpass",
          start: "4",
          end: "4",
          length: "0",
          id: "ab9431f3-742d-d846-10be-0675b0d7071f",
          unitId: "Washington Street Railroad Overpass",
          coordinates: [-77.4891553047852, 43.1159563904727, 0],
          railRoad: "CSX",
        },
        {
          assetType: "Bridge",
          start: "5",
          end: "5",
          length: "0",
          id: "2c22dce6-eab9-3fc8-3cb7-eeffe1068f0b",
          unitId: "East Rochester Railroad Bridge",
          coordinates: [-77.4789952702009, 43.1131637905881, 0],
          railRoad: "CSX",
        },
        {
          assetType: "Crossing",
          start: "6",
          end: "6",
          length: "0",
          id: "e9da452f-1123-3ba9-22ea-7ad78c8e839c",
          unitId: "O,Conor Road at Grade Crossing",
          coordinates: [-77.4590747968518, 43.1076568466413, 0],
          railRoad: "CSX",
        },
        {
          assetType: "Crossing",
          start: "7",
          end: "7",
          length: "0",
          id: "18ae2b87-e22c-fd42-0153-d820835263ef",
          unitId: "Fairport Village at Grade Crossing",
          coordinates: [-77.4418839019453, 43.1032645770197, 0],
          railRoad: "CSX",
        },
        {
          assetType: "Rail",
          start: "0",
          end: "6",
          length: "7",
          unitId: "Track-CSX-002",
          id: "e4bbfac6-652a-bff4-e28a-dc24ef9223b6",
          coordinates: [],
          railRoad: "CSX",
        },
      ],
      coordinates: [],
      isRemoved: false,
      subdivision: "Albany Subdivision",
      trackType: "Main Line",
      start: "0",
      end: "6",
      length: "7",
      trafficType: "Freight",
      trackId: "Rail-CSX-002",
      mp_prefix: "CSX",
      weight: "",
      class: "",
      createdAt: { $date: "2019-01-26T21:00:15.116Z" },
      updatedAt: { $date: "2019-01-26T21:00:15.119Z" },
      __v: 0,
    };
  }
  async buildWorkplanTemplate(assetGroup, user) {
    let workplantemplate = {};
    if (this.validation.ensureContains(assetGroup, "_id", "start", "end", "class")) {
      let trackname = this.validation.getOptional(assetGroup, "trackId");
      let subdivision = this.validation.getOptional(assetGroup, "subdivision");

      let applicationLookupModel = ServiceLocator.resolve("ApplicationLookupsModel");
      let classObjFreq = 0;
      try {
        let classResult = await applicationLookupModel.findOne({ listName: "Class", description: assetGroup.class });
        let jsonFreq = isJSON(classResult.opt1);
        if (jsonFreq) {
          classObjFreq = JSON.parse(classResult.opt1).frequency;
        }
      } catch (err) {
        this.logger.error("Error Retreiving Class in ApplicaitonLookup: " + err);
      }
      workplantemplate.inspectionFrequency = classObjFreq;
      workplantemplate.title = "Inspect " + trackname + " : " + assetGroup.start + " to " + assetGroup.end;
      workplantemplate.subdivision = subdivision;
      workplantemplate.class = assetGroup.class;
      workplantemplate.date = new Date();
      if (user) {
        workplantemplate.user = { id: user._id, name: user.name, email: user.email };
      }
      let units = [];
      assetGroup.units.forEach(element => {
        let unit = {
          id: element.id,
          unitId: element.unitId,
          track_id: assetGroup._id,
          assetType: element.assetType,
          coordinates: element.coordinates,
        };
        units.push(unit);
      });

      workplantemplate.tasks = [
        {
          title: workplantemplate.title,
          desc: workplantemplate.title,
          notes: "Perform inspection",
          units: units,
          imgs: null,
          taskId: guid(),
        },
      ];
      //workplantemplate.user;
      workplantemplate.assetGroupId = assetGroup._id;
    } else {
      workplantemplate = false;
      this.logger.error('Could not find all required fields in "AssetGroup": ' + JSON.stringify(assetGroup));
    }

    return workplantemplate;
  }
  test() {
    let wpt = this.buildWorkplanTemplate(this.assetGroupSample);

    this.logger.info("WorkplanTemplate: " + JSON.stringify(wpt));
  }
}
