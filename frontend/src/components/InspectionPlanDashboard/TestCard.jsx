import React from "react";
import moment from "moment";
export const TestCard = (props) => {
  let nextDue = props.test && props.test.nextDueDate;
  let nextExpiry = props.test && props.test.nextExpiryDate;
  let currentPeriodStart = props.test && props.test.currentPeriodStart;
  let status = calculatorDateStatus(nextDue, nextExpiry, currentPeriodStart);
  return (
    <div className="location-card" style={{ borderColor: status.status }}>
      <div className="card-title">{props.test.title}</div>
      <div className="card-msg">
        Status : <span className="status-color" style={{ backgroundColor: status.status }}></span> {status.text}
      </div>
    </div>
  );
};

function calculatorDateStatus(nextDueDate, nextExpiryDate, currentPeriodStart) {
  let text = "";
  let status = "";
  if (moment(nextDueDate).isAfter(moment())) {
    let duration = moment.duration(moment().diff(moment(nextDueDate)));
    text = "Due In " + duration.hours() + "H : " + duration.minutes() + "M";
    status = "Grey";
  } else {
    let durationEx = moment.duration(moment(nextExpiryDate).diff(moment()));
    text = "Expire In " + durationEx.hours() + "H : " + durationEx.minutes() + "M";
    status = "Green";
    if (durationEx / moment(currentPeriodStart).diff(moment(nextExpiryDate)) < 0.25) {
      status = "Red";
    }
  }

  return { text: text, status: status };
}
