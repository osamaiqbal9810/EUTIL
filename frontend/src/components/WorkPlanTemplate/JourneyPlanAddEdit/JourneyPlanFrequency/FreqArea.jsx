import React, { Component } from "react";
import InspectionFreqRow, { freqObj } from "./InspectionFreqRow";
import AddNewInputField from "../../../LocationSetup/AddNewInputField";
import { locationListStyle } from "../../../LocationSetup/LocationListStyle";
import { plus } from "react-icons-kit/icomoon/plus";
import SvgIcon from "react-icons-kit";
import { themeService } from "../../../../theme/service/activeTheme.service";
import { Tooltip } from "reactstrap";
import { basicColors, retroColors, electricColors } from "../../../../style/basic/basicColors";
export default class FreqArea extends Component {
  render() {
    let rowsOfFreqs = this.props.inspectionFrequencies.map((freqObject, index) => {
      return (
        <InspectionFreqRow
          key={freqObject.id}
          frequenciesChangeHandler={this.props.frequenciesChangeHandler}
          rowIndex={index}
          freqObject={freqObject}
        />
      );
    });
    return (
      <React.Fragment>
        {rowsOfFreqs}
        {/* <AddNewOp addClick={this.props.frequenciesChangeHandler} addParam={freqObj} /> */}
      </React.Fragment>
    );
  }
}

const AddNewOp = (props) => {
  return (
    <React.Fragment>
      <div
        style={{ ...themeService(locationListStyle.addNewField), color: retroColors.second, width: "12px" }}
        onClick={(e) => {
          props.addClick(props.addParam);
        }}
      >
        <SvgIcon id={"add_button_freq"} style={themeService(locationListStyle.addIconStyle)} icon={plus} size="15" />
      </div>
      {/* <Tooltip isOpen={this.state.tooltip} target={`add_button_freq`} toggle={() => this.setState({ tooltip: !this.state.tooltip })}>
        Add
      </Tooltip> */}
    </React.Fragment>
  );
};
