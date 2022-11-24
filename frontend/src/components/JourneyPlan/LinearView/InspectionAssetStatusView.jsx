import React, { Component } from "react";
import { getStatusColor } from "../../../utils/statusColors";
import _ from "lodash";
import InspectionSwitchStatus from "../SwitchesStatusView/InspectionSwitchStatus";
import moment from "moment";
import { inspectionAssetStatusViewStyles } from "./styles";
export default class InspectionAssetStatusView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inspectionGroups: {},
    };
    this.modes = {
      Switch: ["Switch"],
      Signal: ["Signal", "Crossing"],
      Bridge: ["Bridge"],
    };
  }
  componentDidMount() {
    const allExist =
      this.props.inspections && this.props.assetsByLocations && this.props.locationFilterStates && this.props.daysBeforeSwitchAlert;
    if (allExist) {
      this.loadDataAssetsWithStatus();
    }
  }
  componentDidUpdate(prevProps, prevState) {
    const allExist =
      this.props.inspections && this.props.assetsByLocations && this.props.locationFilterStates && this.props.daysBeforeSwitchAlert;
    const orCondition =
      this.props.inspections !== prevProps.inspections ||
      this.props.assetsByLocations !== prevProps.assetsByLocations ||
      this.props.locationFilterStates !== prevProps.locationFilterStates ||
      this.props.daysBeforeSwitchAlert !== prevProps.daysBeforeSwitchAlert;

    if (allExist && orCondition) {
      this.loadDataAssetsWithStatus();
    }
  }
  loadDataAssetsWithStatus() {
    let locationData = {};
    const { assetsByLocations } = this.props;
    this.props.locationFilterStates.forEach((ele) => {
      let assetsToPass = [];
      let inspectionRelated = [];
      if (this.props.mode) {
        // get all assets of current mode

        this.modes[this.props.mode].forEach((aTypeName) => {
          if (assetsByLocations && assetsByLocations[ele.id][aTypeName]) {
            assetsToPass = [...assetsToPass, ...assetsByLocations[ele.id][aTypeName]];
          }
        });
        // if switch mode then check if today is passed the alert range date and change default status of asset
        if (this.props.mode == "Switch") {
          assetsToPass.forEach((asset) => {
            let afterDate = moment()
              .endOf("month")
              .subtract(this.props.daysBeforeSwitchAlert ? this.props.daysBeforeSwitchAlert : 7, "days");
            if (moment().isAfter(afterDate)) {
              asset.status = 2;
            }
          });
        }
        // iterate over assets along with inspection and set the asset status based on mode (Swtich , Tracks , Signal/Crossing , Bridge)
        this.props.inspections &&
          this.props.inspections.forEach((ins) => {
            let inspToPush = false;
            ins &&
              ins.lineId == ele.id &&
              (ins.status == "In Progress" || ins.status == "Finished") &&
              ins.tasks &&
              ins.tasks.forEach((task) => {
                if (this.props.mode == "Switch") {
                  // calcualte in tasks
                  if (task && task.units && task.units.length > 0) {
                    assetsToPass.forEach((asset) => {
                      var found = _.find(task.units, { id: asset._id });
                      if (found) {
                        asset.status = 1;
                        asset.inspections ? asset.inspections.push(ins._id) : (asset.inspections = [ins._id]);
                        inspToPush = true;
                      }
                    });
                  }
                } else if (this.props.mode == "Signal") {
                  // TODO : get the units from issue to map asset status
                }
              });
            inspToPush && inspectionRelated.push({ date: ins.date, status: ins.status, id: ins._id, title: ins.title });
          });
      } else {
        // default location inspection by length of runs
        // TODO : ^
      }
      locationData[ele.id] = {
        assetsToPass: assetsToPass,
        inspectionRelated: inspectionRelated,
        location: assetsByLocations[ele.id] && assetsByLocations[ele.id].location,
      };
    });
    let yAxis = [];
    if (this.props.mode && this.props.mode == "Switch") {
      //calculate yAxis by Dates
      yAxis = [
        {
          text: moment().startOf("month").format("DD-MM-YYYY"),
          date: moment().startOf("month"),
        },
      ];
      let nextDate = moment().startOf("month");
      let numOfDays = moment().endOf("month").diff(moment().startOf("month"), "days");
      while (numOfDays) {
        nextDate = moment(nextDate).add(1, "days");
        yAxis.push({ text: nextDate.format("DD-MM-YYYY"), date: nextDate });
        numOfDays = numOfDays - 1;
      }
    }
    this.setState({
      locationData,
      yAxis,
    });
  }
  render() {
    let linearViews =
      this.props.locationFilterStates &&
      this.props.locationFilterStates.map((loc) => {
        let checkIfToShow = false;
        if (loc.state == false) checkIfToShow = true;
        return (
          <React.Fragment key={loc.id}>
            {!checkIfToShow && (
              <div style={inspectionAssetStatusViewStyles.container} key={loc.id}>
                {this.props.mode == "Switch" && (
                  <InspectionSwitchStatus
                    data={this.state.locationData ? this.state.locationData[loc.id] : null}
                    yAxis={this.state.yAxis}
                    config={{
                      prefix: "MP",
                    }}
                  />
                )}
              </div>
            )}
          </React.Fragment>
        );
      });

    return <React.Fragment>{linearViews}</React.Fragment>;
  }
}

function truncateNumber(num) {
  let retNum = num ? parseFloat(num) : 0;
  let checkNum = Number.isInteger(retNum);
  if (!checkNum) {
    retNum = parseFloat(retNum.toFixed(2));
  }
  return retNum;
}
