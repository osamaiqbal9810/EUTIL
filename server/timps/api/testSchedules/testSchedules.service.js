import testSchedulesModel from "./testSchedules.model";
import _ from "lodash";
import { isJSON } from "../../../utilities/isJson";

class TestScheduleService {
  async getReportFilter(query) {
    let resultObj = {};
    let dateRange = null;
    let status = null;

    if (query.dateRange && isJSON(query.dateRange)) {
      dateRange = JSON.parse(query.dateRange);
    }
    if (query.status) {
      status = query.status;
    }

    let criteria = [
      {
        $match: {
          date: { $gte: new Date(dateRange.from), $lte: new Date(dateRange.to) },
          status: status,
        },
      },
      {
        $lookup: {
          from: "assettests",
          let: { testCode: "$testCode", assetId: "$assetId" },
          pipeline: [
            {
              $match: {
                $expr: { $and: [{ $eq: ["$testCode", "$$testCode"] }, { $eq: ["$assetId", "$$assetId"] }] },
              },
            },
            { $project: { title: "$title" } },
          ],
          as: "title",
        },
      },
      { $unwind: { path: "$title" } },
    ];
    try {
      if ((query.testCodes || query.testCode) && query.assetId && dateRange) {
        let testCodesMultipe = Array.isArray(query.testCodes) ? query.testCodes : [query.testCodes];
        let testCodeMatch = query.testCodes ? { $in: testCodesMultipe } : query.testCode;
        let statusCrit = query.status === "exec" ? { status: null } : {};
        let matchCriteria = [
          {
            $match: {
              date: { $gte: new Date(dateRange.from), $lte: new Date(dateRange.to) },
              assetId: query.assetId,
              testCode: testCodeMatch,
              ...statusCrit,
            },
          },
        ];
        //criteria[0]["$match"] = { ...criteria[0]["$match"], ...{ assetId: query.assetId, testCode: query.testCode } };
        let testsData = await testSchedulesModel.aggregate(matchCriteria);
        resultObj = { status: 200, value: testsData };
      } else if (query.testCode && query.assetId && dateRange) {
        let matchCrit = [
          {
            $match: {
              date: { $gte: new Date(dateRange.from), $lte: new Date(dateRange.to) },
              assetId: query.assetId,
              testCode: query.testCode,
              status: null,
            },
          },
        ];
        //criteria[0]["$match"] = { ...criteria[0]["$match"], ...{ assetId: query.assetId, testCode: query.testCode } };
        let testsData = await testSchedulesModel.aggregate(matchCrit);
        resultObj = { status: 200, value: testsData };
      } else if (query.assetId && dateRange) {
        criteria[0]["$match"] = { ...criteria[0]["$match"], ...{ assetId: query.assetId } };
        let testsData = await testSchedulesModel.aggregate(criteria);
        resultObj = { status: 200, value: testsData };
      } else if (dateRange) {
        let testsData = await testSchedulesModel.aggregate(criteria);
        if (testsData) {
          let dataToReturn = [];
          for (let data of testsData) {
            let outObj = {
              id: data.id,
              assetId: data.assetId,
              assetName: data.assetName,
              lineId: data.lineId,
              lineName: data.lineName,
              testCode: data.testCode,
              testDescription: data.testDescription,
              assetType: data.assetType,
              assetMP: data.assetMP,
              assetStart: data.assetStart,
              assetEnd: data.assetEnd,
              title: data.title,
            };
            let alreadyExists = await _.find(dataToReturn, { assetId: data.assetId, testCode: data.testCode });
            if (!alreadyExists) {
              dataToReturn.unshift(outObj);
            }
          }
          resultObj = { status: 200, value: dataToReturn };
        }
      } else {
        resultObj = { errorVal: "no date range provided", status: 404 };
      }
    } catch (error) {
      console.log("Error in getReportFilter ", error);
      resultObj = { errorVal: error, status: 500 };
    }
    return resultObj;
  }
  //   async createTestSchedules(workplan) {
  //     let assets, applicationLookupsService, fixedAssetTypes, lineAsset, assetTypeTests;
  //     assets = workplan && workplan.tasks && workplan.tasks[0] && workplan.tasks[0].units;
  //     if (assets) {
  //       applicationLookupsService = ServiceLocator.resolve("ApplicationLookupsService");
  //       fixedAssetTypes = await AssetsTypeModel.find({ assetTypeClassify: "point" }).exec();
  //       lineAsset = await AssetsModel.find({ _id: workplan.lineId });
  //       let testsResult = applicationLookupsService.getAssetTypeTests;
  //       if (testsResult.value) {
  //         // if tests exist then we proceed
  //         assetTypeTests = testsResult.value;
  //         for (let asset of assets) {
  //           // see if asset is fixed one
  //           let fixedAsset = _.find(fixedAssetTypes, { assetType: asset.assetType });
  //           if (fixedAsset) {
  //             // get the tests linked to this asset assetType
  //             let assetTests = _.filter(assetTypeTests, test => {
  //               let found = null;
  //               if (test.opt2 && test.opt2.config) {
  //                 found = _.find(test.opt2.config, { assetType: asset.assetType });
  //               }
  //               return found;
  //             });
  //             // NOT COMPLETED , DISCUSSION REQUIRED
  //           }
  //         }
  //       }
  //     }
  //   }
}
export default TestScheduleService;
