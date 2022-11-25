import React from "react";
import { Col, Row } from "reactstrap";
import moment from "moment";
const tests = {
  FlashingLight: {
    condition: "A",
    comments: "Adjusted all front and back facing mast lights.Replaced 2 gate lights and 1 base light to mechcord.",
  },
  GateArms: { condition: "A", comments: "Realigned and level matched all gates. G3 needs a  new EGM. Gate is currewntly out of service." },
  WarningSystemOperation: { condition: "A", comments: "Refloated all batteries again" },
  Grounds: [
    { desc: "GB", test: "A", com: "Added water and adjusted float. Several cells are bad. New units on order" },
    { desc: "OB", test: "A", com: "Added water and adjusted float" },
    { desc: "XB", test: "A", com: "Added water and adjusted float" },
  ],
  StandByPower: { condition: "C", comments: "" },
  TrafficPreEmption: [{ desc: "", cond: "N", com: "" }],
  cutOutCircut: [{ desc: "", cond: "N", com: "" }],
  insulJtsBonds: { condition: "C", comments: "" },
  LampVoltages: { condition: "C", comments: "" },
  LightAlignment: { condition: "A", comments: "Adjusted all ights and replaced several gate lights." },
  HoldClearDevice: { condition: "C", comments: "" },
  WarningTimeTests: [
    {
      track: "Spur",
      dir: "N",
      asby: "Active",
      test: "C",
      ctype: "Predictor",
      method: "Measured",
      tpresc: "39",
      tobs: "39",
      tdate: "02/09/2021",
    },
    { rout: "CP NORTHWOOD #3.N", com: "Comments Comments" },
    {
      track: "Spur",
      dir: "N",
      asby: "Active",
      test: "C",
      ctype: "Predictor",
      method: "Measured",
      tpresc: "39",
      tobs: "39",
      tdate: "02/09/2021",
    },
    { rout: "CP NORTHWOOD #3.N", com: "Comments Comments" },
    {
      track: "Spur",
      dir: "N",
      asby: "Active",
      test: "C",
      ctype: "Predictor",
      method: "Measured",
      tpresc: "39",
      tobs: "39",
      tdate: "02/09/2021",
    },
    { rout: "CP NORTHWOOD #3.N", com: "Comments Comments" },
    {
      track: "Spur",
      dir: "N",
      asby: "Active",
      test: "C",
      ctype: "Predictor",
      method: "Measured",
      tpresc: "39",
      tobs: "39",
      tdate: "02/09/2021",
    },
    { rout: "CP NORTHWOOD #3.N", com: "Comments Comments" },
  ],
  flasherTestResults: { flash: "FR", condition: "C", comments: "", flashesPerMinute: "46" },
  TimingRelayDevice: [{ desc: "", dpt: "N", met: "" }],
};
class CrossingBody extends React.Component {
  state = {};
  render() {
    let displayData =
      this.props.tests &&
      this.props.tests.WarningTimeTests &&
      this.props.tests.WarningTimeTests.map((data, index) => {
        return (
          <React.Fragment>
            {" "}
            <tr>
              <td colSpan={4}>{data.track}</td>
              <td colSpan={3}>{data.dir}</td>
              <td colSpan={3}>{data.asby}</td>
              <td colSpan={1}>
                {" "}
                <span className="value-box">{data.test}</span>
              </td>
              <td colSpan={3}>{data.ctype}</td>
              <td colSpan={3}>{data.method}</td>
              <td colSpan={1}>{data.tpresc}</td>
              <td colSpan={1}>{data.tobs}</td>
              <td colSpan={2}>{data.tdate ? moment(data.tdate).format("MM-DD-YYYY") : ""}</td>
            </tr>
            <tr>
              <td colSpan={8}>
                <span style={{ display: "block", textAlign: "left", marginLeft: "10px" }}>
                  <strong>Route : </strong>
                  {data.rout}
                </span>
              </td>
              <td colSpan={13}>
                <span style={{ display: "block", textAlign: "left", marginLeft: "10px" }}>
                  <strong>Comments : </strong>
                  {data.com}
                </span>
              </td>
            </tr>
          </React.Fragment>
        );
      });

    let groundData =
      this.props.tests &&
      this.props.tests.Grounds &&
      this.props.tests.Grounds.map((ground, index) => {
        return (
          <React.Fragment>
            <Col md={6} className="border border-dark">
              {ground.desc}
            </Col>

            <Col md={6} className="border border-dark">
              {ground.test}
            </Col>

            <div className="comments-text info-section">{ground.com}</div>
          </React.Fragment>
        );
      });
    let TrafficPreEmption =
      this.props.tests &&
      this.props.tests.TrafficPreEmption &&
      this.props.tests.TrafficPreEmption.map((Traffic, index) => {
        return (
          <React.Fragment>
            <Col md={6} className="border border-dark">
              {Traffic.desc}
            </Col>

            <Col md={6} className="border border-dark">
              {Traffic.test}
            </Col>

            <div className="comments-text info-section">{Traffic.com}</div>
          </React.Fragment>
        );
      });
    let cutOutCircut =
      this.props.tests &&
      this.props.tests.CutOutCircut &&
      this.props.tests.CutOutCircut.map((cutOut, index) => {
        return (
          <React.Fragment>
            <Col md={6} className="border border-dark">
              {cutOut.desc}
            </Col>

            <Col md={6} className="border border-dark">
              {cutOut.test}
            </Col>

            <div className="comments-text info-section">{cutOut.com}</div>
          </React.Fragment>
        );
      });

    let TimingRelay =
      this.props.tests &&
      this.props.tests.TimingRelayDevice &&
      this.props.tests.TimingRelayDevice.map((time, index) => {
        return (
          <React.Fragment key={`r.f-${index}`}>
            <tbody>
              <tr>
                <td colSpan={2}>{time.desc}</td>
                <td colSpan={1}>
                  <div className="value-box">{time.test}</div>
                </td>
                <td colSpan={1}>{time.dpt}</td>

                <td colSpan={1}>{time.met}</td>
                <td colSpan={4}>{time.com}</td>
              </tr>
            </tbody>
          </React.Fragment>
        );
      });
    return (
      <React.Fragment>
        <Col md={12}>
          <Row>
            <Col md={7} className="border border-dark">
              <div className="section-title">Condition</div>

              <React.Fragment>
                <div className="label-text">Flashing Light Units (FRA 234.253) Monthly</div>
                <div className="value-box">
                  {this.props.tests && this.props.tests.FlashingLight && this.props.tests.FlashingLight.condition}
                </div>
                <div className="comments-text info-section">
                  {this.props.tests && this.props.tests.FlashingLight && this.props.tests.FlashingLight.comments}
                </div>
              </React.Fragment>

              <React.Fragment>
                <div className="label-text">Gate Arms & Mechanism (FRA 234.255(ab)) Monthly</div>
                <div className="value-box">{this.props.tests && this.props.tests.GateArms && this.props.tests.GateArms.condition}</div>
                <div className="comments-text info-section">
                  {this.props.tests && this.props.tests.GateArms && this.props.tests.GateArms.comments}
                </div>
              </React.Fragment>

              <React.Fragment>
                <div className="label-text">Warning System Operation (FRA 234.257(ab)) Monthly</div>
                <div className="value-box">
                  {this.props.tests && this.props.tests.WarningSystemOperation && this.props.tests.WarningSystemOperation.condition}
                </div>
                <div className="comments-text info-section">
                  {this.props.tests && this.props.tests.WarningSystemOperation && this.props.tests.WarningSystemOperation.comments}
                </div>
              </React.Fragment>
            </Col>
            <Col md={5} className="border border-dark">
              <React.Fragment>
                <div className="section-heading">Grounds (FRA 234.249) Monthly</div>
                <Row>
                  <Col md={6}>
                    <div className="box-title">Bus Nomenclature</div>
                  </Col>
                  <Col md={6}>
                    <div className="box-title">Condition</div>
                  </Col>

                  {groundData}
                  <hr />
                  <div className="label-text">Stand By Power (FRA 234.251) Monthly</div>
                  <div className="value-box">
                    {this.props.tests && this.props.tests.StandByPower && this.props.tests.StandByPower.condition}
                  </div>
                  <div className="comments-text info-section">
                    {this.props.tests && this.props.tests.StandByPower && this.props.tests.StandByPower.comments}
                  </div>
                  <hr />
                  <div className="section-heading">Traffic Pre-Emption (FRA 234.261) Monthly</div>

                  <Col md={6}>
                    <div className="box-title">Device Nomenclature</div>
                  </Col>
                  <Col md={6}>
                    <div className="box-title">Condition</div>
                  </Col>

                  {TrafficPreEmption}
                </Row>
              </React.Fragment>
            </Col>
            {/* Quarterly */}
            <Col md={7} className="border border-dark">
              <React.Fragment>
                <br />
                <div className="label-text">Insul. Jts., Bonds, & Trk. Conn. (FRA 234.271) Quarterly</div>
                <div className="value-box">
                  {this.props.tests && this.props.tests.InsulJtsBonds && this.props.tests.InsulJtsBonds.condition}
                </div>
                <div className="comments-text info-section">
                  {this.props.tests && this.props.tests.InsulJtsBonds && this.props.tests.InsulJtsBonds.comments}
                </div>
              </React.Fragment>
            </Col>
            <Col md={5} className="border border-dark">
              <React.Fragment>
                {" "}
                <div className="section-heading">Cut-Out Circuits (FRA 234.269) Quarterly</div>
                <Row>
                  <Col md={6}>
                    <div className="box-title">Circuit Nomenclature </div>
                  </Col>
                  <Col md={6}>
                    <div className="box-title">Condition</div>
                  </Col>{" "}
                  {cutOutCircut}
                </Row>
              </React.Fragment>
            </Col>
            {/* Quarterly */}
            {/*  Annual */}

            <Col md={12} className="border border-dark">
              <Row>
                <Col md={7}>
                  {this.props.tests && this.props.tests.LampVoltages && this.props.tests.LampVoltages.condition && (
                    <React.Fragment>
                      <br />
                      <div className="label-text">Lamp Voltages (FRA 234.253) Annual</div>
                      <div className="value-box">
                        {this.props.tests && this.props.tests.LampVoltages && this.props.tests.LampVoltages.condition}
                      </div>
                      <div className="comments-text info-section">
                        {this.props.tests && this.props.tests.LampVoltages && this.props.tests.LampVoltages.comments}
                      </div>
                    </React.Fragment>
                  )}
                  {this.props.tests && this.props.tests.LightAlignment && this.props.tests.LightAlignment.condition && (
                    <React.Fragment>
                      <br />
                      <div className="label-text">Light Alignment (FRA 234.253) Annual</div>
                      <div className="value-box">
                        {this.props.tests && this.props.tests.LightAlignment && this.props.tests.LightAlignment.condition}
                      </div>
                      <div className="comments-text info-section">
                        {this.props.tests && this.props.tests.LightAlignment && this.props.tests.LightAlignment.comments}
                      </div>
                    </React.Fragment>
                  )}
                  {this.props.tests && this.props.tests.HoldClearDevice && this.props.tests.HoldClearDevice.condition && (
                    <React.Fragment>
                      <br />
                      <div className="label-text">Hold Clear Device (FRA 234.255(c)) Annual</div>
                      <div className="value-box">
                        {this.props.tests && this.props.tests.HoldClearDevice && this.props.tests.HoldClearDevice.condition}
                      </div>
                      <div className="comments-text info-section">
                        {this.props.tests && this.props.tests.HoldClearDevice && this.props.tests.HoldClearDevice.comments}
                      </div>
                    </React.Fragment>
                  )}
                  <span className="spacer"></span>
                </Col>
              </Row>
            </Col>
            <Col md={12} className="border border-dark">
              {displayData && displayData.length > 0 && (
                <React.Fragment>
                  <br />
                  <div className="label-text">Warning Time Test Results (FRA 234.259) Annual</div>
                  <table className="table crossing-tests">
                    <thead>
                      <tr>
                        <th rowSpan={2} colSpan={4} style={{ borderBottom: "1px solid #000" }}>
                          Track#
                        </th>
                        <th rowSpan={2} colSpan={3} style={{ borderBottom: "1px solid #000" }}>
                          Direction
                        </th>
                        <th rowSpan={2} colSpan={3} style={{ borderBottom: "1px solid #000" }}>
                          Active / Standby
                        </th>
                        <th rowSpan={2} colSpan={1} style={{ borderBottom: "1px solid #000" }}></th>
                        <th rowSpan={2} colSpan={3} style={{ borderBottom: "1px solid #000" }}>
                          Control Type
                        </th>
                        <th rowSpan={2} colSpan={3} style={{ borderBottom: "1px solid #000" }}>
                          Timing Method
                        </th>
                        <th rowSpan={1} colSpan={2}>
                          Time (seconds)
                        </th>
                        <th rowSpan={2} colSpan={2} style={{ borderBottom: "1px solid #000" }}>
                          Test Date
                        </th>
                      </tr>
                      <tr>
                        <th rowSpan={1} colSpan={1} style={{ borderBottom: "1px solid #000" }}>
                          Presc.
                        </th>
                        <th rowSpan={1} colSpan={1} style={{ borderBottom: "1px solid #000" }}>
                          Obs.
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayData}
                      {addEmptyColsIfNotEnough(tests.WarningTimeTests, 8)}
                    </tbody>
                  </table>
                </React.Fragment>
              )}{" "}
            </Col>
            {this.props.tests && this.props.tests.FlasherTestResults && this.props.tests.FlasherTestResults.condition && (
              <React.Fragment>
                <Col md={7} style={{ borderLeft: "1px solid #000" }}>
                  <br />
                  <div className="label-text">Flasher Test Results (FRA 234.253) Annual</div>
                  <Col md={6}>
                    <div className="box-title" style={{ textAlign: "left" }}>
                      Flasher Nomenclature{" "}
                    </div>
                  </Col>

                  <Col md={6}></Col>
                  <div className="label-text">
                    {this.props.tests && this.props.tests.FlasherTestResults && this.props.tests.FlasherTestResults.flashNomen}
                  </div>
                  <div className="value-box">
                    {this.props.tests && this.props.tests.FlasherTestResults && this.props.tests.FlasherTestResults.condition}
                  </div>
                  <div className="comments-text info-section">
                    {this.props.tests && this.props.tests.FlasherTestResults && this.props.tests.FlasherTestResults.comments}
                  </div>
                </Col>

                <Col md={5} style={{ borderRight: "1px solid #000" }}>
                  <Col md={6}>
                    <br />
                    <br />
                    <div className="box-title">Flashes Per Minute</div>
                  </Col>
                  <Col md={6}></Col>
                  <Col md={6} className="border border-dark">
                    {this.props.tests && this.props.tests.FlasherTestResults && this.props.tests.FlasherTestResults.flashesPerMinute}
                  </Col>

                  <Col md={6}></Col>
                  <br />
                </Col>
              </React.Fragment>
            )}
            <hr style={{ marginTop: "0", marginBottom: "0" }} />

            <Col md={7} style={{ borderLeft: "1px solid #000" }}>
              <br />
              <div className="label-text">Timing Relay & Devices Test Results (FRA 234.265) Annual</div>

              <Col md={6}></Col>
            </Col>
            <Col md={5} style={{ borderRight: "1px solid #000" }}>
              <br />
              <br />
            </Col>
            <Col md={12} style={{ borderRight: "1px solid #000", borderLeft: "1px solid #000", borderBottom: "1px solid #000" }}>
              <table className="table TimingRelay">
                <tbody>
                  <tr>
                    <th colSpan={2}>
                      <div>Timer Nomenclature</div>
                    </th>
                    <th colSpan={1}>
                      <div>Condition</div>
                    </th>
                    <th colSpan={1}>
                      <div>Design / Plan Time</div>
                    </th>

                    <th colSpan={1}>
                      <div>Measured Time</div>
                    </th>
                    <th colSpan={4}>
                      <div>Comments</div>
                    </th>
                  </tr>
                </tbody>
                {TimingRelay}
              </table>
              {!TimingRelay && <div className="section-heading">No Data Entered or Test Not Applicable</div>}
            </Col>
          </Row>
        </Col>
      </React.Fragment>
    );
  }
}

export default CrossingBody;

function addEmptyColsIfNotEnough(mapArray, minRows) {
  let emptyRows = null;
  let grpRows = [];
  let countToAdd = minRows - mapArray.length;
  let typeToAdd = ["one", "two"];
  if (countToAdd > 0) {
    emptyRows = [];
    let count = 0;
    for (let i = 0; i < countToAdd; i++) {
      let row = <tr>{getCols(typeToAdd[count])}</tr>;
      emptyRows.push(row);
      if (count < 1) {
        count++;
      } else {
        count = 0;
      }
    }
  }
  return emptyRows;
}
function getCols(type) {
  let cols = [];
  let span = [];
  if (type == "one") span = [4, 3, 3, 1, 3, 3, 1, 1, 2];
  else span = [8, 13];
  for (let i = 0; i < span.length; i++) {
    cols.push(<td colSpan={span[i]}></td>);
  }
  return cols;
}
