import React, { Component } from "react";
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Label } from "components/Common/Forms/formsMiscItems";
import { ModalStyles } from "components/Common/styles.js";
import DayPicker, { DateUtils } from "react-day-picker";
import MomentLocaleUtils from "react-day-picker/moment";
import "components/Common/commonform.css";
import { getLanguageLocal, languageService } from "../../Language/language.service";
import { MyButton } from "./Forms/formsMiscItems";
import { CommonFormStyle } from "components/SetupPage/User/UserForm/style";
import { basicColors, retroColors, electricColors } from "style/basic/basicColors";
import { CommonModalStyle, ButtonStyle } from "style/basic/commonControls";
import { themeService } from "theme/service/activeTheme.service";
class DateRangeSelector extends Component {
  constructor(props) {
    super(props);

    this.handleDayClick = this.handleDayClick.bind(this);
    this.handleResetClick = this.handleResetClick.bind(this);
    this.handleOkClick = this.handleOkClick.bind(this);

    this.state = {
      dateRange: { from: undefined, to: undefined },
    };
  }
  handleDayClick(day) {
    //console.log(day);
    let d = new Date(this.props.minReportDate);
    let validMinCheck = d instanceof Date && !isNaN(d) ? true : false;
    let condition = validMinCheck ? d <= day : true;
    if (condition) {
      const range = DateUtils.addDayToRange(day, this.state.dateRange);
      this.setState({ dateRange: range });
    }
  }
  handleResetClick() {
    this.setState({ dateRange: { from: undefined, to: undefined } });
  }
  handleOkClick() {
    this.props.handleOkClick(this.state.dateRange);
  }

  render() {
    // if(!this || !this.state || !this.state.dateRange)
    // return null;

    const { from, to } = this.state.dateRange;
    const modifiers = { start: from, end: to };

    return (
      <Modal isOpen={this.props.modal} style={{ maxWidth: "50vw" }} style={themeService(CommonFormStyle.formStyle)}>
        <ModalBody style={themeService(CommonModalStyle.body)}>
          <Row>
            <ModalHeader style={{ width: "100%", ...themeService(CommonModalStyle.header) }}>
              {languageService("Select Date(s)")}
            </ModalHeader>
          </Row>
          <Row>
            <DayPicker
              selectedDays={[from, { from, to }]}
              onDayClick={this.handleDayClick}
              modifiers={modifiers}
              locale={getLanguageLocal()}
              localeUtils={MomentLocaleUtils}
              className="retro"
              disabledDays={this.props.disabledDays}
            />
          </Row>
          <Row>
            <Col md="4" style={{ textAlign: "center" }}>
              <MyButton type="button" onClick={this.handleResetClick}>
                {languageService("Reset")}
              </MyButton>
            </Col>

            <Col md="4" style={{ textAlign: "center" }}>
              <MyButton type="button" onClick={this.handleOkClick}>
                {languageService("Ok")}
              </MyButton>
            </Col>
            <Col md="4" style={{ textAlign: "center" }}>
              <MyButton type="button" onClick={this.props.toggle}>
                {languageService("Cancel")}
              </MyButton>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    );
  }
}

export default DateRangeSelector;
