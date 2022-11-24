/* eslint eqeqeq: 0 */
import React, { Component } from "react";
import { Bar } from "react-chartjs-2";
import { Row, Col } from "reactstrap";
import { languageService } from "../../Language/language.service";
import _ from "lodash";

import { fieldTemplate } from "./Helperfunctions/summaryTemplates";
import { themeService } from "../../theme/service/activeTheme.service";
import { commonStylesDashboard } from "./styles/commonStylesDashboard";
import { chartComponentStyle } from "./styles/chartComponentsStyle";

class LinesDataStackedBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: {},
    };
    this.activeTheme = localStorage.getItem("theme") ? localStorage.getItem("theme") : "default";
  }
  calculateChartData() {
    let overAllData = this.props.overAllData;
    let lineNames = Object.keys(overAllData);
    let combinedSummaries = {};

    if (lineNames.length > 0) {
      lineNames.forEach(line_name => {
        let summary = overAllData[line_name][this.props.chartField].summary;
        this.getSummariesAndFillThem(summary, combinedSummaries);
      });
      //console.log(combinedSummaries);

      let datasets = this.getDatasets(combinedSummaries, lineNames);

      let abbrevatedLineNames = [];
      lineNames.forEach(line => {
        abbrevatedLineNames.push(abbrivateName(line));
      });
      let template = fieldTemplate(this.props.chartField, this.activeTheme);
      if (template) {
        datasets.forEach(dat => {
          if (!template[dat.label]) {
            console.log(dat, " doesnt exist in template");
          } else {
            dat.backgroundColor = template[dat.label].bgColor;
            dat.label = languageService(template[dat.label].label);
          }
        });
      }
      let labelsLength = abbrevatedLineNames.length;
      if (labelsLength < 8) {
        for (let toPush = 0; toPush < 8 - labelsLength; toPush++) {
          abbrevatedLineNames.push("");
        }
      }
      let chartData = {
        labels: abbrevatedLineNames,
        datasets: datasets,
      };

      //console.log(chartData);
      this.setState({
        chartData: chartData,
      });
    }
  }

  getSummariesAndFillThem(summary, combinedSummaries) {
    let summaryNames = Object.keys(summary);
    summaryNames.forEach(summ_Name => {
      if (summ_Name !== 'marked')
        combinedSummaries[summ_Name] = combinedSummaries[summ_Name] ? combinedSummaries[summ_Name] + summary[summ_Name] : summary[summ_Name];
    });
  }

  getDatasets(combinedSummaries, lineNames) {
    let datasets = [];

    let summNames = Object.keys(combinedSummaries);
    summNames.forEach(summ_Name => {
      let datasetObj = {
        stack: "stack1",
        label: summ_Name,
        backgroundColor: randomColor(),
        data: [],
      };
      datasets.push(datasetObj);
    });

    lineNames.forEach(line => {
      summNames.forEach((summ_Name, index) => {
        datasets[index].data.push(this.props.overAllData[line][this.props.chartField].summary[summ_Name]);
      });
    });
    _.remove(datasets, { label: "total" });
    return datasets;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.overAllData !== this.props.overAllData) {
      this.calculateChartData();
    }
  }
  componentDidMount() {
    if (this.props.overAllData) {
      this.calculateChartData();
    }
  }
  render() {
    // let chartData = {
    //   labels: ["ABC", "BCD"],
    //   datasets: [
    //     {
    //       stack: "stack1",
    //       label: "Last 7 Days",
    //       backgroundColor: "#698ca8",

    //       data: [6, 0, 0, 0],
    //     },
    //     {
    //       stack: "stack1",
    //       label: "Last 4 Days",
    //       backgroundColor: "#a98ca8",

    //       data: [1, 0, 0, 0],
    //     },
    //   ],
    // };

    return (
      <Col md="12">
        {this.props.showHeading && (
          <Row style={themeService(commonStylesDashboard.tableHeadings)}>
            {languageService(this.props.label ? this.props.label : "Overview")}
          </Row>
        )}
        <Row style={themeService(chartComponentStyle.barChartContainer)}>
          <Bar
            data={this.state.chartData}
            options={{
              legend: {
                position: "bottom",

                labels: {
                  boxWidth: 10,
                  fontSize: 10,
                },
                layout: {
                  padding: {
                    left: 15,
                    right: 15,
                    top: 15,
                    bottom: 15,
                  },
                },
              },
              scales: {
                xAxes: [{ stacked: true }],
                yAxes: [{ stacked: true }],
              },
              maintainAspectRatio: false,
            }}
          />
        </Row>
      </Col>
    );
  }
}

export default LinesDataStackedBar;

function randomColor() {
  let color =
    "rgb(" + Math.round(Math.random() * 255) + "," + Math.round(Math.random() * 255) + "," + Math.round(Math.random() * 255) + ")";

  return color;
}

function abbrivateName(name) {
  let str = name.split(" ");
  let word = "";
  if (str.length > 1) {
    str.forEach(el => {
      word = word + el.charAt(0);
    });
    //console.log(word);
  } else {
    word = name;
  }
  return word;
}
