/* eslint eqeqeq: 0 */
import moment from "moment";

let data = [
  {
    start: "2",
    end: "4",
    _id: "111",
    date: moment()
      .startOf("isoWeek")
      .add(3, "days"),
    lineName: "Lahore",
    lineId: "1",
    status: "Finished",

    tasks: [{ userStartMP: 1, userEndMP: 3, taskId: "121", units: [{ id: "u121", assetType: "Crossing", start: 1 }] }],
  },
  {
    start: "4",
    end: "6",
    _id: "121",
    date: moment()
      .startOf("isoWeek")
      .add(2, "days"),
    lineName: "Islamabad",
    lineId: "2",
    status: "In Progress",
    tasks: [{ userStartMP: 8, userEndMP: 11, taskId: "122", units: [{ id: "u122", assetType: "Signal", start: 3 }] }],
  },
  {
    start: "3",
    end: "5",
    _id: "112",
    date: moment()
      .startOf("isoWeek")
      .add(5, "days"),
    lineName: "Lahore",
    lineId: "1",
    status: "In Progress",
    tasks: [{ userStartMP: 12, userEndMP: 16, taskId: "123", units: [{ id: "u123", assetType: "Crossing", start: 5 }] }],
  },
  {
    start: "5",
    end: "12",
    _id: "122",
    date: moment()
      .startOf("isoWeek")
      .add(4, "days"),
    lineName: "Islamabad",
    lineId: "2",
    bgColor: "blue",
    status: "In Progress",
    tasks: [{ userStartMP: 2, userEndMP: 5 }],
  },
  {
    start: "9",
    end: "12",
    _id: "112",
    date: moment()
      .startOf("isoWeek")
      .add(5, "days"),
    lineName: "Lahore",
    lineId: "1",
    bgColor: "red",
    status: "In Progress",
    tasks: [{ userStartMP: 17, userEndMP: 21 }],
  },
  {
    start: "1",
    end: "2",
    _id: "122",
    date: moment()
      .startOf("isoWeek")
      .add(6, "days"),
    lineName: "Islamabad",
    lineId: "2",
    status: "In Progress",
    tasks: [{ userStartMP: 7, userEndMP: 9 }],
  },
  {
    start: "8",
    end: "13",
    _id: "122",
    date: moment()
      .startOf("isoWeek")
      .add(2, "days"),
    lineName: "Islamabad",
    lineId: "2",
    tasks: [{ userStartMP: 11, userEndMP: 16 }],
  },
];
export let locData = [
  { locName: "Lahore", _id: "1", lineId: "1", locStart: 0, locEnd: 25 },
  { locName: "Islamabad", _id: "2", lineId: "2", locStart: 0, locEnd: 17 },
];

export default data;
