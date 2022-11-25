import React, { Component } from "react";
import { Container, Col, Row, Label, Button, FormGroup } from "reactstrap";

import { themeService } from "../../../../theme/service/activeTheme.service";

import { trackReportStyle } from "../style/index";
import "../style/style.css";

import _ from "lodash";
import { SignatureImage } from "../../utils/SignatureImage";

class FooterView extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="table-report footer footer-curves" style={{ ...themeService(trackReportStyle.mainStyle) }}>
          <Row>
            <Col md={6} sm={6}>
              Signed: {<SignatureImage signatureImage={this.props.signatureImage} userName={this.props.user} />}
              _______________________________________
              {this.props.reportType !== "ETR" && (
                <div style={{ border: "1px solid #000", textAlign: "center", maxWidth: "400px", marginTop: "30px", padding: "15px" }}>
                  <label style={{ width: "100%", textDecoration: "underline", fontWeight: "500" }}>Circle the appropriate title:</label>
                  <span className="footer-links">Q & A Inspector</span> <span className="footer-links">TRK Supervisor</span>
                  <br />
                  <span className="footer-links">Asst. TRK Sup</span> <span className="footer-links">Road Master</span>{" "}
                  <span className="footer-links">Chief Engineer</span>
                </div>
              )}
            </Col>
            {this.props.reportType !== "ETR" && (
              <Col md={6} sm={6}>
                Date: ______________________
              </Col>
            )}
          </Row>
        </div>
      </React.Fragment>
    );
  }
}

export default FooterView;
