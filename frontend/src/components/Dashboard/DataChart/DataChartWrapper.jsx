/* eslint eqeqeq: 0 */
import React, { Component } from "react";
import { Col, Row } from "reactstrap";
import { languageService } from "Language/language.service";
import DataChart from "./DataChart";
import { fieldTemplate, getTotalObj } from "../Helperfunctions/summaryTemplates";
import { themeService } from "../../../theme/service/activeTheme.service";
import { chartComponentStyle } from "../styles/chartComponentsStyle";

class DataChartWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: { labels: [""], datasets: [] },
    };
    this.handleBarItemClick = this.handleBarItemClick.bind(this);
    this.activeTheme = localStorage.getItem("theme") ? localStorage.getItem("theme") : "default";
  }
  componentDidMount() {
    //  console.log("overAllData", this.props.overAllData);
    this.calculateChartData();
  }

  handleBarItemClick(barItem) {
    // debugger;
    if (barItem) {
      let template = fieldTemplate(this.props.chartField, this.activeTheme);
      let tempKeys = Object.keys(template);
      let found = false;
      for (let key of tempKeys) {
        if (languageService(template[key].label) == barItem._model.datasetLabel) {
          this.props.barItemFilterList && this.props.barItemFilterList(template[key], this.props.chartField);
          found = true;
          break;
        }
      }
      !found && this.props.barItemFilterList && this.props.barItemFilterList({ label: "total" }, this.props.chartField);
    }
  }

  calculateChartData() {
    let template = fieldTemplate(this.props.chartField, this.activeTheme);

    let total = getTotalObj(this.activeTheme);
    total.data = [this.props.overAllData["total"]];
    //  console.log("cdmTemplate", template);
    let chartData = { labels: [this.props.tableLabel], datasets: [total] };
    let temp_keys = Object.keys(template);

    temp_keys.forEach(fieldKey => {
      chartData.datasets.push({
        label: languageService(template[fieldKey].label),
        backgroundColor: template[fieldKey].bgColor,
        data: [this.props.overAllData[fieldKey]],
      });
    });
    console.log(chartData);
    this.setState({
      chartData: chartData,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.overAllData !== prevProps.overAllData) {
      this.calculateChartData();
    }
  }
  render() {
    // let chartData = {
    //   labels: ["Issues"],
    //   datasets: [
    //     {
    //       label: "Total",
    //       backgroundColor: "#698ca8",
    //       data: [12],
    //     },
    //     {
    //       label: "High",
    //       backgroundColor: "#198ca8",
    //       data: [4],
    //     },
    //     {
    //       label: "Medium",
    //       backgroundColor: "#af1ca8",
    //       data: [2],
    //     },
    //     {
    //       label: "Low",
    //       backgroundColor: "#1f10a1",
    //       data: [2],
    //     },
    //   ],
    // };

    return (
      <Col md="12">
        {this.props.showHeading && (
          <Row style={themeService(chartComponentStyle.tableHeadings)}>{languageService(this.props.tableLabel)}</Row>
        )}
        <Row style={themeService(chartComponentStyle.barChartContainer)}>
          <DataChart chartData={this.state.chartData} handleBarItemClick={this.handleBarItemClick} />
        </Row>
      </Col>
    );
  }
}

export default DataChartWrapper;
