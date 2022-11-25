let ServiceLocator = require("../../../framework/servicelocator");
import { findInspectionStatus } from "../findInspectionStatus";
import moment from "moment";
import AssetsReportModel from "../InspectionReports/InspectionReports.model";
export const GetAssetInspectionStatus = async () => {
    let wPlanTemplate = ServiceLocator.resolve("WorkPlanTemplateModel");
    let JourneyPlanModel = ServiceLocator.resolve("JourneyPlanModel");
    let AssetsModel = ServiceLocator.resolve("AssetsModel");
    let wplan = await wPlanTemplate.find({});
    let jPlan = await JourneyPlanModel.find({});
    let assets = await AssetsModel.find({});
    wplan.forEach(async (plan) => {
        if (plan) {
            let journeyPlan = jPlan.find(({ workplanTemplateId }) => workplanTemplateId == plan._id);
            if (journeyPlan) {
                //if inspection is started and its journey plan is created
                journeyPlan.tasks.forEach((task) => {
                    if (task && task.units) {
                        let status = "";
                        task.units.forEach(async (unit) => {
                            if (unit) {
                                let nextInspectionDate = plan.inspection_date;
                                let frequency = getInspectionFrequency(unit);
                                status = findInspectionStatus(nextInspectionDate, frequency);
                                unit.status = status;
                                let asset = assets.find(({ _id }) => _id == unit.id);
                                if (asset) {
                                    await rescheduleAssets(plan, asset, AssetsModel);
                                }
                            }
                        })
                    }
                })
                await rescheduleWorkPlan(plan, wPlanTemplate, journeyPlan);
            }
            else {
                // if inspection is not even started and journey plan for that inspection is not created
                plan.tasks.forEach(async (task) => {
                    if (task && task.units) {
                        await createAssetReport(plan, task);
                        await rescheduleWorkPlan(plan, wPlanTemplate);

                    }

                })
            }
        }
    })
}
async function rescheduleAssets(plan, asset, AssetsModel) {
    if (plan && asset) {
        let nextInspDate = calculateNextInspectionDate(plan);
        asset.inspectionDates[plan.lastInspDateFieldName] = asset.inspectionDates[plan.nextInspDateFieldName];
        asset.inspectionDates[plan.nextInspDateFieldName] = moment(nextInspDate).format('MM/DD/YYYY');
        let query = { _id: asset._id };
        let updatedAsset = new AssetsModel(asset);
        let save = await updatedAsset.save();

    }

}
async function rescheduleWorkPlan(plan, wPlanTemplate, journeyPlan = null) {
    let JourneyPlanModel = ServiceLocator.resolve("JourneyPlanModel");
    if (plan && wPlanTemplate) {
        if (journeyPlan) {
            let planFrequency = getInspectionFrequency(plan)
            plan.lastInspection = plan.inspection_date;
            let next_inspection_date = calculateNextInspectionDate(plan);
            if (next_inspection_date) {
                journeyPlan.status = findInspectionStatus(plan.inspection_date, planFrequency);
                journeyPlan.date = journeyPlan.status !== "Finished" ? plan.inspection_date : journeyPlan.date;
                console.log(journeyPlan.status)
                if (journeyPlan.status == "Missed" || journeyPlan.status == "Finished") {
                    let jPlan = { ...journeyPlan };
                    //console.log(jPlan._doc);
                    delete jPlan._doc._id;
                    let reportJPlan = new AssetsReportModel(jPlan._doc);
                    await reportJPlan.save();

                }

                let status = findInspectionStatus(plan.inspection_date, planFrequency, plan.lastInspection);
                plan.inspection_date = next_inspection_date;
                plan.nextInspectionDate = next_inspection_date;
                let saveWp = new wPlanTemplate(plan);
                let save = await saveWp.save();
                if (status !== "Upcoming" && status == "Missed") {
                    journeyPlan.status = "Finished";
                } else {
                    journeyPlan.status = status;
                }
                journeyPlan.date = next_inspection_date;
                let query = { _id: journeyPlan._id };
                let saveJp = await JourneyPlanModel.findOneAndUpdate(query, journeyPlan, { upsert: true });
            }

        }
        else {
            plan.lastInspection = plan.inspection_date;
            let next_inspection_date = calculateNextInspectionDate(plan);
            if (next_inspection_date) {
                plan.inspection_date = next_inspection_date;
                plan.nextInspectionDate = next_inspection_date;

                let query = { _id: plan._id };
                let saveWP = await wPlanTemplate.findOneAndUpdate(query, plan, { upsert: true });
            }

        }
    }
}

function calculateNextInspectionDate(plan) {
    if (plan) {
        let currentInspectionDate = plan.inspection_date;
        let frequency = getInspectionFrequency(plan);
        let nextInspectionDate = null;
        if (frequency) {
            nextInspectionDate = moment(currentInspectionDate).add(frequency, 'year');
        }
        return nextInspectionDate;
    }
}
async function createAssetReport(plan, task) {
    let AssetsModel = ServiceLocator.resolve("AssetsModel");
    let assets = await AssetsModel.find({});
    task.units.forEach(async(unit) => {
        let nextInspectionDate = plan.inspection_date;
        let frequency = getInspectionFrequency(unit);
        if (frequency) {
            let status = findInspectionStatus(nextInspectionDate, frequency);
            
            unit.status = status;
            let asset = assets.find(({ _id }) => _id == unit.id);
            if (asset) {
                await rescheduleAssets(plan, asset, AssetsModel);
            }
        }
    })
    let date = plan.inspection_date;
    let title = plan.title;
    let workplanTemplateId = plan._id;
    let lineId = plan.lineId;
    let user = {
        id: plan.user._id,
        name: plan.user.name,
        email: plan.user.email
    };
    let units = task.units;
    let AR = {
        tasks: [
            {
                taskId: "",
                taskId: "",
                startLocation: "",
                endLocation: "",
                startTime: "",
                endTime: "",
                status: "",
                title: "",
                desc: "",
                notes: "",
                imgs: "",
                lineCords: {
                    type: ""
                },
                userStartMP: "",
                userEndMP: "",
                runStart: "",
                runEnd: "",
                traverseTrack: "",
                observeTrack: "",
                traverseBy: "",
                weatherConditions: "",
                temperature: "",
                inspectionType: "Required Inspection",
                inspectionTypeTag: "required",
                inspectionTypeDescription: "",
                tempUnit: "F",
                locUnit: "MP",
                appVersion: "1.7",
                issues: [],
                units: units,
            }
        ],
        jobBriefings: [],
        intervals: [],
        date: date,
        title: title,
        workplanTemplateId: workplanTemplateId,
        lineId: lineId,
        lineName: "",
        startDateTime: "",
        startLocation: "",
        endDateTime: "",
        endLocation: "",
        //status: findInspectionStatus(date, planFrequency),
        status: "Missed",
        subdivision: "",
        privateKey: "",
        user: user,
        inspectionCompleted: false,
        roadMaster: {},
    }

    //console.log(plan);
    let assetReport = new AssetsReportModel(AR);
    let save = await assetReport.save();


}
function getInspectionFrequency(unit) {
    let freqMap = {
        "NA": 0,
        "Once a year": 1,
        "Once in three years": 3,
        "Once in five years": 5
    }
    if (unit) {
        return freqMap[unit.inspection_freq]
    }
}
