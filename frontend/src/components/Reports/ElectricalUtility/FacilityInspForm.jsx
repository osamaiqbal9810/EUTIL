import React, { Component } from "react";
import { Container, Col, Row, Label, Button, FormGroup } from "reactstrap";
import { themeService } from "../../../theme/service/activeTheme.service";
import "./style.css";
import { languageService } from "Language/language.service";
import _ from "lodash";
import { iconToShow, iconTwoShow } from "../variables";
import Icon from "react-icons-kit";
import moment from 'moment';
import { checkmark } from "react-icons-kit/icomoon/checkmark";
class FacilityInspForm extends Component {
  constructor(props) {
    super(props);
    this.state = { assetsRows: [],inspectorName:"",inspectionDate:"" };
    this.content = {
      headers: {},
    };
  }
  componentDidMount() {
    this.calculateData(this.props.inspection);
  }

  calculateData(inspection) {
    let assetsRows = [];
    let inspectorName="";
    let inspectionDate="";
    if (inspection) {
      inspectorName = inspection && inspection.user.name;
      inspectionDate = inspection && inspection.date;
      let task = inspection && inspection.tasks && inspection.tasks[0];
      let units = task && task.units;
      if (units) {
        let lineUnit = units[0] && units[0].unitId ? units[0].unitId : "N/A";

        units.forEach((unit, index) => {
          if (index > 0) {
            let appForm = {
              lineUnit: lineUnit,
              PoleDevice: unit.unitId,
            };
            let elecForm = _.find(unit.appForms, { id: "elecInspec" });
            if (elecForm && elecForm.form && elecForm.form.length > 0) {
              elecForm.form.forEach((field) => {
                if (field) {
                  appForm[field.id] = field.value;
                }
              });
            }
            assetsRows.push(appForm);
          }
        });
      }
    }
    this.setState({ assetsRows,inspectorName,inspectionDate });
  }
  render() {
    let assetsRows = this.state.assetsRows.map((assetRow) => {
      let row = (
        <tr>
          <td colSpan="2"> {assetRow.lineUnit} </td>
          <td colSpan="2"> {assetRow.PoleDevice}</td>
          <td>
            {" "}
            <FieldItem value={assetRow.pole} />{" "}
          </td>
          <td>
            <FieldItem value={assetRow.guy} />
          </td>
          <td>
            <FieldItem value={assetRow.guard} />
          </td>
          <td>
            <FieldItem value={assetRow.ground} />
          </td>
          <td>
            <FieldItem value={assetRow.gnd} />
          </td>
          <td>
            <FieldItem value={assetRow.riser} />
          </td>
          <td>
            <FieldItem value={assetRow.conductor} />
          </td>
          <td>
            <FieldItem value={assetRow.neut} />
          </td>
          <td>
            <FieldItem value={assetRow.trans} />
          </td>
          <td>
            <FieldItem value={assetRow.goab} />
          </td>
          <td>
            <FieldItem value={assetRow.cut} />
          </td>
          <td>
            <FieldItem value={assetRow.insu} />
          </td>
          <td>
            <FieldItem value={assetRow.cross} />
          </td>
          <td>
            <FieldItem value={assetRow.brac} />
          </td>
          <td>
            <FieldItem value={assetRow.vege} />
          </td>
          <td>
            <FieldItem value={assetRow.other} />
          </td>
          <td colSpan="2">{assetRow.stray == "Yes" ? "Yes" : ""}</td>
          <td colSpan="2">{assetRow.stray == "No" ? "No" : ""}</td>
          <td colSpan="6">{assetRow.com}</td>
        </tr>
      );
      return row;
    });
    return (
      <React.Fragment>
        <div className="table-report electric-utility facility-insp-form">
          <Row>
            <Col md={12}>
              <Row>
                 <Col md={2}> <img style={{    width: "100px",
    maxHeight: "100px",
    marginLeft: "50px"}} src={themeService(iconToShow)} alt="Logo" /> </Col> 
                <Col md={8}><h2 style={{
                              textAlign: "center",fontWeight:"900",marginBottom:"30px"}}>Inspection of Utility Facilities</h2></Col>
                { <Col md={2} style={{ textAlign: "right" }}>
                    {/* <img src={themeService(iconTwoShow)} alt="Logo" style={themeService(trackReportStyle.logoStyle)} /> */}
                </Col> }
              </Row>
              <Row>
                <Col md={12}>
                  <table>
                    <thead style={{ borderTop: "none", borderRight: "none", borderLeft: "none" }}>
                      <tr>
                        <td colspan="30" style={{ borderRight: "none" }}>
                          <div style={{ textAlign: "right", marginBottom: "5px" }}>Inspector<span style={{borderBottom: "1px solid #000",
    minwidth: "200px",
    display: "inline-block",
    padding: "0 30px",
    textAlign: "left"}}>{this.state.inspectorName}</span> Date<span style={{borderBottom: "1px solid #000",
    minwidth: "200px",
    display: "inline-block",
    padding: "0 30px",
    textAlign: "left"}}>{moment(this.state.inspectionDate).format('MM/DD/YYYY')}</span></div>
                          <h5
                            style={{
                              textAlign: "center",
                              borderRight: "1px solid #ccc",
                              borderLeft: "1px solid #ccc",
                              borderBottom: "2px solid #000",
                              padding: "5px 0 20px",
                              marginBottom: "0",
                            }}
                          >
                            {languageService("If a deficiency is found, indicate with Priority Level under that category and comment.")}
                          </h5>
                        </td>
                      </tr>
                      <tr>
                        <th colSpan="2" rowSpan="2">
                          Line
                        </th>
                        <th colSpan="2" rowSpan="2" className="no-borders">
                          Pole / Device
                        </th>
                        <th colSpan="1" rowSpan="2" className="no-borders">
                          <span className="tilted-title border-top">Pole</span>
                        </th>
                        <th colSpan="1" rowSpan="2" className="no-borders">
                          <span className="tilted-title">Guy</span>
                        </th>
                        <th colSpan="1" rowSpan="2" className="no-borders">
                          <span className="tilted-title">Guy Guard</span>
                        </th>
                        <th colSpan="1" rowSpan="2" className="no-borders">
                          <span className="tilted-title">Ground</span>
                        </th>
                        <th colSpan="1" rowSpan="2" className="no-borders">
                          <span className="tilted-title">Gnd. Mould</span>
                        </th>
                        <th colSpan="1" rowSpan="2" className="no-borders">
                          <span className="tilted-title">Riser</span>
                        </th>
                        <th colSpan="1" rowSpan="2" className="no-borders">
                          <span className="tilted-title">Conductor(s)</span>
                        </th>
                        <th colSpan="1" rowSpan="2" className="no-borders">
                          <span className="tilted-title">Neutral</span>
                        </th>
                        <th colSpan="1" rowSpan="2" className="no-borders">
                          <span className="tilted-title">Transformer</span>
                        </th>
                        <th colSpan="1" rowSpan="2" className="no-borders">
                          <span className="tilted-title">Switch/GOAB</span>
                        </th>
                        <th colSpan="1" rowSpan="2" className="no-borders">
                          <span className="tilted-title">Cutout(s)</span>
                        </th>
                        <th colSpan="1" rowSpan="2" className="no-borders">
                          <span className="tilted-title">Insulators</span>
                        </th>
                        <th colSpan="1" rowSpan="2" className="no-borders">
                          <span className="tilted-title">Cross Arm</span>
                        </th>
                        <th colSpan="1" rowSpan="2" className="no-borders">
                          <span className="tilted-title">Bracket</span>
                        </th>
                        <th colSpan="1" rowSpan="2" className="no-borders">
                          <span className="tilted-title">Vegetation</span>
                        </th>
                        <th colSpan="1" rowSpan="2" className="no-borders">
                          <span className="tilted-title">Other</span>
                        </th>
                        <th colSpan="4" rowSpan="1" className="no-borders border-bottom-none">
                          <span className="misplaced-title" style={{textAlign:"right"}}>Stray Voltage?</span>
                        </th>
                        <th colSpan="6" rowSpan="2">
                          <span className="tilted-title">Comment</span>
                        </th>
                      </tr>
                      <tr>
                        <th colSpan="2" rowSpan="1" className="no-borders">
                          <span className="misplaced-title">Yes</span>
                        </th>
                        <th colSpan="2" rowSpan="1" className="no-borders">
                          <span className="misplaced-title">No</span>
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {assetsRows}
                      {addEmptyColsIfNotEnough(assetsRows, 10, 21)}
                    </tbody>
                  </table>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}

export default FacilityInspForm;

function addEmptyColsIfNotEnough(mapArray, minRows, cols) {
  let emptyRows = null;
  let countToAdd = minRows - mapArray.length;
  if (countToAdd > 0) {
    emptyRows = [];
    for (let i = 0; i < countToAdd; i++) {
      let row = <tr key={i + "emptyRow"}>{getCols(cols)}</tr>;
      emptyRows.push(row);
    }
  }
  return emptyRows;
}

function getCols(num) {
  let cols = [];
  for (let i = 1; i <= num; i++) {
    cols.push(<td colSpan={getColSpan(i, num)} key={i + "emptyCol"}></td>);
  }
  return cols;
}

function getColSpan(num, length) {
  if (num == 21) return "6";
  if (num == 20 || num == 19 || num == 1 || num == 2) return "2";

  return "1";
}

const FieldItem = (props) => {
  let toReturn = null;
  if (props.value == true || props.value == "true") {
    toReturn = <Icon icon={checkmark} size={20} />;
  }
  return toReturn;
};
