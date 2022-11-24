import React, { Component } from "react";
import { Card, CardBody, CardTitle } from "reactstrap";
import { Bar } from "react-chartjs-2";
import moment from "moment";

class ChartCard extends Component {
  getLabelsAndDataSets(timeAgoData) {
    let chartData = {
      labels: [],
      datasets: [
        {
          label: "Last 7 Days",
          backgroundColor: "#698ca8",
          borderColor: "#37668b",
          borderWidth: 1,
          hoverBackgroundColor: "#37668b",
          hoverBorderColor: "#698ca8",
          data: [],
        },
      ],
    };
    //	console.log(timeAgoData);
    if (timeAgoData.length > 0) {
      timeAgoData.forEach(timeSlot => {
        let hoursTime = moment.duration(timeSlot.time).asHours();
        //		console.log(hoursTime);
        let stringLabel = String(hoursTime).substring(0, 2);
        //		console.log(stringLabel);
        let tagDay = moment(timeSlot.tag).format("dddd");
        if (chartData.labels.length < 7)
          if (tagDay == "Saturday" || tagDay == "Sunday") {
            if (hoursTime > 0) {
              chartData.labels.push(timeSlot.tag);
              chartData.datasets[0].data.push(stringLabel);
            }
          } else {
            chartData.labels.push(moment(timeSlot.tag).format("dddd"));
            chartData.datasets[0].data.push(stringLabel);
          }
      });
    }
    return chartData;
  }

  render() {
    let dataObject = this.getLabelsAndDataSets(this.props.timeAgoData);
    let options = {
      scales: {
        xAxes: [
          {
            beginAtZero: true,
            ticks: {
              autoSkip: false,
            },
          },
        ],
      },
    };
    return (
      <Card>
        <CardBody>
          <CardTitle>Time Tracker Chart</CardTitle>
        </CardBody>
        <Bar data={dataObject} options={options} />
        <CardBody />
      </Card>
    );
  }
}

export default ChartCard;
