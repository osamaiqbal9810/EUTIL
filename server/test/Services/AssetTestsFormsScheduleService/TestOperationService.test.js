import { TestScheduleObserverService } from "../../../service/TestScheduleObesrvingService";
process.env.NODE_ENV = "test";
let chai = require("chai");
let should = chai.should();
const assert = require("chai").assert;

describe("Asset tests operations Cases", () => {
  it("Start of next day and time to Call", () => {
    let testScheduleObserverService = new TestScheduleObserverService();
    let test = { timezone: "Canada/Eastern" };
    let date = new Date("2021-03-15 09:30:00.000Z");
    let result = testScheduleObserverService.getStartOfNextDay(date, test);
    let timeToCall = testScheduleObserverService.timeToCalCalculate(date, result);

    assert.deepEqual(new Date(result), new Date("2021-03-16 04:00:00.000Z"), "start of next day with time zone adjustment");
    assert.equal(timeToCall, 1000 * 60 * 60 * 18.5, "time between now and next day start");
  });
});
