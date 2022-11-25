import React from "react";
import InputDateField from "components/Reports/Timps/inputdateField";
import { languageService } from "Language/language.service";
import { themeService } from "../../../theme/service/activeTheme.service";
import moment from "moment";
import { CRUDFunction } from "../../../reduxCURD/container";
class HosView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dateRange: {
        from: new Date(moment().startOf("month")),
        today: new Date(moment().startOf("day")),
        to: new Date(moment().endOf("month")),
      },
    };
    this.updateDateRange = this.updateDateRange.bind(this);
  }
  updateDateRange(dateRange) {
    this.setState({
      dateRange: dateRange,
    });
    this.fetchDataFromServer(dateRange, this.props.user);
  }
  componentDidMount() {
    this.fetchDataFromServer(this.state.dateRange, this.props.user);
  }

  fetchDataFromServer(range, user) {
    let userId = user ? user._id : "";
    let query = "?startDate=" + range.from.toString() + "&endDate=" + range.to.toString() + "&id=" + userId;
    this.props.getHosUsers("hos/" + userId + query);
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.actionType !== prevProps.actionType && this.props.actionType == "HOSUSERS_READ_SUCCESS") {
    }
  }

  render() {
    let dayDataView =
      this.props.hosUsers &&
      this.props.hosUsers.map((dayData) => {
        return <UserDayView data={dayData} />;
      });
    return (
      <div>
        <label className="lbl-fro-date">{languageService("Select a Date Range")}</label>
        <span className="placeholder-for-date">
          <InputDateField updateDateRange={this.updateDateRange} defaultDate={this.state.dateRange} />
        </span>
        <div>{dayDataView}</div>
      </div>
    );
  }
}
const HosUserContainer = CRUDFunction(HosView, "hosUser", null, null, null, "users");
export default HosUserContainer;

const UserDayView = (props) => {
  let duration = 0;
  let min = "";
  let headingDay = props.data && props.data.date && moment(props.data.date).format("ddd Do MMM YYYY");
  let dataView =
    props.data &&
    props.data.data &&
    props.data.data.map((session) => {
      session.dur && (duration = duration + session.dur);
      let dur = session.dur ? Math.floor(session.dur / 60) : "";
      var minutes = session.dur ? session.dur % 60 : "";
      return (
        <tr>
          <td>{session.startTime} </td>
          <td>{session.endTime} </td>
          <td>{dur + (minutes ? ":" + minutes : ":00")} </td>
          <td>{session.comments} </td>
        </tr>
      );
    });
  if (duration > 0) {
    min = duration % 60;
  }
  if (duration > 0) duration = Math.floor(duration / 60);

  return (
    <div className="hos-panel">
      <div className="hos-title">
        <span style={{ marginLeft: "10px" }}>{headingDay}</span>
        <span style={{ float: "right", marginRight: "10px" }}>{"Duration  : " + duration + (min ? ":" + min : ":00")}</span>
      </div>
      {dataView && dataView.length > 0 && (
        <table className="table table-bordered table-hover table-sm">
          <thead className="thead-light">
            <tr>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Duration Hours</th>
              <th>Comments</th>
            </tr>
          </thead>
          <tbody>{dataView}</tbody>
        </table>
      )}
    </div>
  );
};
