/* eslint eqeqeq: 0 */
import React, { Component } from "react";
import { Bar } from "react-chartjs-2";
class DataChart extends Component {
  render() {
    return (
      <React.Fragment>
        <Bar
          ref={reference => (this.chartReference = reference)}
          data={this.props.chartData}
          options={{
            legend: {
              position: "bottom",

              labels: {
                boxWidth: 5,
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
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                  },
                },
              ],
            },
            maintainAspectRatio: false,
          }}
          getElementAtEvent={elem => {
            console.log(elem);
            this.props.handleBarItemClick(elem[0]);
          }}
        />
      </React.Fragment>
    );
  }
}

export default DataChart;
