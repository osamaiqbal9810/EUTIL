export const ONR_JobBriefing = {
  tenantId: "ps19",
  listName: "appForms",
  code: "onrSafetyBriefing",
  description: "Job Briefing Log",
  opt2: {
    target: "jobBriefing",
    viewGroup: "0",
  },

  opt1: [
    {
      id: "date",
      fieldName: "Date",
      fieldType: "date",
      default: "#VAR_NOW#",
      enabled: false,
    },
    {
      id: "empl",
      fieldName: "Employee In Charge",
      fieldType: "text",
      default: "#VAR_UNAME#",
      enabled: false,
    },
    {
      id: "hcou",
      fieldName: "Head Count",
      fieldType: "text",
    },
    {
      id: "loc2",
      fieldName: "Work Location(s) and Task(s) to be Performed Today",
      fieldType: "text",
    },
    {
      id: "tline",
      fieldName: "Train Line-Up (if applicable)",
      fieldType: "text",
    },
    {
      id: "ptype",
      fieldName: "Protection Type",
      fieldType: "radioList",
      options: ["841", "OCS", "SAFETY WATCH", "LONE WORKER"],
    },
    {
      id: "clear",
      fieldName: "Clearance #",
      fieldType: "text",
    },
    {
      id: "plb",
      fieldName: "Protection Limits Between",
      fieldType: "text",
    },

    {
      id: "and",
      fieldName: "and",
      fieldType: "text",
    },

    {
      id: "cirtc",
      fieldName: "Communication Info: RTC - Channel 2 #1",
      fieldType: "label",
    },
    {
      id: "towers",
      fieldName: "TOWER(S)",
      fieldType: "text",
    },

    {
      id: "tow",
      fieldName: "Rule 125 reviewed (Ch. 2 #9)?",
      fieldType: "radioList",
      options: ["Yes", "No"],
    },
    {
      id: "open",
      fieldName: "If No, Explain",
      fieldType: "text",
    },
    {
      id: "rper",
      fieldName: "Emergency Phone / Radio Persons (identify person(s))",
      fieldType: "text",
    },

    {
      id: "alt",
      fieldName: "Alt.",
      fieldType: "text",
    },

    {
      id: "au_no",
      fieldName: "Rule 110 process in place and reviewed?",
      fieldType: "radioList",
      options: ["Yes", "No"],
    },
    {
      id: "open1",
      fieldName: "If No, Explain",
      fieldType: "text",
    },
    {
      id: "faid",
      fieldName: "First Aid / CPR Persons (identify person(s))",
      fieldType: "text",
    },
    {
      id: "alt1",
      fieldName: "Alt.",
      fieldType: "text",
    },
    {
      id: "locaid",
      fieldName: "Location of First Aid Kit(s) Identified?",
      fieldType: "label",
    },
    {
      id: "yes",
      fieldName: "Yes",
      fieldType: "checkbox",
    },
    {
      id: "evacplan",
      fieldName: "Evacuation Plan Reviewed?",
      fieldType: "label",
    },
    {
      id: "yes1",
      fieldName: "Yes",
      fieldType: "checkbox",
    },
    {
      id: "evacplan",
      fieldName:
        "Rule / General Circular / Safety Bulletin of the Week (See schedule) (Tip: 1st workday, to be reviewed in its entirety with crew. Thereafter, review a smaller section of information each day.)",
      fieldType: "label",
    },
    {
      id: "yes2",
      fieldName: "Yes",
      fieldType: "checkbox",
    },
    {
      id: "div",
      fieldName: "",
      fieldType: "divider",
    },
    {
      id: "smr",
      fieldName: "Signal Maintainer Required?",
      fieldType: "label",
    },
    {
      id: "ncinfo",
      fieldName: "(if so, name and contact info)",
      fieldType: "label",
    },
    {
      id: "na",
      fieldName: "N/A",
      fieldType: "checkbox",
    },
    {
      id: "trname",
      fieldName: "NAME",
      fieldType: "text",
    },
    {
      id: "tocontin",
      fieldName: "CONTACT INFORMATION",
      fieldType: "text",
    },
    {
      id: "div1",
      fieldName: "",
      fieldType: "divider",
    },
    {
      id: "phand",
      fieldName: "Hand / Power Tools Required and Inspected",
      fieldType: "label",
    },
    {
      id: "adze",
      fieldName: "Adze",
      fieldType: "checkbox",
    },
    {
      id: "bblow",
      fieldName: "Backpack Blower",
      fieldType: "checkbox",
    },
    {
      id: "bsaw",
      fieldName: "Brush Saw",
      fieldType: "checkbox",
    },
    {
      id: "csaw",
      fieldName: "Chain Saw",
      fieldType: "checkbox",
    },
    {
      id: "cbar",
      fieldName: "Claw Bar",
      fieldType: "checkbox",
    },
    {
      id: "dpins",
      fieldName: "Drift Pins",
      fieldType: "checkbox",
    },
    {
      id: "htamp",
      fieldName: "Hand Tamper",
      fieldType: "checkbox",
    },
    {
      id: "lboar",
      fieldName: "Level Board",
      fieldType: "checkbox",
    },
    {
      id: "lbar",
      fieldName: "Lining Bar",
      fieldType: "checkbox",
    },
    {
      id: "pick",
      fieldName: "Pick",
      fieldType: "checkbox",
    },
    {
      id: "polo",
      fieldName: "Pick Pole",
      fieldType: "checkbox",
    },
    {
      id: "pwren",
      fieldName: "Pipe Wrench",
      fieldType: "checkbox",
    },
    {
      id: "pdrill",
      fieldName: "Plank Drill",
      fieldType: "checkbox",
    },
    {
      id: "ptwre",
      fieldName: "Power Track Wrench",
      fieldType: "checkbox",
    },
    {
      id: "rbend",
      fieldName: "Rail Bender",
      fieldType: "checkbox",
    },
    {
      id: "rdril",
      fieldName: "Rail Drill",
      fieldType: "checkbox",
    },
    {
      id: "rfork",
      fieldName: "Rail Fork",
      fieldType: "checkbox",
    },
    {
      id: "rsaw",
      fieldName: "Rail Saw",
      fieldType: "checkbox",
    },
    {
      id: "rtong",
      fieldName: "Rail Tongs",
      fieldType: "checkbox",
    },
    {
      id: "rake",
      fieldName: "Rake",
      fieldType: "checkbox",
    },
    {
      id: "shame",
      fieldName: "Sledge Hammer",
      fieldType: "checkbox",
    },
    {
      id: "snowsho",
      fieldName: "Snow Shovel",
      fieldType: "checkbox",
    },
    {
      id: "spike",
      fieldName: "Spike Maul",
      fieldType: "checkbox",
    },
    {
      id: "spikepul",
      fieldName: "Spike Puller",
      fieldType: "checkbox",
    },
    {
      id: "spikestar",
      fieldName: "Spike Starter",
      fieldType: "checkbox",
    },
    {
      id: "broom",
      fieldName: "Switch Brooms",
      fieldType: "checkbox",
    },
    {
      id: "tampbar",
      fieldName: "Tamping Bar",
      fieldType: "checkbox",
    },
    {
      id: "tppug",
      fieldName: "Tie Plug Punch",
      fieldType: "checkbox",
    },
    {
      id: "ttong",
      fieldName: "Tie Tongs",
      fieldType: "checkbox",
    },
    {
      id: "tom",
      fieldName: "Tommy Bar",
      fieldType: "checkbox",
    },
    {
      id: "chisel",
      fieldName: "Track Chisel",
      fieldType: "checkbox",
    },
    {
      id: "tgage",
      fieldName: "Track Gauge",
      fieldType: "checkbox",
    },
    {
      id: "tjack",
      fieldName: "Track Jack",
      fieldType: "checkbox",
    },
    {
      id: "tshov",
      fieldName: "Track Shovel",
      fieldType: "checkbox",
    },
    {
      id: "tren",
      fieldName: "Track Wrench",
      fieldType: "checkbox",
    },
    {
      id: "mmeter",
      fieldName: "Signals Multi-Meter",
      fieldType: "checkbox",
    },
    {
      id: "handtol",
      fieldName: "Small Hand Tools",
      fieldType: "checkbox",
    },
    {
      id: "div2",
      fieldName: "",
      fieldType: "divider",
    },
    {
      id: "inspecomp",
      fieldName: "Pre-Trip Inspection Completed?",
      fieldType: "radioList",
      options: ["Yes", "No"],
    },
    {
      id: "open2",
      fieldName: "If No, Explain",
      fieldType: "text",
    },
    {
      id: "sp",
      fieldName: "",
      fieldType: "label",
    },
    {
      id: "tbltest",
      fieldName: "DISTANCE TO STOP TEST(S)",
      fieldType: "table",
      options: [
        {
          id: "info",
          fieldName:
            "This must be performed by all hi-rail and work equipment the first time you track travel each day and when rail conditions changes",
          fieldType: "label",
        },
        {
          id: "unitno",
          fieldName: "Unit #",
          fieldType: "text",
        },
        {
          id: "loco",
          fieldName: "Location",
          fieldType: "text",
        },
        {
          id: "timo",
          fieldName: "Time",
          fieldType: "text",
        },
        {
          id: "speedo",
          fieldName: "Speed",
          fieldType: "text",
        },
        {
          id: "dts",
          fieldName: "Distance to Stop",
          fieldType: "text",
        },
        {
          id: "rcond",
          fieldName: "Rail Condition",
          fieldType: "text",
        },
      ],
    },
    {
      id: "na3",
      fieldName: "N/A",
      fieldType: "checkbox",
    },
    {
      id: "div3",
      fieldName: "",
      fieldType: "divider",
    },
    {
      id: "flra",
      fieldName: "FIELD LEVEL RISK ASSESSMENT",
      fieldType: "label",
    },
    {
      id: "div6",
      fieldName: "",
      fieldType: "divider",
    },
    {
      id: "hexamp",
      fieldName: "HAZARD EXAMPLES",
      fieldType: "label",
    },
    {
      id: "div7",
      fieldName: "",
      fieldType: "divider",
    },
    {
      id: "access",
      fieldName: "Access / Egress",
      fieldType: "checkbox",
    },
    {
      id: "heavy",
      fieldName: "Heavy Lifting / Material Handling",
      fieldType: "checkbox",
    },
    {
      id: "sharp",
      fieldName: "Sharp Surfaces",
      fieldType: "checkbox",
    },
    {
      id: "anime",
      fieldName: "Animals / Insects",
      fieldType: "checkbox",
    },
    {
      id: "ice",
      fieldName: "Ice",
      fieldType: "checkbox",
    },
    {
      id: "sightline",
      fieldName: "Sightlines",
      fieldType: "checkbox",
    },
    {
      id: "postma",
      fieldName: "Awkward Positions (ergonomics)",
      fieldType: "checkbox",
    },
    {
      id: "inexp",
      fieldName: "Inexperienced Workers",
      fieldType: "checkbox",
    },
    {
      id: "stfa",
      fieldName: "Slips / Trips / Falls",
      fieldType: "checkbox",
    },
    {
      id: "chem",
      fieldName: "Chemicals",
      fieldType: "checkbox",
    },
    {
      id: "wlone",
      fieldName: "Lone Worker",
      fieldType: "checkbox",
    },
    {
      id: "sturckb",
      fieldName: "Struck By / Against",
      fieldType: "checkbox",
    },
    {
      id: "cranesr",
      fieldName: "Cranes / Rigging",
      fieldType: "checkbox",
    },
    {
      id: "mobic",
      fieldName: "Mobile Equipment",
      fieldType: "checkbox",
    },
    {
      id: "sfail",
      fieldName: "Structural Failure",
      fieldType: "checkbox",
    },
    {
      id: "dehyd",
      fieldName: "Dehydration",
      fieldType: "checkbox",
    },
    {
      id: "wnight",
      fieldName: "Night Work",
      fieldType: "checkbox",
    },
    {
      id: "train",
      fieldName: "Train(s)",
      fieldType: "checkbox",
    },
    {
      id: "dust",
      fieldName: "Dust / Flying Particles",
      fieldType: "checkbox",
    },
    {
      id: "noise",
      fieldName: "Noise Obstructions",
      fieldType: "checkbox",
    },
    {
      id: "underg",
      fieldName: "Underground Utilities",
      fieldType: "checkbox",
    },
    {
      id: "electuc",
      fieldName: "Electrocution",
      fieldType: "checkbox",
    },
    {
      id: "hopen",
      fieldName: "Open Holes",
      fieldType: "checkbox",
    },
    {
      id: "uneven",
      fieldName: "Uneven Surfaces / Rough Terrain",
      fieldType: "checkbox",
    },
    {
      id: "blind",
      fieldName: "Equipment Blind Spots",
      fieldType: "checkbox",
    },
    {
      id: "wgrop",
      fieldName: "Other Work Groups",
      fieldType: "checkbox",
    },
    {
      id: "uvexpo",
      fieldName: "UV Exposure",
      fieldType: "checkbox",
    },
    {
      id: "fobj",
      fieldName: "Falling Objects",
      fieldType: "checkbox",
    },
    {
      id: "overhead",
      fieldName: "Overhead Power Lines",
      fieldType: "checkbox",
    },
    {
      id: "vibra",
      fieldName: "Vibration",
      fieldType: "checkbox",
    },
    {
      id: "fatik",
      fieldName: "Fatigue",
      fieldType: "checkbox",
    },
    {
      id: "pinch",
      fieldName: "Pinch Points",
      fieldType: "checkbox",
    },
    {
      id: "weath",
      fieldName: "Weather",
      fieldType: "checkbox",
    },
    {
      id: "fire45",
      fieldName: "Fire",
      fieldType: "checkbox",
    },
    {
      id: "puninta",
      fieldName: "Public Interaction",
      fieldType: "checkbox",
    },
    {
      id: "heiwor",
      fieldName: "Working at Heights",
      fieldType: "checkbox",
    },
    {
      id: "hazmat",
      fieldName: "Hazardous Materials",
      fieldType: "checkbox",
    },
    {
      id: "remoloc",
      fieldName: "Remote Location",
      fieldType: "checkbox",
    },
    {
      id: "div8",
      fieldName: "",
      fieldType: "divider",
    },
    {
      id: "contpex",
      fieldName: "CONTROLS / PPE EXAMPLES",
      fieldType: "label",
    },
    {
      id: "div9",
      fieldName: "",
      fieldType: "divider",
    },
    {
      id: "travel5",
      fieldName: "500’ Travelling Distance",
      fieldType: "checkbox",
    },
    {
      id: "signage",
      fieldName: "Flags / Signage",
      fieldType: "checkbox",
    },
    {
      id: "warmup",
      fieldName: "Stretching / Warm-Up Excercies",
      fieldType: "checkbox",
    },
    {
      id: "wspace",
      fieldName: "40’ Work Space",
      fieldType: "checkbox",
    },
    {
      id: "jobrif",
      fieldName: "Job Briefing w/ RTC or Foreman (complete “Lone Worker” form if Hazard 18)",
      fieldType: "checkbox",
    },
    {
      id: "stob",
      fieldName: "Substitute the Object",
      fieldType: "checkbox",
    },
    {
      id: "cpoint",
      fieldName: "3-Point Contact",
      fieldType: "checkbox",
    },
    {
      id: "locates",
      fieldName: "Locates",
      fieldType: "checkbox",
    },
    {
      id: "tc900",
      fieldName: "Traffic Control",
      fieldType: "checkbox",
    },
    {
      id: "adev",
      fieldName: "Aerial Devices",
      fieldType: "checkbox",
    },
    {
      id: "ppp410",
      fieldName: "Policies / Procedures / Practices",
      fieldType: "checkbox",
    },
    {
      id: "tedu",
      fieldName: "Training / Education",
      fieldType: "checkbox",
    },
    {
      id: "bguard",
      fieldName: "Barriers / Guards / Covers",
      fieldType: "checkbox",
    },
    {
      id: "pro841",
      fieldName: "Protection (OCS, 841)",
      fieldType: "checkbox",
    },
    {
      id: "trvwacz",
      fieldName: "Travel Restraint",
      fieldType: "checkbox",
    },
    {
      id: "bumpcap",
      fieldName: "Bump Cap / Hard Hat",
      fieldType: "checkbox",
    },
    {
      id: "pglow",
      fieldName: "Protective Gloves",
      fieldType: "checkbox",
    },
    {
      id: "ventil",
      fieldName: "Ventilation",
      fieldType: "checkbox",
    },
    {
      id: "inspequ",
      fieldName: "Equipment Inspection",
      fieldType: "checkbox",
    },
    {
      id: "radiocom",
      fieldName: "Radio Communication",
      fieldType: "checkbox",
    },
    {
      id: "wacaz",
      fieldName: "Work Area Control Zone",
      fieldType: "checkbox",
    },
    {
      id: "eyeprot",
      fieldName: "Eye Protection",
      fieldType: "checkbox",
    },
    {
      id: "spoter",
      fieldName: "Safety Watch / Spotter (complete “Safety Watch” form)",
      fieldType: "checkbox",
    },
    {
      id: "wagah",
      fieldName: "Work on Ground vs. At Heights",
      fieldType: "checkbox",
    },
    {
      id: "fprevt",
      fieldName: "Fire Prevention / Suppression Equipment",
      fieldType: "checkbox",
    },
    {
      id: "sinspe",
      fieldName: "Site Inspection",
      fieldType: "checkbox",
    },
    {
      id: "sp898",
      fieldName: "",
      fieldType: "label",
    },
    {
      id: "tbliop",
      fieldName: "INDUSTRIAL OPERATIONS PROTOCOL (during fire season)",
      fieldType: "table",
      options: [
        {
          id: "sstw",
          fieldName: "See “Steps to Work with the Industrial Operations Protocol” at back of booklet",
          fieldType: "label",
        },
        {
          id: "doper",
          fieldName: "Description of Operation",
          fieldType: "text",
        },
        {
          id: "reqequi",
          fieldName: "Equipment Required",
          fieldType: "text",
        },
        {
          id: "stonin",
          fieldName: "Stoniness",
          fieldType: "radioList",
          options: ["<15%", ">15%"],
        },
        {
          id: "frisk",
          fieldName: "Fire Risk",
          fieldType: "radioList",
          options: ["Very High", "High", "Med", "Low"],
        },
        {
          id: "fuel",
          fieldName: "Fuel Group (+/- modifier)",
          fieldType: "text",
        },
        {
          id: "fic",
          fieldName: "Fire Intensity Code",
          fieldType: "radioList",
          options: ["A", "B", "C", "D", "E"],
        },
        {
          id: "ntac",
          fieldName: "NOT Trained & Capable",
          fieldType: "text",
        },
        {
          id: "taco",
          fieldName: "Trained & Capable",
          fieldType: "text",
        },
        {
          id: "sp22",
          fieldName: "",
          fieldType: "label",
        },
      ],
    },
    {
      id: "na5",
      fieldName: "N/A",
      fieldType: "checkbox",
    },
    {
      id: "div75",
      fieldName: "",
      fieldType: "divider",
    },

    {
      id: "div10",
      fieldName: "",
      fieldType: "divider",
    },
    {
      id: "debrief",
      fieldName: "DEBRIEFING (to be conducted at end of each work days – check off and complete)",
      fieldType: "label",
    },
    {
      id: "div13",
      fieldName: "",
      fieldType: "divider",
    },
    {
      id: "hwbcp",
      fieldName: "Has the work area been cleaned up, tools inspected after use and stored properly?",
      fieldType: "radioList",
      options: ["Yes", "No"],
    },
    {
      id: "open5",
      fieldName: "If No, Explain",
      fieldType: "text",
    },
    {
      id: "hasrn",
      fieldName: "Have all switches been restored to normal?",
      fieldType: "radioList",
      options: ["Yes", "No"],
    },
    {
      id: "open6",
      fieldName: "If No, Explain",
      fieldType: "text",
    },
    {
      id: "pnotes",
      fieldName: "Notes / Planning / Signal Maintainer Required Next Day? / Improvements",
      fieldType: "text",
    },
    {
      id: "sp3",
      fieldName: "",
      fieldType: "label",
    },
  ],
};
