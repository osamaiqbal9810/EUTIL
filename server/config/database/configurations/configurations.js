import { addIfNotExist } from "../dbFunctions/dbHelperMethods";
let ApplicationLookupsModel = require("../../../api/ApplicationLookups/ApplicationLookups.model");

let appLookupConfigurations = [
  {
    tenantId: "ps19",
    listName: "config",
    code: "switchAlertDaysBeforeMonthEnd",
    description: "Switch Alert Days",
    opt1: {
      type: "number",
      placeholder: "Days before month switch state should be alert",
      cols: 12,
      group: "Common",
      sortid: 1,
      hide: true,
    },
    opt2: 7,
  },
  {
    tenantId: "ps19",
    listName: "config",
    code: "mpstart",
    description: "Milepost Start Limit",
    opt1: { type: "number", placeholder: "Start", cols: 12, group: "Common", sortid: 2 },
    opt2: 0,
  },
  {
    tenantId: "ps19",
    listName: "config",
    code: "mpend",
    description: "Milepost End Limit",
    opt1: { type: "number", placeholder: "End", cols: 12, group: "Common", sortid: 3 },
    opt2: 2000,
  },
  {
    tenantId: "ps19",
    listName: "config",
    code: "mpprefix",
    description: "Milepost Prefix",
    opt1: { type: "text", placeholder: "Prefix", cols: 12, hide: true, group: "Common", sortid: 4 },
    opt2: "",
  },
  {
    tenantId: "ps19",
    listName: "config",
    code: "temperaturesign",
    description: "Use the temperature sign i.e (F: Fahrenheit, C: Celsius)",
    opt1: {
      type: "select",
      placeholder: "",
      options: ["F", "C"],
      cols: 12,
      group: "Units",
      sortid: 5,
      hide: false,
    },
    opt2: "F",
  },
  {
    tenantId: "ps19",
    listName: "config",
    code: "distancesign",
    description: "Use the distance sign i.e (M: Miles, K: Kilometers)",
    opt1: {
      type: "select",
      placeholder: "",
      options: ["M", "K"],
      cols: 12,
      group: "Units",
      sortid: 6,
    },
    opt2: "M",
  },
  {
    tenantId: "ps19",
    listName: "config",
    code: "postsign",
    description: "Use the sign posts i.e (MP: Milepost, KP: Kilometre Post)",
    opt1: {
      type: "select",
      placeholder: "",
      options: ["MP", "KP"],
      cols: 12,
      group: "Units",
      sortid: 7,
    },
    opt2: "MP",
  },
  {
    tenantId: "ps19",
    listName: "config",
    code: "weekstartday",
    description: "Start Of Week",
    opt1: {
      type: "select",
      placeholder: "",
      options: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      cols: 12,
      group: "Scheduling",
      sortid: 8,
    },
    opt2: "Monday",
  },

  {
    tenantId: "ps19",
    listName: "config",
    code: "appmpinput",
    description: "Force Input Start/End Milepost on Mobile App",
    opt1: { type: "bool", cols: 12, group: "Mobile App", sortid: 9, hide: true },
    opt2: true,
  },
  {
    tenantId: "ps19",
    listName: "config",
    code: "apptraversetrack",
    description: "Force Input Traverse Track on Mobile App",
    opt1: { type: "bool", cols: 12, group: "Mobile App", sortid: 10, hide: true },
    opt2: true,
  },
  {
    tenantId: "ps19",
    listName: "config",
    code: "issueResolveRemedialAction",
    description: "Ignore Remedial Action From Mobile App", //"Review Remedial Action Before Resolving Issue",
    opt1: { type: "bool", cols: 12, group: "Common", sortid: 11, hide: true },
    opt2: false,
  },
  {
    tenantId: "ps19",
    listName: "config",
    code: "holidays",
    description: "Holidays",
    opt1: { type: "date", cols: 12, group: "Common", sortid: 18, hide: true },
    opt2: [],
  },
  {
    tenantId: "ps19",
    listName: "config",
    code: "weekdays",
    description: "Working Week days",
    opt1: {
      type: "AssetSelection",
      cols: 12,
      showHeadersLabels: true,
      opt1headerTitle: "Working Week Days",
      opt2headerTitle: "Off Week Days",
      options: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      group: "Scheduling",
      sortid: 12,
    },
    opt2: [],
  },
  {
    tenantId: "ps19",
    listName: "config",
    code: "apptaskviewbypass",
    description: "Force app to use single clock for Inspection",
    opt1: {
      type: "bool",
      cols: 12,
      group: "Mobile App",
      sortid: 13,
      hide: true,
    },
    opt2: true,
  },
  {
    tenantId: "ps19",
    listName: "config",
    code: "appraildirection",
    description: "Allow selection of rail direction in Mobile app (if available)",
    opt1: {
      type: "bool",
      cols: 12,
      group: "Mobile App",
      sortid: 14,
    },
    opt2: true,
  },
  {
    tenantId: "ps19",
    listName: "config",
    code: "appdefaultasset",
    description: "Force Mobile app to select Main Track as default asset",
    opt1: {
      type: "bool",
      cols: 12,
      group: "Mobile App",
      sortid: 15,
      hide: true,
    },
    opt2: true,
  },
  {
    tenantId: "ps19",
    listName: "config",
    code: "appinspectiontype",
    description: "Allow Inspector to select Inspection type before starting",
    opt1: {
      type: "bool",
      cols: 12,
      group: "Mobile App",
      sortid: 16,
    },
    opt2: true,
  },
  {
    tenantId: "ps19",
    listName: "config",
    code: "appweathercondition",
    description: "Allow inspector to add weather condition before starting inspection",
    opt1: {
      type: "bool",
      cols: 12,
      group: "Mobile App",
      sortid: 17,
      hide: true,
    },
    opt2: true,
  },
  {
    tenantId: "ps19",
    listName: "config",
    code: "traversby",
    description: "Default traverse by",
    opt1: {
      type: "select",
      placeholder: "",
      options: ["Hi-Rail", "Walking", "Train"],
      cols: 12,
      group: "Mobile App",
      sortid: 18,
    },
    opt2: "Hi-Rail",
  },
  {
    tenantId: "ps19",
    listName: "config",
    code: "ccTestNotActive",
    description: "Color plan not active",
    opt1: {
      type: "text",
      placeholder: "Prefix",
      cols: 12,
      group: "Color Coding",
      sortid: 20,
      hide: true,
    },
    opt2: "darkgray",
  },
  {
    tenantId: "ps19",
    listName: "config",
    code: "ccTestActive",
    description: "Color plan active",
    opt1: {
      type: "text",
      placeholder: "Prefix",
      cols: 12,
      group: "Color Coding",
      sortid: 21,
      hide: true,
    },
    opt2: "#FF00CC00",
  },
  {
    tenantId: "ps19",
    listName: "config",
    code: "ccTestExpiring",
    description: "Color plan expiring",
    opt1: {
      type: "text",
      placeholder: "Prefix",
      cols: 12,
      group: "Color Coding",
      sortid: 21,
      hide: true,
    },
    opt2: "red",
  },
  {
    tenantId: "ps19",
    listName: "config",
    code: "defaultObserveSelection",
    description: "Default observe",
    opt1: {
      type: "select",
      placeholder: "",
      options: ["N/A", "All side tracks"],
      cols: 12,
      group: "Mobile App",
      sortid: 22,
    },
    opt2: "N/A",
  },
  {
    tenantId: "ps19",
    listName: "config",
    code: "audibleNotification",
    description: "Allow audible alerts in mobile app ",
    opt1: {
      type: "bool",
      cols: 12,
      group: "Mobile App",
      sortid: 23,
      hide: false,
    },
    opt2: false,
  },
  {
    tenantId: "ps19",
    listName: "config",
    code: "disableRule213",
    description: "Disable Rule 213.b on web and mobile app",
    opt1: {
      type: "bool",
      cols: 12,
      group: "Common",
      sortid: 20,
      hide: true,
    },
    opt2: false,
  },
  {
    tenantId: "ps19",
    listName: "config",
    code: "reportStartRange",
    description: "Production date",
    opt1: { type: "date", cols: 12, group: "Common", sortid: 20, hide: false },
    opt2: [],
  },
  {
    tenantId: "ps19",
    listName: "config",
    code: "disableRemedialByRule",
    description: "Disable Remedial action when Rule 213 is checked ",
    opt1: {
      type: "bool",
      cols: 12,
      group: "Mobile App",
      sortid: 24,
      hide: true,
    },
    opt2: true,
  },
  {
    tenantId: "ps19",
    listName: "config",
    code: "dynamicBriefing",
    description: "Use custom Job Briefing ",
    opt1: {
      type: "bool",
      cols: 12,
      group: "Mobile App",
      sortid: 25,
      hide: true,
    },
    opt2: false,
  },
  {
    tenantId: "ps19",
    listName: "config",
    code: "briefingAtStart",
    description: "Show Job briefing at the start of inspection ",
    opt1: {
      type: "bool",
      cols: 12,
      group: "Mobile App",
      sortid: 26,
      hide: true,
    },
    opt2: false,
  }
];

