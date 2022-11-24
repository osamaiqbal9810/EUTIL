import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import logo from "../../../logo.png";
import tekterkking from "../../../tekterkking.png";
import permissionCheck from "utils/permissionCheck.js";
import { getLanguageLocal, languageService } from "../../../Language/language.service";
import { themeService } from "theme/service/activeTheme.service";
import { basicColors, retroColors } from "style/basic/basicColors";
import { versionInfo } from "../../MainPage/VersionInfo";
import raw from "../../../gitversion.txt";

const COMPANY_INFO_TRANSLATION = {
  en: `TekTracking is an Asset Management Technology Provider servicing passenger and freight rail operators throughout North America. Our products and solutions address asset management issues universally faced by railway operators. Through strategic relationships with “Best-in-Class” technology developers, TekTracking has assembled a comprehensive solution set to meaningfully reduce railroad operating costs. TekTracking provides solutions focused on reducing costs attributed to 2/3’s of a railroad’s operating budget.`,
  es: `TekTracking es un proveedor de tecnología de gestión de activos que presta servicios a operadores de trenes de carga y pasajeros en Norteamérica. Nuestros productos y soluciones abordan problemas relacionados a la administración de activos que la operación ferroviaria enfrenta universalmente. A través de relaciones estratégicas con los mejores desarrolladores de tecnología, TekTracking ha formado un portafolios de soluciones integrales que reducen significativamente los costos operativos del ferrocarril. TekTracking proporciona soluciones enfocadas en reducir costos que se atribuyen a dos tercios del presupuesto operativo del ferrocarril.`,
  fr:
    "TekTracking est un fournisseur de technologie de gestion d'actifs au service des opérateurs ferroviaires de passagers et de fret partout en Amérique du Nord. Nos produits et solutions répondent aux problèmes de gestion d'actifs auxquels les opérateurs ferroviaires sont confrontés de manière universelle. Grâce à des relations stratégiques avec les développeurs de technologies «Best-in-Class», TekTracking a assemblé une solution complète pour réduire de manière significative les coûts d'exploitation des chemins de fer. TekTracking fournit des solutions axées sur la réduction des coûts attribués aux 2/3 du budget d’exploitation d’un chemin de fer.",
};

export default class CompanyInfo extends Component {
  constructor(props) {
    super(props);
    this.state = { gitversion: "" };
    this.styles = {
      companyInfoContainer: themeService({
        default: {
          boxShadow: "3px 3px 5px #cfcfcf",
          fontFamily: "Arial",
          fontSize: 12,
          width: "100%",
          background: "#fff",
        },
        retro: {
          boxShadow: "0",
          fontFamily: "Arial",
          fontSize: 12,
          width: "auto",
          marginLeft: "30px",
          background: retroColors.nine,
          paddingBottom: "30px",
        },
      }),
      companyInfoFields: themeService({
        default: { textAlign: "left", padding: "15px 30px ", color: basicColors.first },
        retro: { textAlign: "left", padding: "15px 30px ", color: retroColors.second },
      }),
      companyInfoFieldLabels: themeService({
        default: {
          fontSize: 12,
          fontWeight: 400,
          paddingBottom: "1em",
          letterSpacing: "0.95px",
          color: "rgba(64, 118, 179)",
        },
        retro: {
          fontSize: 14,
          fontWeight: 600,
          paddingBottom: "1em",
          letterSpacing: "0.95px",
          color: retroColors.second,
          width: "20%",
          display: "inline-block",
        },
      }),
      companyInfoFieldValues: themeService({
        default: {
          border: "1px solid #e3e9ef",
          boxShadow: "inset 0 1px 1px rgba(0, 0, 0, 0.05)",
          fontSize: 14,
          paddingTop: "1em",
          padding: "6px 12px",
        },
        retro: {
          border: "1px solid" + retroColors.seventh,
          boxShadow: "none",
          fontSize: 14,
          paddingTop: "1em",
          padding: "6px 12px",
          width: "80%",
          display: "inline-block",
          verticalAlign: "top",
          background: retroColors.fifth,
        },
      }),
      companyLogoContainer: {
        padding: "30px 30px 15px 30px",
        textAlign: "left",
      },
    };
  }
  componentDidMount() {
    let viewSetupCheck = permissionCheck("SETUP", "view");
    if (!viewSetupCheck) {
      this.props.history.push("/");
    }
    fetch(raw)
      .then((r) => r.text())
      .then((text) => {
        this.setState({ gitversion: text });
      });
  }

  render() {
    return (
      <React.Fragment>
        <Row>
          <Col md={12}>
            <div style={this.styles.companyInfoContainer}>
              <div style={this.styles.companyInfoFields}>
                <div style={this.styles.companyInfoFieldLabels}>{languageService("Web Version")}</div>
                <div style={this.styles.companyInfoFieldValues}>{versionInfo.getWebVersion()}</div>

                <div style={this.styles.companyInfoFieldLabels}>{languageService("Customer")}</div>
                <div style={this.styles.companyInfoFieldValues}>{versionInfo.getCustomer()}</div>

                <div style={this.styles.companyInfoFieldLabels}>{languageService("Application")}</div>
                <div style={this.styles.companyInfoFieldValues}>
                  {versionInfo.getApplicationType() === "TIMPS" ? "Electric Utility" : "N/A"}
                </div>

                <div style={this.styles.companyInfoFieldLabels}>{languageService("Migration")}</div>
                <div style={this.styles.companyInfoFieldValues}>{versionInfo.getMigration()}</div>

                <div style={this.styles.companyInfoFieldLabels}>{languageService("Database")}</div>
                <div style={this.styles.companyInfoFieldValues}>{versionInfo.getDatabase()}</div>

                <div style={this.styles.companyInfoFieldLabels}>{languageService("Build")}</div>
                <div style={this.styles.companyInfoFieldValues}>{this.state.gitversion}</div>
              </div>
            </div>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}
