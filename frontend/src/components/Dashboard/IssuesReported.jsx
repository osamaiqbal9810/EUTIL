/* eslint eqeqeq: 0 */
import React, { Component } from "react";
import { Col, Row } from "reactstrap";
import IssuesList from "components/IssuesReports/IssuesList/IssuesList";
import { languageService } from "../../Language/language.service";
import { commonStylesDashboard } from "./styles/commonStylesDashboard";
import { themeService } from "../../theme/service/activeTheme.service";

class IssuesReported extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
    };
    this.handlePageSave = this.handlePageSave.bind(this);
  }

  handlePageSave(page) {
    this.setState({
      page: page,
    });
  }
  render() {
    return (
      <Col md="12" style={themeService(commonStylesDashboard.zeroPaddingCol)}>
        {this.props.showHeading && (
          <Row style={themeService(commonStylesDashboard.tableHeadings)}>{languageService("Issues Reported")}</Row>
        )}
        <Row style={themeService(commonStylesDashboard.tableContainerMargin)}>
          <IssuesList
            minRows={8}
            tableData={this.props.issuesData}
            forDashboard
            noFilter
            classNameCustom={"fillFullHeight"}
            pageSize={8}
            fromDashboardToLink={"/issuereports"}
            handlePageSave={this.handlePageSave}
            page={this.state.page}
          />
        </Row>
      </Col>
    );
  }
}

export default IssuesReported;
