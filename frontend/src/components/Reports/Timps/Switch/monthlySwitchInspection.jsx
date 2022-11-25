import React from "react";
import { switchReportStyle } from "./style/index";
import { themeService } from "../../../../theme/service/activeTheme.service";
import { getLanguageLocal, languageService } from "Language/language.service";
import { Container, Col, Row, Label, Button, FormGroup } from "reactstrap";
import { Rect } from "react-konva";
import _ from "lodash";
// import { CRUDFunction } from "reduxCURD/container";
// import { curdActions } from "reduxCURD/actions";
// import { getWeather } from "../Timps";
import moment from "moment";
import "./style/style.css";
import { iconToShow, iconTwoShow } from "../../variables";
import { switchImage } from "./variable";
import { SignatureImage } from "../../utils/SignatureImage";
class MonthlySwitchInspection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inspectionData: {
        lineName: "",
        user: "",
        date: "",
        weather: "",
      },
      reportData: {},
      staticMode: false,
    };
    this.config = {
      minSwitchRows: 6,
    };
  }
  componentDidMount() {
    this.props.reportData && this.calculateData(this.props.reportData, this.props.inspectionData);
  }
  calculateData(data, inspectionData) {
    // TO MAP DATA HERE

    let reportData = {};
    for (let i = 0; i < data.form.form.length; i++) {
      if (data.form && data.form.form[i]) {
        reportData[data.form.form[i].id] = data.form.form[i].value;
      }
    }
    this.reportData = _.cloneDeep(reportData);
    console.log(reportData, data);
    this.setState({
      inspectionData,
    });
  }

  render() {
    return (
      <React.Fragment>
        <style
          type="text/css"
          dangerouslySetInnerHTML={{
            __html:
              "@media print { .monthly-switch-heading,.monthly-switch-date {font-size: 20px !important} .monthly-switch-heading div span{width:350px !important} .monthly-switch-date div span{width:200px !important} }",
          }}
          //@page{size: auto; margin: 0mm;}
          //@page{size: A3 landscape; margin: 0mm;}
        />
        <div
          id="mainContent"
          className="table-report monthly-switch"
          style={{ ...themeService(switchReportStyle.mainStyle), pageBreakAfter: "always" }}
        >
          <Row>
            <Col md={2}>
              <img src={themeService(iconToShow)} alt="Logo" style={{ width: "100%" }} />
            </Col>
            <Col md={8}>
              <h2 style={{ ...themeService(switchReportStyle.headingStyle), transform: "translateX(-21px)", color: "#0070c0" }}>
                <div>{languageService("CHEMIN DE FER QNS&L")}</div>
                <div>{languageService("INSPECTION MENSUELLE DES AIGUILLAGES")}</div>
              </h2>
            </Col>
            <Col md={2}>
              <img
                src={themeService(iconTwoShow)}
                alt="Logo"
                style={{ display: "inline-block", padding: "0px 5px 5px", maxWidth: "100%", width: "120px" }}
              />
            </Col>
          </Row>
          <Row>
            <Col md={2}></Col>
            <Col md={6}>
              <h2
                style={{
                  ...themeService(switchReportStyle.headingStyle),
                  transform: "translateX(-21px)",
                  color: "#0070c0",
                  textAlign: "right",
                }}
                className="monthly-switch-heading"
              >
                <div>
                  {languageService("ENDROIT:")}
                  <span
                    style={{ color: "#000", width: "400px", display: "inline-block", borderBottom: "2px solid #000", textAlign: "center" }}
                  >
                    {this.reportData && this.reportData.endroit}
                    {this.reportData && this.reportData.aendroit}
                  </span>
                </div>
                <div style={{ color: "#0070c0" }}>
                  {languageService("INSPECTEUR:")}
                  <span
                    style={{ color: "#000", width: "400px", display: "inline-block", borderBottom: "2px solid #000", textAlign: "center" }}
                  >
                    {this.state.inspectionData.user}
                  </span>
                </div>
              </h2>
            </Col>
            <Col md={1}></Col>
            <Col md={3}>
              <h2
                style={{ ...themeService(switchReportStyle.headingStyle), transform: "translateX(-21px)", color: "#0070c0" }}
                className="monthly-switch-date"
              >
                <div>
                  {languageService("DATE:")}
                  <span
                    style={{ color: "#000", width: "250px", display: "inline-block", borderBottom: "2px solid #000", textAlign: "center" }}
                  >
                    {this.props.inspectionData && moment(this.props.inspectionData.date).format("MM/DD/YYYY")}
                  </span>
                </div>
              </h2>
            </Col>
          </Row>
          <span className="spacer"></span>
          <Row>
            <Col md={12}>
              <table className="table-bordered monthly-switch-Report" style={{ marginBottom: "0" }}>
                <thead>
                  <tr className="main-heading">
                    <th className="span" colSpan="4" style={{ width: "40px" }}>
                      <span>{languageService("VÉRIFICATIONS")}</span>
                    </th>
                    <th className="span" colSpan="2" style={{ width: "20px" }}>
                      <span>&nbsp;</span>
                    </th>
                    <th className="span" colSpan="3" style={{ width: "30px" }}>
                      <span>{languageService("TOLÉRANCES")} </span>
                    </th>
                    <th className="span" colSpan="2" style={{ width: "20px" }}>
                      <span>{languageService("MESURES")} </span>
                    </th>
                    <th className="span" colSpan="5" style={{ width: "50px" }}>
                      <span>{languageService("REMARQUES ") + this.state.inspectionData.weather}</span>
                    </th>
                  </tr>
                  <tr className="main-heading">
                    <th colSpan="4" style={{ width: "40px", borderBottom: "transparent" }}></th>
                    <th colSpan="2" style={{ width: "20px", borderBottom: "transparent" }}></th>
                    <th colSpan="3" style={{ width: "30px", borderBottom: "transparent" }}></th>
                    <th className="span" colSpan="1" style={{ width: "10px" }}>
                      <span>{languageService("VP")}</span>
                    </th>
                    <th className="span" colSpan="1" style={{ width: "10px" }}>
                      <span>{languageService("VE")}</span>
                    </th>
                    <th colSpan="5" style={{ width: "50px", borderBottom: "transparent" }}></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="4" rowSpan="3" style={{ width: "40px" }}>
                      COURSE DES AIGUILLES LINÉARITÉ DE LA POINTE
                    </td>
                    <td colSpan="2" style={{ width: "20px" }}>
                      1ÈRE ROD
                    </td>
                    <td colSpan="3" style={{ width: "30px" }}>
                      4 3/4" (±1/16")
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.vp1}
                      {this.reportData && this.reportData.avp1}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.ve1}
                      {this.reportData && this.reportData.ave1}
                    </td>
                    <td colSpan="5" style={{ width: "50px" }}>
                      {this.reportData && this.reportData.remarks1}
                      {this.reportData && this.reportData.aremarks1}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2" style={{ width: "20px" }}>
                      2IÈME ROD
                    </td>
                    <td colSpan="3" style={{ width: "30px" }}>
                      3 15/16" (±1/16")
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.vp2}
                      {this.reportData && this.reportData.avp2}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.ve2}
                      {this.reportData && this.reportData.ave2}
                    </td>
                    <td colSpan="5" style={{ width: "50px" }}>
                      {this.reportData && this.reportData.remarks2}
                      {this.reportData && this.reportData.aremarks2}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2" style={{ width: "20px" }}>
                      3IÈME ROD
                    </td>
                    <td colSpan="3" style={{ width: "30px" }}>
                      3 3/16" (±1/16")
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.vp3}
                      {this.reportData && this.reportData.avp3}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.ve3}
                      {this.reportData && this.reportData.ave3}
                    </td>
                    <td colSpan="5" style={{ width: "50px" }}>
                      {this.reportData && this.reportData.remarks3}
                      {this.reportData && this.reportData.aremarks3}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="4" style={{ width: "40px", height: "120px" }}>
                      COTE DE PROTECTION DU CONTRE-RAIL / GUARD RAIL
                    </td>
                    <td colSpan="2" style={{ width: "20px" }}></td>
                    <td colSpan="3" style={{ width: "30px" }}>
                      1 7/8" (± 1/8")
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.vp4}
                      {this.reportData && this.reportData.avp4}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.ve4}
                      {this.reportData && this.reportData.ave4}
                    </td>
                    <td colSpan="5" style={{ width: "50px" }}>
                      {this.reportData && this.reportData.remarks4}
                      {this.reportData && this.reportData.aremarks4}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="4" style={{ width: "40px", height: "120px" }}>
                      COTE DE PROTECTION POINTE DU CŒUR DE CROISEMENT
                    </td>
                    <td colSpan="2" style={{ width: "20px" }}></td>
                    <td colSpan="3" style={{ width: "30px" }}>
                      54 5/8" (- 1/4" , + 0")
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.vp5}
                      {this.reportData && this.reportData.avp5}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.ve5}
                      {this.reportData && this.reportData.ave5}
                    </td>
                    <td colSpan="5" style={{ width: "50px" }}>
                      <span style={{ fontSize: "20px", fontWeight: "700", color: "#ff0000" }}>
                        {this.reportData && this.reportData.remarks5}
                        {this.reportData && this.reportData.aremarks5}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="9" style={{ width: "90px", height: "215px", color: "#0070c0", borderRight: "none", verticalAlign: "top" }}>
                      <h1 style={{ margin: "20px 0 50px 0", fontSize: "3rem", fontWeight: "500" }}>INSPECTION VISUELLE</h1>
                      <div style={{ fontSize: "18px", fontWeight: "500" }}>(LES ITEMS COULEUR OR = INSPECTION ANNUELLE SEULEMENT)</div>
                    </td>
                    <td
                      className="switch-no-border middle"
                      style={{ width: "5px", borderRight: "none", borderLeft: "none", fontSize: "24px", fontWeight: "500" }}
                    >
                      <div className="text-box-slanted">
                        <div className="text-slanted one">BON&nbsp;ÉTAT</div>
                        <div className="text-slanted two">AJUSTER</div>
                        <div className="text-slanted three">REMPLACER</div>
                      </div>
                    </td>
                    <td
                      className="switch-no-border"
                      style={{
                        width: "5px",
                        borderRight: "none",
                        borderLeft: "none",
                        fontSize: "24px",
                        fontWeight: "500",
                        verticalAlign: "bottom",
                      }}
                    >
                      AVIS
                    </td>
                    <td colSpan="5" style={{ width: "50px" }}>
                      <span style={{ fontSize: "20px", fontWeight: "700" }}>DESCRIPTION</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <table className="table-bordered monthly-switch-Report" style={{ marginBottom: "0" }}>
                <thead>
                  <tr className="main-heading">
                    <th className="span" colSpan="36" style={{ width: "100%", borderBottom: "transparent" }}>
                      <span style={{ paddingLeft: "10px", fontSize: "26px", fontWeight: "700", textAlign: "left" }}>
                        {languageService("SECTION DES POINTES")}
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="20" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}>
                      POINTE COLLE BIEN EN POSITION NORMALE
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.pointecolle1 === "BON ÉTAT" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.pointecolle1 === "AJUSTER" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.pointecolle1 === "REMPLACER" ? "X" : ""}
                    </td>
                    <td colSpan="2" style={{ width: "35px" }}>
                      {this.reportData && this.reportData.avis1}
                    </td>
                    <td colSpan="11" style={{ width: "120px" }}>
                      {this.reportData && this.reportData.description1}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="20" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}>
                      POINTE COLLE BIEN EN POSITION RENVERSÉE
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.pointecolle2 === "BON ÉTAT" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.pointecolle2 === "AJUSTER" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.pointecolle2 === "REMPLACER" ? "X" : ""}
                    </td>
                    <td colSpan="2" style={{ width: "35px" }}>
                      {this.reportData && this.reportData.avis2}
                    </td>
                    <td colSpan="11" style={{ width: "120px" }}>
                      {this.reportData && this.reportData.description2}
                    </td>
                  </tr>
                  <tr className="background-golden">
                    <td colSpan="20" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}>
                      SURÉLÉVATION DE LA POINTE (1/4") C/E - C/N
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.asurelevation1 === "BON ÉTAT" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.asurelevation1 === "AJUSTER" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.asurelevation1 === "REMPLACER" ? "X" : ""}
                    </td>
                    <td colSpan="2" style={{ width: "35px" }}>
                      {this.reportData && this.reportData.aavis1}
                    </td>
                    <td colSpan="11" style={{ width: "120px" }}>
                      {this.reportData && this.reportData.adesc1}
                    </td>
                  </tr>
                  <tr className="background-golden">
                    <td colSpan="20" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}>
                      SURÉLÉVATION DE LA POINTE (1/4") C/O - C/S
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.asurelevation2 === "BON ÉTAT" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.asurelevation2 === "AJUSTER" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.asurelevation2 === "REMPLACER" ? "X" : ""}
                    </td>
                    <td colSpan="2" style={{ width: "35px" }}>
                      {this.reportData && this.reportData.aavis2}
                    </td>
                    <td colSpan="11" style={{ width: "120px" }}>
                      {this.reportData && this.reportData.adesc2}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="20" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}>
                      CONDITION DE LA POINTE C/O - C/S
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.conditionpoint1 === "BON ÉTAT" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.conditionpoint1 === "AJUSTER" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.conditionpoint1 === "REMPLACER" ? "X" : ""}
                    </td>
                    <td colSpan="2" style={{ width: "35px" }}>
                      {this.reportData && this.reportData.avis3}
                    </td>
                    <td colSpan="11" style={{ width: "120px" }}>
                      {this.reportData && this.reportData.description3}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="20" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}>
                      CONDITION DE LA POINTE C/E - C/N
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.conditionpoint2 === "BON ÉTAT" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.conditionpoint2 === "AJUSTER" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.conditionpoint2 === "REMPLACER" ? "X" : ""}
                    </td>
                    <td colSpan="2" style={{ width: "35px" }}>
                      {this.reportData && this.reportData.avis4}
                    </td>
                    <td colSpan="11" style={{ width: "120px" }}>
                      {this.reportData && this.reportData.description4}
                    </td>
                  </tr>
                  <tr className="background-golden">
                    <td colSpan="20" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}>
                      BOULONS TALON DE LA POINTE C/O - C/S (HEEL-BLOCK BOLTS)
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.aboulons1 === "BON ÉTAT" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.aboulons1 === "AJUSTER" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.aboulons1 === "REMPLACER" ? "X" : ""}
                    </td>
                    <td colSpan="2" style={{ width: "35px" }}>
                      {this.reportData && this.reportData.aavis3}
                    </td>
                    <td colSpan="11" style={{ width: "120px" }}>
                      {this.reportData && this.reportData.adesc3}
                    </td>
                  </tr>
                  <tr className="background-golden">
                    <td colSpan="20" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}>
                      BOULONS TALON DE LA POINTE C/E - C/N (HEEL-BLOCK BOLTS)
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.aboulons2 === "BON ÉTAT" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.aboulons2 === "AJUSTER" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.aboulons2 === "REMPLACER" ? "X" : ""}
                    </td>
                    <td colSpan="2" style={{ width: "35px" }}>
                      {this.reportData && this.reportData.aavis4}
                    </td>
                    <td colSpan="11" style={{ width: "120px" }}>
                      {this.reportData && this.reportData.adesc4}
                    </td>
                  </tr>
                  <tr className="background-golden">
                    <td colSpan="20" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}>
                      NIVELLEMENT TALON DE LA POINTE C/O - C/S (HEEL-BLOCK)
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.anivell1 === "BON ÉTAT" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.anivell1 === "AJUSTER" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.anivell1 === "REMPLACER" ? "X" : ""}
                    </td>
                    <td colSpan="2" style={{ width: "35px" }}>
                      {this.reportData && this.reportData.aavis5}
                    </td>
                    <td colSpan="11" style={{ width: "120px" }}>
                      {this.reportData && this.reportData.adesc5}
                    </td>
                  </tr>
                  <tr className="background-golden">
                    <td colSpan="20" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}>
                      NIVELLEMENT TALON DE LA POINTE C/E - C/N (HEEL-BLOCK)
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.anivell2 === "BON ÉTAT" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.anivell2 === "AJUSTER" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.anivell2 === "REMPLACER" ? "X" : ""}
                    </td>
                    <td colSpan="2" style={{ width: "35px" }}>
                      {this.reportData && this.reportData.aavis6}
                    </td>
                    <td colSpan="11" style={{ width: "120px" }}>
                      {this.reportData && this.reportData.adesc6}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="20" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}>
                      CONTRE-FICHE C/O - C/S (BRACE-BLOCK)
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.contrefiche1 === "BON ÉTAT" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.contrefiche1 === "AJUSTER" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.contrefiche1 === "REMPLACER" ? "X" : ""}
                    </td>
                    <td colSpan="2" style={{ width: "35px" }}>
                      {this.reportData && this.reportData.avis5}
                    </td>
                    <td colSpan="11" style={{ width: "120px" }}>
                      {this.reportData && this.reportData.description5}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="20" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}>
                      CONTRE-FICHE C/E - C/N (BRACE-BLOCK)
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.contrefiche2 === "BON ÉTAT" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.contrefiche2 === "AJUSTER" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.contrefiche2 === "REMPLACER" ? "X" : ""}
                    </td>
                    <td colSpan="2" style={{ width: "35px" }}>
                      {this.reportData && this.reportData.avis6}
                    </td>
                    <td colSpan="11" style={{ width: "120px" }}>
                      {this.reportData && this.reportData.description6}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="20" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}>
                      BOULONS DE CONTRE-FICHE C/O - C/S (BRACE-BLOCK BOLTS)
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.contrefiche2a === "BON ÉTAT" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.contrefiche2a === "AJUSTER" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.contrefiche2a === "REMPLACER" ? "X" : ""}
                    </td>
                    <td colSpan="2" style={{ width: "35px" }}>
                      {this.reportData && this.reportData.avis6a}
                    </td>
                    <td colSpan="11" style={{ width: "120px" }}>
                      {this.reportData && this.reportData.description6a}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="20" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}>
                      BOULONS DE CONTRE-FICHE C/E - C/N (BRACE-BLOCK BOLTS)
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.contrefiche2b === "BON ÉTAT" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.contrefiche2b === "AJUSTER" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.contrefiche2b === "REMPLACER" ? "X" : ""}
                    </td>
                    <td colSpan="2" style={{ width: "35px" }}>
                      {this.reportData && this.reportData.avis6b}
                    </td>
                    <td colSpan="11" style={{ width: "120px" }}>
                      {this.reportData && this.reportData.description6b}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="20" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}>
                      CONTRE-AIGUILLE C/O - C/S (STOCK-RAIL)
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.contreaiguille1 === "BON ÉTAT" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.contreaiguille1 === "AJUSTER" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.contreaiguille1 === "REMPLACER" ? "X" : ""}
                    </td>
                    <td colSpan="2" style={{ width: "35px" }}>
                      {this.reportData && this.reportData.avis7}
                    </td>
                    <td colSpan="11" style={{ width: "120px" }}>
                      {this.reportData && this.reportData.description7}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="20" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}>
                      CONTRE-AIGUILLE C/E - C/N (STOCK-RAIL)
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.contreaiguille2 === "BON ÉTAT" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.contreaiguille2 === "AJUSTER" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.contreaiguille2 === "REMPLACER" ? "X" : ""}
                    </td>
                    <td colSpan="2" style={{ width: "35px" }}>
                      {this.reportData && this.reportData.avis8}
                    </td>
                    <td colSpan="11" style={{ width: "120px" }}>
                      {this.reportData && this.reportData.description8}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="20" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}>
                      TRINGLES D'ÉCARTEMENT (RODS)
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.trianglerods === "BON ÉTAT" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.trianglerods === "AJUSTER" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.trianglerods === "REMPLACER" ? "X" : ""}
                    </td>
                    <td colSpan="2" style={{ width: "35px" }}>
                      {this.reportData && this.reportData.avis9}
                    </td>
                    <td colSpan="11" style={{ width: "120px" }}>
                      {this.reportData && this.reportData.description9}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="20" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}>
                      BOULONS DES TRINGLES D'ÉCARTEMENT (RODS BOLTS)
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.boulonsdes1 === "BON ÉTAT" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.boulonsdes1 === "AJUSTER" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.boulonsdes1 === "REMPLACER" ? "X" : ""}
                    </td>
                    <td colSpan="2" style={{ width: "35px" }}>
                      {this.reportData && this.reportData.avis10}
                    </td>
                    <td colSpan="11" style={{ width: "120px" }}>
                      {this.reportData && this.reportData.description10}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="20" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}>
                      GOUPILLES
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.goupilles === "BON ÉTAT" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.goupilles === "AJUSTER" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.goupilles === "REMPLACER" ? "X" : ""}
                    </td>
                    <td colSpan="2" style={{ width: "35px" }}>
                      {this.reportData && this.reportData.avis11}
                    </td>
                    <td colSpan="11" style={{ width: "120px" }}>
                      {this.reportData && this.reportData.description11}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="20" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}>
                      SELLES DE GLISSEMENT (PLATES)
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.sellesde1 === "BON ÉTAT" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.sellesde1 === "AJUSTER" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.sellesde1 === "REMPLACER" ? "X" : ""}
                    </td>
                    <td colSpan="2" style={{ width: "35px" }}>
                      {this.reportData && this.reportData.avis12}
                    </td>
                    <td colSpan="11" style={{ width: "120px" }}>
                      {this.reportData && this.reportData.description12}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="20" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}>
                      CONDITION DES DORMANTS (TIES)
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.conditiondes1 === "BON ÉTAT" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.conditiondes1 === "AJUSTER" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.conditiondes1 === "REMPLACER" ? "X" : ""}
                    </td>
                    <td colSpan="2" style={{ width: "35px" }}>
                      {this.reportData && this.reportData.avis13}
                    </td>
                    <td colSpan="11" style={{ width: "120px" }}>
                      {this.reportData && this.reportData.description13}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="20" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}>
                      CRAMPONS ET SYSTÈME D'ATTACHE
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.carmponset1 === "BON ÉTAT" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.carmponset1 === "AJUSTER" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.carmponset1 === "REMPLACER" ? "X" : ""}
                    </td>
                    <td colSpan="2" style={{ width: "35px" }}>
                      {this.reportData && this.reportData.avis14}
                    </td>
                    <td colSpan="11" style={{ width: "120px" }}>
                      {this.reportData && this.reportData.description14}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="20" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}>
                      NIVELLEMENT ET ALIGNEMENT
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.nivellementet1 === "BON ÉTAT" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.nivellementet1 === "AJUSTER" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.nivellementet1 === "REMPLACER" ? "X" : ""}
                    </td>
                    <td colSpan="2" style={{ width: "35px" }}>
                      {this.reportData && this.reportData.avis15}
                    </td>
                    <td colSpan="11" style={{ width: "120px" }}>
                      {this.reportData && this.reportData.description15}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <table className="table-bordered monthly-switch-Report" style={{ marginBottom: "0" }}>
                <thead>
                  <tr className="main-heading">
                    <th className="span" colSpan="36" style={{ width: "100%", borderBottom: "transparent" }}>
                      <span style={{ paddingLeft: "10px", fontSize: "26px", fontWeight: "700", textAlign: "left" }}>
                        <Row>
                          <Col md="7">{languageService("SECTION DU CŒUR DE CROISSEMENT")}</Col>
                          <Col md="5">CŒUR # : {this.reportData && this.reportData.sectiondu1}</Col>
                        </Row>
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="20" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}>
                      CŒUR DE CROISSEMENT (FROG)
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.ceurde2 === "BON ÉTAT" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.ceurde2 === "AJUSTER" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.ceurde2 === "REMPLACER" ? "X" : ""}
                    </td>
                    <td colSpan="2" style={{ width: "35px" }}>
                      {this.reportData && this.reportData.avis16}
                    </td>
                    <td colSpan="11" style={{ width: "120px" }}>
                      {this.reportData && this.reportData.description16}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="20" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}>
                      BOULONS DU CŒUR DE CROISSEMENT
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.boulonsdu2 === "BON ÉTAT" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.boulonsdu2 === "AJUSTER" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.boulonsdu2 === "REMPLACER" ? "X" : ""}
                    </td>
                    <td colSpan="2" style={{ width: "35px" }}>
                      {this.reportData && this.reportData.avis17}
                    </td>
                    <td colSpan="11" style={{ width: "120px" }}>
                      {this.reportData && this.reportData.description17}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="20" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}>
                      ROUES TOUCHES CÔTÉ POINTE
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.roues2 === "BON ÉTAT" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.roues2 === "AJUSTER" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.roues2 === "REMPLACER" ? "X" : ""}
                    </td>
                    <td colSpan="2" style={{ width: "35px" }}>
                      {this.reportData && this.reportData.avis18}
                    </td>
                    <td colSpan="11" style={{ width: "120px" }}>
                      {this.reportData && this.reportData.description18}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="20" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}>
                      ROUES TOUCHES CÔTÉ AILES
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.roues3 === "BON ÉTAT" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.roues3 === "AJUSTER" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.roues3 === "REMPLACER" ? "X" : ""}
                    </td>
                    <td colSpan="2" style={{ width: "35px" }}>
                      {this.reportData && this.reportData.avis19}
                    </td>
                    <td colSpan="11" style={{ width: "120px" }}>
                      {this.reportData && this.reportData.description19}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="20" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}>
                      SELLES DU CŒUR DE CROISSEMENT (PLATES)
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.sellesdu3 === "BON ÉTAT" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.sellesdu3 === "AJUSTER" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.sellesdu3 === "REMPLACER" ? "X" : ""}
                    </td>
                    <td colSpan="2" style={{ width: "35px" }}>
                      {this.reportData && this.reportData.avis20}
                    </td>
                    <td colSpan="11" style={{ width: "120px" }}>
                      {this.reportData && this.reportData.description20}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="20" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}>
                      CRAMPONS, SYSTÈME D'ATTACHE
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.crampons1 === "BON ÉTAT" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.crampons1 === "AJUSTER" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.crampons1 === "REMPLACER" ? "X" : ""}
                    </td>
                    <td colSpan="2" style={{ width: "35px" }}>
                      {this.reportData && this.reportData.avis21}
                    </td>
                    <td colSpan="11" style={{ width: "120px" }}>
                      {this.reportData && this.reportData.description21}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="20" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}>
                      CONTRE-RAIL C/O - C/S (GUARD-RAIL)
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.contrerail1 === "BON ÉTAT" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.contrerail1 === "AJUSTER" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.contrerail1 === "REMPLACER" ? "X" : ""}
                    </td>
                    <td colSpan="2" style={{ width: "35px" }}>
                      {this.reportData && this.reportData.avis22}
                    </td>
                    <td colSpan="11" style={{ width: "120px" }}>
                      {this.reportData && this.reportData.description22}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="20" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}>
                      CONTRE-RAIL C/E - C/N (GUARD-RAIL)
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.contrerail2 === "BON ÉTAT" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.contrerail2 === "AJUSTER" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.contrerail2 === "REMPLACER" ? "X" : ""}
                    </td>
                    <td colSpan="2" style={{ width: "35px" }}>
                      {this.reportData && this.reportData.avis23}
                    </td>
                    <td colSpan="11" style={{ width: "120px" }}>
                      {this.reportData && this.reportData.description23}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="20" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}>
                      AJUSTER COTE DE PROTECTION C/O - C/S
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.adjustercote1 === "BON ÉTAT" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.adjustercote1 === "AJUSTER" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.adjustercote1 === "REMPLACER" ? "X" : ""}
                    </td>
                    <td colSpan="2" style={{ width: "35px" }}>
                      {this.reportData && this.reportData.avis24}
                    </td>
                    <td colSpan="11" style={{ width: "120px" }}>
                      {this.reportData && this.reportData.description24}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="20" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}>
                      AJUSTER COTE DE PROTECTION C/E - C/N
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.adjustercote2 === "BON ÉTAT" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.adjustercote2 === "AJUSTER" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.adjustercote2 === "REMPLACER" ? "X" : ""}
                    </td>
                    <td colSpan="2" style={{ width: "35px" }}>
                      {this.reportData && this.reportData.avis25}
                    </td>
                    <td colSpan="11" style={{ width: "120px" }}>
                      {this.reportData && this.reportData.description25}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="20" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}>
                      BOULONS DU CONTRE-RAIL C/O - C/S (GUARD-RAIL)
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.boulonsdu3 === "BON ÉTAT" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.boulonsdu3 === "AJUSTER" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.boulonsdu3 === "REMPLACER" ? "X" : ""}
                    </td>
                    <td colSpan="2" style={{ width: "35px" }}>
                      {this.reportData && this.reportData.avis26}
                    </td>
                    <td colSpan="11" style={{ width: "120px" }}>
                      {this.reportData && this.reportData.description26}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="20" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}>
                      BOULONS DU CONTRE-RAIL C/E - C/N (GUARD-RAIL)
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.boulonsdu4 === "BON ÉTAT" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.boulonsdu4 === "AJUSTER" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.boulonsdu4 === "REMPLACER" ? "X" : ""}
                    </td>
                    <td colSpan="2" style={{ width: "35px" }}>
                      {this.reportData && this.reportData.avis27}
                    </td>
                    <td colSpan="11" style={{ width: "120px" }}>
                      {this.reportData && this.reportData.description27}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="20" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}>
                      CONDITION DES DORMANTS (TIES)
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.conditiondes2 === "BON ÉTAT" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.conditiondes2 === "AJUSTER" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.conditiondes2 === "REMPLACER" ? "X" : ""}
                    </td>
                    <td colSpan="2" style={{ width: "35px" }}>
                      {this.reportData && this.reportData.avis28}
                    </td>
                    <td colSpan="11" style={{ width: "120px" }}>
                      {this.reportData && this.reportData.description28}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="20" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}>
                      NIVELLEMENT ET ALIGNEMENT
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.nivellementet2 === "BON ÉTAT" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.nivellementet2 === "AJUSTER" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.nivellementet2 === "REMPLACER" ? "X" : ""}
                    </td>
                    <td colSpan="2" style={{ width: "35px" }}>
                      {this.reportData && this.reportData.avis29}
                    </td>
                    <td colSpan="11" style={{ width: "120px" }}>
                      {this.reportData && this.reportData.description29}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <table className="table-bordered monthly-switch-Report" style={{ marginBottom: "0" }}>
                <thead>
                  <tr className="main-heading">
                    <th className="span" colSpan="36" style={{ width: "100%", borderBottom: "transparent" }}>
                      <span style={{ paddingLeft: "10px", fontSize: "26px", fontWeight: "700", textAlign: "left" }}>
                        {languageService("ASPECT GÉNÉRAL DE L'AIGUILLAGE")}
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="20" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}>
                      ÉTAT DU BALLAST ET DE L'ÉPAULEMENT
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.etatdu2 === "BON ÉTAT" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.etatdu2 === "AJUSTER" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.etatdu2 === "REMPLACER" ? "X" : ""}
                    </td>
                    <td colSpan="2" style={{ width: "35px" }}>
                      {this.reportData && this.reportData.avis30}
                    </td>
                    <td colSpan="11" style={{ width: "120px" }}>
                      {this.reportData && this.reportData.description30}
                    </td>
                  </tr>
                  <tr className="background-golden">
                    <td colSpan="20" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}>
                      NIVELLEMENT ET ALIGNEMENT (DONNÉES DU 454)
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.anivell3 === "BON ÉTAT" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.anivell3 === "AJUSTER" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.anivell3 === "REMPLACER" ? "X" : ""}
                    </td>
                    <td colSpan="2" style={{ width: "35px" }}>
                      {this.reportData && this.reportData.aavis7}
                    </td>
                    <td colSpan="11" style={{ width: "120px" }}>
                      {this.reportData && this.reportData.adesc7}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="20" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}>
                      CONDITION DES DORMANTS (TIES)
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.conditiondes3 === "BON ÉTAT" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.conditiondes3 === "AJUSTER" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.conditiondes3 === "REMPLACER" ? "X" : ""}
                    </td>
                    <td colSpan="2" style={{ width: "35px" }}>
                      {this.reportData && this.reportData.avis31}
                    </td>
                    <td colSpan="11" style={{ width: "120px" }}>
                      {this.reportData && this.reportData.description31}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="10" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}>
                      JOINTS ISOLÉS VP C/O - C/S
                    </td>
                    <td colSpan="10" rowSpan="2" style={{ width: "10px" }}>
                      AVANT DES POINTES
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.jointsisolves1 === "BON ÉTAT" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.jointsisolves1 === "AJUSTER" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.jointsisolves1 === "REMPLACER" ? "X" : ""}
                    </td>
                    <td colSpan="2" style={{ width: "35px" }}>
                      {this.reportData && this.reportData.avis32}
                    </td>
                    <td colSpan="11" style={{ width: "120px" }}>
                      {this.reportData && this.reportData.description32}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="10" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}>
                      JOINTS ISOLÉS VP C/E - C/N
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.jointsisolves2 === "BON ÉTAT" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.jointsisolves2 === "AJUSTER" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.jointsisolves2 === "REMPLACER" ? "X" : ""}
                    </td>
                    <td colSpan="2" style={{ width: "35px" }}>
                      {this.reportData && this.reportData.avis33}
                    </td>
                    <td colSpan="11" style={{ width: "120px" }}>
                      {this.reportData && this.reportData.description33}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="10" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}>
                      JOINTS ISOLÉS VP C/O - C/S
                    </td>
                    <td colSpan="10" rowSpan="2" style={{ width: "10px" }}>
                      AVANT COEUR DE CROISEMENT (FROG)
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.jointsisolves3 === "BON ÉTAT" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.jointsisolves3 === "AJUSTER" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.jointsisolves3 === "REMPLACER" ? "X" : ""}
                    </td>
                    <td colSpan="2" style={{ width: "35px" }}>
                      {this.reportData && this.reportData.avis34}
                    </td>
                    <td colSpan="11" style={{ width: "120px" }}>
                      {this.reportData && this.reportData.description34}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="10" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}>
                      JOINTS ISOLÉS VP C/E - C/N
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.jointsisolves4 === "BON ÉTAT" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.jointsisolves4 === "AJUSTER" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.jointsisolves4 === "REMPLACER" ? "X" : ""}
                    </td>
                    <td colSpan="2" style={{ width: "35px" }}>
                      {this.reportData && this.reportData.avis35}
                    </td>
                    <td colSpan="11" style={{ width: "120px" }}>
                      {this.reportData && this.reportData.description35}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="20" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}>
                      JOINTS ISOLÉS VE C/O - C/S
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.jointsisolves5 === "BON ÉTAT" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.jointsisolves5 === "AJUSTER" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.jointsisolves5 === "REMPLACER" ? "X" : ""}
                    </td>
                    <td colSpan="2" style={{ width: "35px" }}>
                      {this.reportData && this.reportData.avis37}
                    </td>
                    <td colSpan="11" style={{ width: "120px" }}>
                      {this.reportData && this.reportData.description37}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="20" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}>
                      JOINTS ISOLÉS VE C/E - C/N
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.jointsisolves6 === "BON ÉTAT" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.jointsisolves6 === "AJUSTER" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.jointsisolves6 === "REMPLACER" ? "X" : ""}
                    </td>
                    <td colSpan="2" style={{ width: "35px" }}>
                      {this.reportData && this.reportData.avis38}
                    </td>
                    <td colSpan="11" style={{ width: "120px" }}>
                      {this.reportData && this.reportData.description38}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="20" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}>
                      JOINTS ISOLÉS VP C/O - C/S
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.jointsisolves7 === "BON ÉTAT" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.jointsisolves7 === "AJUSTER" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.jointsisolves7 === "REMPLACER" ? "X" : ""}
                    </td>
                    <td colSpan="2" style={{ width: "35px" }}>
                      {this.reportData && this.reportData.avis39}
                    </td>
                    <td colSpan="11" style={{ width: "120px" }}>
                      {this.reportData && this.reportData.description39}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="20" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}>
                      JOINTS ISOLÉS VP C/E - C/N
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.jointsisolves8 === "BON ÉTAT" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.jointsisolves8 === "AJUSTER" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.jointsisolves8 === "REMPLACER" ? "X" : ""}
                    </td>
                    <td colSpan="2" style={{ width: "35px" }}>
                      {this.reportData && this.reportData.avis40}
                    </td>
                    <td colSpan="11" style={{ width: "120px" }}>
                      {this.reportData && this.reportData.description40}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="20" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}>
                      RAIL
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.rail1 === "BON ÉTAT" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.rail1 === "AJUSTER" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.rail1 === "REMPLACER" ? "X" : ""}
                    </td>
                    <td colSpan="2" style={{ width: "35px" }}>
                      {this.reportData && this.reportData.avis41}
                    </td>
                    <td colSpan="11" style={{ width: "120px" }}>
                      {this.reportData && this.reportData.description41}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="20" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}>
                      RAIL
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.rail2 === "BON ÉTAT" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.rail2 === "AJUSTER" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.rail2 === "REMPLACER" ? "X" : ""}
                    </td>
                    <td colSpan="2" style={{ width: "35px" }}>
                      {this.reportData && this.reportData.avis42}
                    </td>
                    <td colSpan="11" style={{ width: "120px" }}>
                      {this.reportData && this.reportData.description42}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="20" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}>
                      RAIL
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.rail3 === "BON ÉTAT" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.rail3 === "AJUSTER" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.rail3 === "REMPLACER" ? "X" : ""}
                    </td>
                    <td colSpan="2" style={{ width: "35px" }}>
                      {this.reportData && this.reportData.avis43}
                    </td>
                    <td colSpan="11" style={{ width: "120px" }}>
                      {this.reportData && this.reportData.description43}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="20" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}>
                      RAIL
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.rail4 === "BON ÉTAT" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.rail4 === "AJUSTER" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.rail4 === "REMPLACER" ? "X" : ""}
                    </td>
                    <td colSpan="2" style={{ width: "35px" }}>
                      {this.reportData && this.reportData.avis44}
                    </td>
                    <td colSpan="11" style={{ width: "120px" }}>
                      {this.reportData && this.reportData.description44}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="20" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}>
                      AUTRES COMPOSANTES
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.autres1 === "BON ÉTAT" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.autres1 === "AJUSTER" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.autres1 === "REMPLACER" ? "X" : ""}
                    </td>
                    <td colSpan="2" style={{ width: "35px" }}>
                      {this.reportData && this.reportData.avis44a}
                    </td>
                    <td colSpan="11" style={{ width: "120px" }}>
                      {this.reportData && this.reportData.description44a}
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan="20"
                      style={{
                        width: "190px",
                        textAlign: "left",
                        paddingLeft: "10px",
                        fontSize: "20px",
                        fontWeight: "700",
                        color: "rgb(255, 0, 0)",
                      }}
                    >
                      CADENAS VÉRROUILLÉ ET EN BON ÉTAT
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.cadenaseten1 === "BON ÉTAT" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.cadenaseten1 === "AJUSTER" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.cadenaseten1 === "REMPLACER" ? "X" : ""}
                    </td>
                    <td colSpan="2" style={{ width: "35px" }}>
                      {this.reportData && this.reportData.avis45}
                    </td>
                    <td colSpan="11" style={{ width: "120px" }}>
                      {this.reportData && this.reportData.description45}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <table className="table-bordered monthly-switch-Report" style={{ marginBottom: "0" }}>
                <thead>
                  <tr className="main-heading">
                    <th className="span" colSpan="36" style={{ width: "100%", borderBottom: "transparent" }}>
                      <span style={{ paddingLeft: "10px", fontSize: "26px", fontWeight: "700", textAlign: "left" }}>
                        {languageService("ÉCARTEMENT DE LA VOIE")}
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="background-golden">
                    <td colSpan="20" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}>
                      5 À 10 PIEDS AVANT LES AIGUILLES
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.apied1 === "BON ÉTAT" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.apied1 === "AJUSTER" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.apied1 === "REMPLACER" ? "X" : ""}
                    </td>
                    <td colSpan="2" style={{ width: "35px" }}>
                      {this.reportData && this.reportData.aavis8}
                    </td>
                    <td colSpan="11" style={{ width: "120px" }}>
                      {this.reportData && this.reportData.adesc8}
                    </td>
                  </tr>
                  <tr className="background-golden">
                    <td colSpan="20" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}>
                      V/E À L'ENTRETOISE DU TALON
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.aentre1 === "BON ÉTAT" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.aentre1 === "AJUSTER" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.aentre1 === "REMPLACER" ? "X" : ""}
                    </td>
                    <td colSpan="2" style={{ width: "35px" }}>
                      {this.reportData && this.reportData.aavis9}
                    </td>
                    <td colSpan="11" style={{ width: "120px" }}>
                      {this.reportData && this.reportData.adesc9}
                    </td>
                  </tr>
                  <tr className="background-golden">
                    <td colSpan="20" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}>
                      V/E AU POINT MÉDIAN DU RAIL INTERMÉDIAIRE
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.amedpoint1 === "BON ÉTAT" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.amedpoint1 === "AJUSTER" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.amedpoint1 === "REMPLACER" ? "X" : ""}
                    </td>
                    <td colSpan="2" style={{ width: "35px" }}>
                      {this.reportData && this.reportData.aavis10}
                    </td>
                    <td colSpan="11" style={{ width: "120px" }}>
                      {this.reportData && this.reportData.adesc10}
                    </td>
                  </tr>
                  <tr className="background-golden">
                    <td colSpan="20" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}>
                      V/E APRÈS LE CŒUR DE CROISEMENT
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.aapresde1 === "BON ÉTAT" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.aapresde1 === "AJUSTER" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.aapresde1 === "REMPLACER" ? "X" : ""}
                    </td>
                    <td colSpan="2" style={{ width: "35px" }}>
                      {this.reportData && this.reportData.aavis11}
                    </td>
                    <td colSpan="11" style={{ width: "120px" }}>
                      {this.reportData && this.reportData.adesc11}
                    </td>
                  </tr>
                  <tr className="background-golden">
                    <td colSpan="20" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}>
                      V/E 20 PIEDS APRÈS LE CŒUR DE CROISEMENT
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.apied2 === "BON ÉTAT" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.apied2 === "AJUSTER" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.apied2 === "REMPLACER" ? "X" : ""}
                    </td>
                    <td colSpan="2" style={{ width: "35px" }}>
                      {this.reportData && this.reportData.aavis12}
                    </td>
                    <td colSpan="11" style={{ width: "120px" }}>
                      {this.reportData && this.reportData.adesc12}
                    </td>
                  </tr>
                  <tr className="background-golden">
                    <td colSpan="20" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}>
                      V/E 40 PIEDS APRÈS LE CŒUR DE CROISEMENT
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.apied3 === "BON ÉTAT" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.apied3 === "AJUSTER" ? "X" : ""}
                    </td>
                    <td colSpan="1" style={{ width: "10px" }}>
                      {this.reportData && this.reportData.apied3 === "REMPLACER" ? "X" : ""}
                    </td>
                    <td colSpan="2" style={{ width: "35px" }}>
                      {this.reportData && this.reportData.aavis13}
                    </td>
                    <td colSpan="11" style={{ width: "120px" }}>
                      {this.reportData && this.reportData.adesc13}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <table className="table-bordered monthly-switch-Report" style={{ marginBottom: "0" }}>
                <thead>
                  <tr className="main-heading">
                    <th className="span" colSpan="36" style={{ width: "100%", borderBottom: "transparent" }}>
                      <span style={{ paddingLeft: "10px", fontSize: "26px", fontWeight: "700", textAlign: "left" }}>
                        {languageService("COMMENTAIRES :")}
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="36" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}>
                      <pre style={{ fontFamily: "sans-serif", fontSize: "17px" }}>
                        {this.reportData && this.reportData.acomment1}
                        {this.reportData && this.reportData.comments1}
                      </pre>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="36" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}></td>
                  </tr>
                  <tr>
                    <td colSpan="36" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}></td>
                  </tr>
                  <tr>
                    <td colSpan="36" style={{ width: "190px", textAlign: "left", paddingLeft: "10px" }}></td>
                  </tr>
                  <tr className="main-heading">
                    <td colSpan="10" style={{ width: "190px", textAlign: "left", paddingLeft: "10px", backgroundColor: "#d9d9d9" }}>
                      <span style={{ paddingLeft: "10px", fontSize: "26px", fontWeight: "700", textAlign: "left" }}>BM #</span>
                    </td>
                    <td colSpan="26">
                      {this.reportData && this.reportData.bm1} {this.reportData && this.reportData.abm1}
                    </td>
                  </tr>
                  <tr className="main-heading">
                    <td colSpan="10" style={{ width: "190px", textAlign: "left", paddingLeft: "10px", backgroundColor: "#d9d9d9" }}>
                      <span style={{ paddingLeft: "10px", fontSize: "26px", fontWeight: "700", textAlign: "left" }}> CODE DU BM :</span>
                    </td>
                    <td colSpan="26">
                      {this.reportData && this.reportData.codedubm}
                      {this.reportData && this.reportData.acodedubm}
                    </td>
                  </tr>
                  <tr className="main-heading">
                    <td colSpan="10" style={{ width: "190px", textAlign: "left", paddingLeft: "10px", backgroundColor: "#d9d9d9" }}>
                      <span style={{ paddingLeft: "10px", fontSize: "26px", fontWeight: "700", textAlign: "left" }}> DATE DU BM :</span>
                    </td>
                    <td colSpan="26">
                      {this.reportData && this.reportData.datedubm}
                      {this.reportData && this.reportData.adatedubm}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Row className="border-wrapper">
                <Col md={4}>
                  <div className="media-image" style={{ textAlign: "center", overflow: "hidden" }}>
                    <span className="spacer"></span>
                    <img
                      src={themeService(iconToShow)}
                      alt="Logo"
                      style={{ display: "inline-block", paddgin: "", margin: "0 auto", width: "100%" }}
                    />
                  </div>
                </Col>
                <Col md={8}>
                  <div className="media-image" style={{ textAlign: "center" }}>
                    <span className="spacer"></span>
                    <img
                      src={themeService(switchImage)}
                      alt="Switch Image"
                      style={{ display: "inline-block", paddgin: "", margin: "0 auto" }}
                    />
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Row>
                <Col md={8}>
                  <div
                    style={{
                      textAlign: "left",
                      borderBottom: "1px solid #000",
                    }}
                  >
                    <SignatureImage signatureImage={this.props.signatureImage} />
                    <span className="spacer"></span> <span className="spacer"></span>
                    <span style={{ paddingLeft: "0px", fontSize: "26px", fontWeight: "700", textAlign: "left" }}>SIGNATURE :</span>
                  </div>
                </Col>
                <Col md={4}>
                  <div
                    style={{
                      textAlign: "left",
                      borderBottom: "1px solid #000",
                    }}
                  >
                    <span className="spacer"></span> <span className="spacer"></span>
                    <span style={{ paddingLeft: "0px", fontSize: "26px", fontWeight: "700", textAlign: "left" }}>DATE :</span>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}
export default MonthlySwitchInspection;
