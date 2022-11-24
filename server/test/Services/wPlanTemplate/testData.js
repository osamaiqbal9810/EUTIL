let completionObj = {
  completion: false,
  ranges: [
    {
      intervals: [{ start: "8.9", end: "27", status: "closed" }],
    },
    {
      intervals: [{ start: "57.82", end: "40", status: "closed" }],
    },
    {
      intervals: [{ start: "27", end: "40", status: "closed" }],
    },
  ],
};
let completionObjFail = {
  completion: false,
  ranges: [
    {
      intervals: [
        { start: 8.9, end: 25, status: "closed" },
        { start: 30.5, end: 50, status: "closed" }, // instead of 27 it start from 30.5
      ],
    },
    {
      intervals: [
        { start: 52, end: 57.82, status: "closed" }, // instead of 50 it start from 52
      ],
    },
  ],
};
let completionObjFailStart = {
  completion: false,
  ranges: [
    {
      intervals: [
        { start: 15, end: 27, status: "closed" }, // instead of 8.9 it start from 15
        { start: 25, end: 50, status: "closed" },
      ],
    },
    {
      intervals: [{ start: 48, end: 57.82, status: "closed" }],
    },
  ],
};
let completionObjFailEnd = {
  completion: false,
  ranges: [
    {
      intervals: [
        { start: 8.9, end: 27, status: "closed" },
        { start: 27, end: 50, status: "closed" },
      ],
    },
    {
      intervals: [
        { start: 50, end: 51, status: "closed" }, // instead of 57.82 it end to 54
      ],
    },
  ],
};
let QACompletionObj = {
  completion: false,
  ranges: [
    {
      inspectionId: "604a3646ac12f638502e7b44",
      inspectionName: "Kendaia Line",
      user: {
        id: "5e4ef9a0c77acb0478b26f0a",
        name: "Joe Denny",
        email: "jdenny@tektracking.com",
      },
      intervals: [
        {
          id: "8f81c0f7-a5df-4d5c-bd17-bb8f21b31b6a",
          start: 330,
          end: 334,
          status: "closed",
          expEnd: "334",
          startTime: "Thu Mar 11 20:24:57 GMT+05:00 2021",
          startLocation: "31.5024281,74.350079",
          endTime: "Thu Mar 11 20:27:26 GMT+05:00 2021",
          endLocation: "31.5024436,74.3500757",
        },
      ],
    },
    {
      inspectionId: "604a368dac12f638502e7b45",
      inspectionName: "Kendaia Line",
      user: {
        id: "5fb26a629b1b9bb82e8cb737",
        name: "Charlie Smith",
        email: "charliesmith@fingerlakesrail.com",
      },
      intervals: [
        {
          id: "f3d8369f-8f35-4f08-8cdb-01d7b3ee6dfe",
          start: "339",
          end: "342",
          status: "closed",
          expEnd: "342",
          startTime: "Thu Mar 11 20:26:07 GMT+05:00 2021",
          startLocation: "37.4219983,-122.084",
          endTime: "Thu Mar 11 20:27:03 GMT+05:00 2021",
          endLocation: "37.4219983,-122.084",
        },
      ],
    },
    {
      inspectionId: "604a390bac12f638502e7b46",
      inspectionName: "Kendaia Line",
      user: {
        id: "5fb26a629b1b9bb82e8cb737",
        name: "Charlie Smith",
        email: "charliesmith@fingerlakesrail.com",
      },
      intervals: [
        {
          id: "a3e783d3-99ed-4f73-80eb-daf33b276272",
          start: 334,
          end: 339,
          status: "closed",
          expEnd: "339",
          startTime: "Thu Mar 11 20:36:45 GMT+05:00 2021",
          startLocation: "37.4219983,-122.084",
          endTime: "Thu Mar 11 20:37:01 GMT+05:00 2021",
          endLocation: "37.4219983,-122.084",
        },
      ],
    },
    {
      inspectionId: "604a39a4ac12f638502e7b47",
      inspectionName: "Kendaia Line",
      user: {
        id: "5e4ef9a0c77acb0478b26f0a",
        name: "Joe Denny",
        email: "jdenny@tektracking.com",
      },
      intervals: [
        {
          id: "c047fdf2-c740-440f-b584-24001854efc9",
          start: 335,
          end: 340,
          status: "closed",
          expEnd: "340",
          startTime: "Thu Mar 11 20:39:18 GMT+05:00 2021",
          startLocation: "31.5024233,74.3499817",
          endTime: "Thu Mar 11 20:39:33 GMT+05:00 2021",
          endLocation: "31.5024307,74.3499638",
        },
      ],
    },
    {
      inspectionId: "604a3a46ac12f638502e7b48",
      inspectionName: "Kendaia Line",
      user: {
        id: "5fb26a629b1b9bb82e8cb737",
        name: "Charlie Smith",
        email: "charliesmith@fingerlakesrail.com",
      },
      intervals: [
        {
          id: "43898872-d168-407d-a025-59f1861127e0",
          start: 333,
          end: 338,
          status: "closed",
          expEnd: "333",
          startTime: "Thu Mar 11 20:42:01 GMT+05:00 2021",
          startLocation: "37.4219983,-122.084",
          endTime: "Thu Mar 11 20:45:00 GMT+05:00 2021",
          endLocation: "37.4219983,-122.084",
        },
      ],
    },
    {
      inspectionId: "604a3c0dac12f638502e7b49",
      inspectionName: "Kendaia Line",
      user: {
        id: "5e4ef9a0c77acb0478b26f0a",
        name: "Joe Denny",
        email: "jdenny@tektracking.com",
      },
      intervals: [
        {
          id: "0885405b-760d-4a75-846e-8f87572ce39d",
          start: 336,
          end: 338,
          status: "closed",
          expEnd: "338",
          startTime: "Thu Mar 11 20:49:35 GMT+05:00 2021",
          startLocation: "31.5024772,74.3500211",
          endTime: "Thu Mar 11 20:51:00 GMT+05:00 2021",
          endLocation: "31.5024213,74.349889",
        },
      ],
    },
    {
      inspectionId: "604a3c2aac12f638502e7b4a",
      inspectionName: "Kendaia Line",
      user: {
        id: "5fb26a629b1b9bb82e8cb737",
        name: "Charlie Smith",
        email: "charliesmith@fingerlakesrail.com",
      },
      intervals: [
        {
          id: "52c9c1ee-389a-41da-b59b-e2bcd58cd80b",
          start: 336,
          end: 338,
          status: "closed",
          expEnd: "338",
          startTime: "Thu Mar 11 20:50:04 GMT+05:00 2021",
          startLocation: "37.4219983,-122.084",
          endTime: "Thu Mar 11 20:50:57 GMT+05:00 2021",
          endLocation: "37.4219983,-122.084",
        },
      ],
    },
    {
      inspectionId: "604a3d3bac12f638502e7b4b",
      inspectionName: "Kendaia Line",
      user: {
        id: "5e4ef9a0c77acb0478b26f0a",
        name: "Joe Denny",
        email: "jdenny@tektracking.com",
      },
      intervals: [
        {
          id: "5e2a30aa-c75e-4214-b37f-fa714a5c41a8",
          start: 329.26,
          end: 330,
          status: "closed",
          expEnd: "330",
          startTime: "Thu Mar 11 20:54:37 GMT+05:00 2021",
          startLocation: "31.5025366,74.3499732",
          endTime: "Thu Mar 11 20:55:56 GMT+05:00 2021",
          endLocation: "31.502458,74.3499675",
        },
      ],
    },
    {
      inspectionId: "604a3d42ac12f638502e7b4c",
      inspectionName: "Kendaia Line",
      user: {
        id: "5fb26a629b1b9bb82e8cb737",
        name: "Charlie Smith",
        email: "charliesmith@fingerlakesrail.com",
      },
      intervals: [
        {
          id: "9c53a6d4-e3c9-4b94-b15b-87f9c675ac47",
          start: "342",
          end: "343.3",
          status: "closed",
          expEnd: "343.3",
          startTime: "Thu Mar 11 20:54:44 GMT+05:00 2021",
          startLocation: "37.4219983,-122.084",
          endTime: "Thu Mar 11 20:55:49 GMT+05:00 2021",
          endLocation: "37.4219983,-122.084",
        },
      ],
    },
  ],
};
let template = {
  tasks: [
    {
      runStart: 8.9,
      runEnd: 57.82,
    },
  ],
};
let qaTemplate = {
  tasks: [
    {
      runStart: 329.26,
      runEnd: 343.3,
    },
  ],
};
import _ from "lodash";
export const completionData = {
  completionObj: { ...completionObj },
  template: { ...template },
};
export const completionDataFail = {
  completionObj: { ...completionObjFail },
  template: { ...template },
};
export const completionDataFailStart = {
  completionObj: { ...completionObjFailStart },
  template: { ...template },
};
export const completionDataFailEnd = {
  completionObj: { ...completionObjFailEnd },
  template: { ...template },
};

export const completionTemplateSessionQAData = {
  completionObj: { ...QACompletionObj },
  template: { ...qaTemplate },
};
