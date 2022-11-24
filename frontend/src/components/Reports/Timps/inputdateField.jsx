import React from "react";
import DateRangeSelector from "../../Common/DateRangeSelector";
import moment from "moment";
class InputDateField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dateModal: false,
      inputValDate: "",
    };
    this.onToggle = this.onToggle.bind(this);
    this.handleOkClick = this.handleOkClick.bind(this);
  }

  componentDidMount() {
    if (this.props.defaultDate) {
      let inputValDate = moment(this.props.defaultDate.from).format("MM/DD/YYYY") + endDateVal(this.props.defaultDate);
      this.setState({
        inputValDate: inputValDate,
      });
    }
  }

  onToggle() {
    this.setState({
      dateModal: !this.state.dateModal,
    });
  }
  handleOkClick(dateRange) {
    this.onToggle();
    let validFrom = moment(dateRange.from).isValid();
    let dRange = dateRange;
    let today = moment();

    dRange.from = new Date(validFrom ? moment(dRange.from).startOf("day") : moment().startOf("day"));
    dRange.today = new Date(moment().startOf("day"));
    dRange.to = new Date(dRange.to ? moment(dRange.to).endOf("day") : moment(dateRange.from).endOf("day"));
    if (dRange.from && dRange.to) {
      this.props.updateDateRange(dRange);
    }
    let inputValDate = moment(dateRange.from).format("MM/DD/YYYY") + endDateVal(dateRange);
    if (dateRange.from && dateRange.to) {
      this.setState({
        inputValDate: inputValDate,
      });
    }
  }
  render() {
    return (
      <React.Fragment>
        <DateRangeSelector modal={this.state.dateModal} toggle={this.onToggle} handleOkClick={this.handleOkClick} />
        <div
          onClick={(e) => {
            this.onToggle();
          }}
        >
          {" "}
          {this.state.inputValDate}
        </div>
      </React.Fragment>
    );
  }
}

function endDateVal(dateRange) {
  let ret = "";
  if (moment(moment(dateRange.from).format("YYYY-MM-DD")).isSame(moment(dateRange.to).format("YYYY-MM-DD"))) {
  } else {
    ret = " to " + moment(dateRange.to).format("MM/DD/YYYY");
  }
  return ret;
}
export default InputDateField;
