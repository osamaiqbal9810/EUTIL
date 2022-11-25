import _ from "lodash";
import moment from 'moment';
import AssetsReportModel from "../InspectionReports/InspectionReports.model";
class InspectionReports {
  async getAssetsreports() {
    let resultObj = {},
      assetsReports;

    try {

      assetsReports = await AssetsReportModel.find({}).exec();
      resultObj = { value: assetsReports, status: 200 };
    } catch (err) {
      resultObj = { errorVal: err.toString(), status: 500 };
      console.log("InspectionReports.service catch error:", err.toString());
    }
    return resultObj;
  }
}

export default InspectionReports;
