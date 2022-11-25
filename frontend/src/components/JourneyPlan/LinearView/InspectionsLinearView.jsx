/* eslint eqeqeq: 0 */
import React, { Component } from "react";
import _ from "lodash";
import LinearViewContainer from "../../Common/LinearDistanceDateControl/LinearViewContainer";
import LinearViewSignalAppContainer from "../LinearViewSignalApp/LinearViewSignalAppContainer";
import moment from "moment";
import { languageService } from "../../../Language/language.service";
import { getStatusColor } from "../../../utils/statusColors";
class InspectionsLinearView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inspectionGroups: {},
    };
  }
  componentDidMount() {
    this.loadInspections();
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.inspections !== prevProps.inspections) {
      this.loadInspections();
    }
    if (this.props.locationFilterStates !== prevProps.locationFilterStates) {
    }
  }

  loadInspections() {
    if (this.props.inspections && this.props.inspections.length > 0) {
      let copyInspections = [...this.props.inspections];

      _.remove(copyInspections, (i) => {
        return i.status !== "In Progress" && i.status !== "Finished";
      });
      copyInspections = copyInspections.map((inspection) => {
        let start = inspection.tasks[0].userStartMP ? inspection.tasks[0].userStartMP : inspection.tasks[0].runStart;
        let end = inspection.tasks[0].userEndMP ? inspection.tasks[0].userEndMP : inspection.tasks[0].runEnd;

        if (end && start && parseFloat(start) > parseFloat(end)) {
          [start, end] = [end, start];
        }
        let ins = {
          ...inspection,
          start: start,
          end: end,
          bgColor: getStatusColor(inspection.status),
        };

        return ins;
      });
      let inspectionGroupByLocation = _.groupBy(copyInspections, "lineId");
      this.setState({
        inspectionGroups: inspectionGroupByLocation,
      });
    }
  }
  render() {
    let linearViews = this.props.locations.map((location) => {
      let locationToFilter = this.props.locationFilterStates;

      let checkIfToShow = false;
      locationToFilter.forEach((loc) => {
        if (loc.id == location._id && loc.state == false) checkIfToShow = true;
      });

      return (
        <span key={location._id}>
          {!checkIfToShow && (
            <div
              className="scrollbarHor"
              style={{ margin: "10px 15px", overflowX: "scroll", background: "var(--fifth)", marginBottom: "15px", paddingBottom: "5px" }}
            >
              {!this.props.mode && (
                <LinearViewContainer
                  linearData={this.state.inspectionGroups[location._id]}
                  start={truncateNumber(location.start)}
                  end={truncateNumber(location.end)}
                  headingLabel={location.unitId}
                  config={{
                    startDate: moment().startOf("isoWeek"),
                    endDate: moment().endOf("isoWeek"),
                    dateStep: 1,
                    unitSize: 1,
                    prefix: "MP",
                    startField: "start",
                    endField: "end",
                    dateField: "date",
                  }}
                />
              )}
              {this.props.mode == "SignalApp" && (
                <LinearViewSignalAppContainer
                  linearData={this.state.inspectionGroups[location._id]}
                  start={truncateNumber(location.start)}
                  end={truncateNumber(location.end)}
                  headingLabel={languageService("Inspections & Tests") + " " + location.unitId}
                  assetTypes={this.props.assetTypes}
                  config={{
                    unitSize: 1,
                    prefix: "MP",
                    startField: "start",
                    endField: "end",
                    dateField: "date",
                  }}
                />
              )}
            </div>
          )}
        </span>
      );
    });

    return <React.Fragment>{linearViews}</React.Fragment>;
  }
}

export default InspectionsLinearView;

function truncateNumber(num) {
  let retNum = num ? parseFloat(num) : 0;
  let checkNum = Number.isInteger(retNum);
  if (!checkNum) {
    retNum = parseFloat(retNum.toFixed(2));
  }
  return retNum;
}
