import { attributes } from "../../../../frontend/src/components/Line/Add/variables";
export const D1nullTasks = {
  tasks: null,
};
export const D2ContainsUnits = {
  tasks: [
    {
      units: [{ unitId: "Sample Unit" }],
    },
  ],
};

export const D3ContainsUnitsNoAdjCoordinates = {
  tasks: [
    {
      units: [{ unitId: "Alpha 1" }, { unitId: "Alpha 2" }, { unitId: "Alpha 3" }],
    },
  ],
};

export const D4UnitsWithAdjCoordinates = {
  tasks: [
    {
      units: [
        { id: "a1", adjCoordinates: { type: "Point", coordinates: [-76.213296831, 43.0646138765939] } },
        { id: "a2", adjCoordinates: { type: "Point", coordinates: [-76.213296833, 43.064613876594] } },
        { id: "a3", adjCoordinates: { type: "Point", coordinates: [-76.213296835, 43.0646138765941] } },
        { id: "a4", unitId: "Alpha" },
      ],
    },
  ],
};

export const D5WorkplanTemplate = {
  tasks: [
    {
      units: [{ id: "a1" }, { id: "a2" }, { id: "a3" }, { id: "a4" }],
    },
  ],
};

export const RD5WorkplanTemplate = {
  tasks: [
    {
      units: [
        { id: "a1", adjCoordinates: { type: "Point", coordinates: [-76.213296831, 43.0646138765939] } },
        { id: "a2", adjCoordinates: { type: "Point", coordinates: [-76.213296833, 43.064613876594] } },
        { id: "a3", adjCoordinates: { type: "Point", coordinates: [-76.213296835, 43.0646138765941] } },
        { id: "a4" },
      ],
    },
  ],
};

export const D6UnsetAssetGPSAdj = [
  { id: "a1", adjCoordinates: { type: "Point", coordinates: [0, 0] } },
  { id: "a2", adjCoordinates: { type: "Point", coordinates: [-76.213296831, 43.0646138765939] } },
];

export const D7WorkPlanTemplate = {
  tasks: [{}],
};
