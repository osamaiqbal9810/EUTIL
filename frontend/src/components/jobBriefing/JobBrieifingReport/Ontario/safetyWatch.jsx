import React, { Component } from "react";
import { trackReportStyle } from "../../../Reports/Timps/style/index";
import "../../../Reports/Timps/style/style.css";
import { Container, Col, Row, Label, Button, FormGroup } from "reactstrap";
import { themeService } from "../../../../theme/service/activeTheme.service";
import { iconToShow, iconTwoShow } from "../../../Reports/variables";
import _ from "lodash";
import { dataFormatters } from "../../../../utils/dataFormatters";
import { tick_char } from "../special-char";
import moment from "moment";
class SafetyWatchONR extends Component {
  constructor(props) {
    super(props);
    this.config = {
      minRows: 5,
    };

    this.state = {
      data: props.data ? props.data : {},
    };
  }

  render() {
    let { data } = this.state;

    return (
      <React.Fragment>
        <div
          className="table-report job-briefing-ontario safety-watch"
          style={{ ...themeService(trackReportStyle.mainStyle), pageBreakAfter: "always" }}
        >
          <table className="table-bordered safety-watch">
            <thead>
              <tr>
                <td colSpan={30} className="dark-bg">
                  <span className="main-heading-in-rpt">
                    SAFETY WATCH <small>(to be completed when applicable)</small>
                  </span>
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={1}>1</td>
                <td colSpan={7}>The date of the work</td>
                <td colSpan={11}><strong>Date: </strong> {data.date ? moment(data.date).format("MM-DD-YYYY") : ""}</td>
                <td colSpan={11}><strong>Time:</strong>   {data.date ? moment(data.date).format("HH:MM") : ""}</td>
              </tr>
              <tr>
                <td colSpan={1}>2</td>
                <td colSpan={7}>Location</td>
                <td colSpan={11}><div className="text-left pd-left-10px"><strong>Track(s) Between / At: </strong>{data.betat}</div></td>
                <td colSpan={11}><div className="text-left pd-left-10px"><strong>And: </strong>{data.and}</div></td>
              </tr>
              <tr>
                <td colSpan={1}>3</td>
                <td colSpan={12}>Who is the designated Safety Watch?</td>
                <td colSpan={17}><div className="text-left pd-left-10px">{data.dsw}</div></td>
              </tr>
              <tr>
                <td colSpan={1}>4</td>
                <td colSpan={12}>Where will the Safety Watch will be positioned?</td>
                <td colSpan={17}><div className="text-left pd-left-10px">{data.wwswp}</div></td>
              </tr>
              <tr>
                <td colSpan={1}>5</td>
                <td colSpan={12}>What work is being performed?</td>
                <td colSpan={17}><div className="text-left pd-left-10px">{data.wwbp}</div></td>
              </tr>
              <tr>
                <td colSpan={1}>6</td>
                <td colSpan={12}>If additional clearing time is required – how many seconds?</td>
                <td colSpan={17}> <div className="text-left pd-left-10px">{data.actors}</div></td>
              </tr>
              <tr>
                <td colSpan={1}>7</td>
                <td colSpan={12}>The maximum train speed on that track?</td>
                <td colSpan={8}>
                  <div className="text-left pd-left-10px"><strong>Speed: </strong>{data.speed}</div>
                </td>
                <td colSpan={9}>
                  <div className="text-left pd-left-10px"><strong>Sightline Required: </strong>{data.sight}</div>
                </td>
              </tr>
              <tr>
                <td colSpan={1}>8</td>
                <td colSpan={12}>The sightline distance at the worksite</td>
                <td colSpan={17}>{data.wsight}</td>
              </tr>
              <tr>
                <td colSpan={1}>9</td>
                <td colSpan={9}>
                  How was the sightline determined? <br />
                  {/* <small>(Circle all that apply)</small>{" "} */}
                </td>
                <td colSpan={4} style={data.pline ? { fontWeight: 600 } : {}}><span className={data.pline ? "selection-char active" : "selection-char"}>{tick_char}</span>Pole Line   </td>
                <td colSpan={4} style={data.sigma ? { fontWeight: 600 } : {}}><span className={data.sigma ? "selection-char active" : "selection-char"}>{tick_char}</span>Signals </td>
                <td colSpan={4} style={data.mboard ? { fontWeight: 600 } : {}}><span className={data.mboard ? "selection-char active" : "selection-char"}>{tick_char}</span>Mile Boards  </td>
                <td colSpan={4} style={data.measu ? { fontWeight: 600 } : {}}><span className={data.measu ? "selection-char active" : "selection-char"}>{tick_char}</span>Measured </td>
                <td colSpan={4} style={data.range ? { fontWeight: 600 } : {}}><span className={data.range ? "selection-char active" : "selection-char"}>{tick_char}</span>Range Finder </td>
              </tr>
              <tr>
                <td colSpan={1}>10</td>
                <td colSpan={12}>Where the workers will clear on the approach of rail traffic</td>
                <td colSpan={17}><div className="text-left pd-left-10px">{data.wwcart}</div></td>
              </tr>
              <tr>
                <td colSpan={1}>11</td>
                <td colSpan={12}>How the warning will be given</td>
                <td colSpan={17}><div className="text-left pd-left-10px">{data.hwag}</div></td>
              </tr>
              <tr>
                <td colSpan={1}>12</td>
                <td colSpan={12}>Where tools are to be placed when clearing</td>
                <td colSpan={17}><div className="text-left pd-left-10px">{data.wtpwc}</div></td>
              </tr>
              <tr>
                <td colSpan={1}>13</td>
                <td colSpan={12}>Who will clear the tools</td>
                <td colSpan={17}><div className="text-left pd-left-10px">{data.wwct}</div></td>
              </tr>
              <tr>
                <td colSpan={1}>14</td>
                <td colSpan={12}>Other risks at the jobsite</td>
                <td colSpan={17}><div className="text-left pd-left-10px">{data.oraj}</div></td>
              </tr>
              <tr>
                <td colSpan={1} style={{ verticalAlign: 'initial' }}>15</td>
                <td colSpan={29}>
                  Signature of crew <p style={{ minHeight: "80px" }}></p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </React.Fragment>
    );
  }
}
export default SafetyWatchONR;

function getCols(type) {
  let cols = [];
  let span = [];
  if (type == 2) span = [4, 5, 2, 2, 2, 2, 2, 2];
  else span = [2, 5, 1, 2, 5, 5];
  for (let i = 0; i < span.length; i++) {
    cols.push(<td colSpan={span[i]}></td>);
  }
  return cols;
}