export async function addConfigurations(addConfigs) {
  if (!addConfigs) return;

  for (let config of appLookupConfigurations) {
    await addIfNotExist(ApplicationLookupsModel, { listName: config.listName, code: config.code, description: config.description }, config);
  }
}
export async function updateConfigurations(updateConfigs, appName) {
  if (!updateConfigs) return;
  let configs = await ApplicationLookupsModel.find({ listName: "config", "opt1.group": { $exists: false } });

  for (let config of configs) {
    if (!config.opt1.group) {
      let cfg = appLookupConfigurations.find((c) => {
        return c.code === config.code;
      });
      if (cfg && cfg.opt1) {
        config.opt1.group = cfg.opt1.group;
        config.opt1.sortid = cfg.opt1.sortid;
        config.markModified("opt1");
        await config.save();
      }
    }
  }
  if (appName === "SCIM") {
    const filter = {
      $and: [
        { listName: "config" },
        {
          code: {
            $in: [
              "appinspectiontype",
              "appweathercondition",
              "appmpinput",
              "apptraversetrack",
              "appinspectiontype",
              "appdefaultasset",
              "appraildirection",
            ],
          },
        },
      ],
    };
    const update = { $set: { opt2: false } };
    await ApplicationLookupsModel.updateMany(filter, update, (err, doc) => {
      if (err) {
        console.log("Error updating config for SCIM: " + err);
      }
    });
  } else if (appName === "TIMPS") {
    const filter = {
      $and: [
        { listName: "config" },
        {
          code: {
            $in: [
              "appinspectiontype",
              "appweathercondition",
              "appmpinput",
              "apptraversetrack",
              "appinspectiontype",
              "appdefaultasset",
              "appraildirection",
            ],
          },
        },
      ],
    };
    const update = { $set: { opt2: true } };
    await ApplicationLookupsModel.updateMany(filter, update, (err, doc) => {
      if (err) {
        console.log("Error updating config for TIMPS: " + err);
      }
    });
  }
  await applyHiddenConfig(appName);
  await checkAndUpdateConfigDescription(["issueResolveRemedialAction", "appraildirection", "traversby"]); // add codes for configurations that require description update in database
  await updateIndividualConfigurations([{ listName: "config", code: "issueResolveRemedialAction", compare: "opt2" }]);
}
async function checkAndUpdateConfigDescription(configlist) {
  if (configlist && configlist.length) {
    let configsToMod = await ApplicationLookupsModel.find({ listName: "config", code: { $in: configlist } });
    if (configsToMod && configsToMod.length) {
      for (let cfg of configsToMod) {
        let defCfg = appLookupConfigurations.find((c) => {
          return c.code === cfg.code;
        });
        if (defCfg && defCfg.description != cfg.description) {
          cfg.description = defCfg.description;
          cfg.markModified("description");
          await cfg.save();
        }
      }
    }
  }
}
async function applyHiddenConfig(appName) {
  let hiddenConfigs = appLookupConfigurations.filter((c) => {
    return c.opt1.hide;
  });
  if (appName === "SCIM") {
    const filter = {
      $and: [
        { listName: "config" },
        {
          code: {
            $in: ["appraildirection", "appdefaultasset", "appinspectiontype", "postsign", "distancesign", "temperaturesign", "traversby"],
          },
        },
      ],
    };
    const update = { $set: { "opt1.hide": true } };
    await ApplicationLookupsModel.updateMany(filter, update, (err, doc) => {
      if (err) {
        console.log("Error updating config for SCIM config update: " + err);
      }
    });
  } else {
    // For hiding the Sign configs
    let filter = {
      $and: [{ listName: "config" }, { code: { $in: ["postsign", "distancesign", "temperaturesign"] } }],
    };
    let update = { $set: { "opt1.hide": true } };
    await ApplicationLookupsModel.updateMany(filter, update, (err, doc) => {
      if (err) {
        console.log("Error updating config for TIMPS config update: " + err);
      }
    });
    // For displaying configs for TIMPS
    filter = {
      $and: [{ listName: "config" }, { code: { $in: ["appraildirection", "appdefaultasset", "appinspectiontype", "traversby"] } }],
    };
    update = { $set: { "opt1.hide": false } };
    await ApplicationLookupsModel.updateMany(filter, update, (err, doc) => {
      if (err) {
        console.log("Error updating config for TIMPS config update: " + err);
      }
    });
  }

  if (hiddenConfigs.length) {
    let hiddenconfigcodes = hiddenConfigs.map((hc) => {
      return hc.code;
    });
    let configsToHide = await ApplicationLookupsModel.find({
      listName: "config",
      code: { $in: hiddenconfigcodes },
      $or: [{ "opt1.hide": { $exists: false } }, { "opt1.hide": false }],
    });
    if (configsToHide && configsToHide.length) {
      for (let cfsth of configsToHide) {
        cfsth.opt1.hide = true;
        cfsth.markModified("opt1");
        await cfsth.save();
      }
    }
  }
}
//
// provide this function array of {listName:'', code:'', compare:''}
// listName and code identifies the unique entry
// compare contains the field to match, if match fails, the entry will be updated
//
export async function updateIndividualConfigurations(list) {
  if (list && list.length) {
    for (let l2u of list) {
      if (!l2u.listName || !l2u.code || !l2u.compare) continue;

      let item2u = await ApplicationLookupsModel.findOne({ listName: l2u.listName, code: l2u.code }).exec();
      let item2compare = appLookupConfigurations.find((a) => {
        return a.listName === l2u.listName && a.code === l2u.code;
      });

      if (item2u && item2u[l2u.compare] !== undefined && item2compare && item2compare[l2u.compare] !== undefined) {
        let f1 = item2u[l2u.compare];
        let f2 = item2compare[l2u.compare];
        try {
          if (JSON.stringify(f1) !== JSON.stringify(f2)) {
            item2u[l2u.compare] = item2compare[l2u.compare];
            item2u.markModified(l2u.compare);
            await item2u.save();
          }
        } catch (err) {}
      }
    }
  }
}
