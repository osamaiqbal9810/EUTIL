import React, { Component } from "react";
import { switchReportStyle } from "./style/index";
import { themeService } from "../../../theme/service/activeTheme.service";
import { getLanguageLocal, languageService } from "Language/language.service";
import { Container, Col, Row, Label, Button, FormGroup } from "reactstrap";
import { Rect } from "react-konva";
import moment from "moment";
import _ from "lodash";
import { iconToShow, iconTwoShow } from "../variables";
import { getFieldsReport } from "./appFormReportsUtility";
import GI303Report from "./maintenance-303View";
import GI305Report from "./maintenance-305aView";

class BatteryTestReportsB12B24 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      assetsData: [],
      assetsData12: [],
    };
    this.config = {
      minRows: 7,
      minCommentsRow: 7,
    };
  }
  componentDidMount() {
    this.calculateData(this.props.reportData);
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.reportData !== prevProps.reportData && this.props.reportData) {
      this.calculateData(this.props.reportData);
    }
  }
  calculateData(reportData) {
    let assetsData = [];
    if (reportData && reportData.length > 0) {
      assetsData = getFieldsReport(reportData);
    }

    this.setState({
      assetsData: assetsData,
    });
  }
  render() {
    return (
      <React.Fragment>
        <GI303Report assetsData={this.state.assetsData} selectedAsset={this.props.selectedAsset} />
        <p style={{ pageBreakBefore: "always" }} />
        <GI305Report assetsData={this.state.assetsData} selectedAsset={this.props.selectedAsset} />
      </React.Fragment>
    );
  }
}

export default BatteryTestReportsB12B24;
