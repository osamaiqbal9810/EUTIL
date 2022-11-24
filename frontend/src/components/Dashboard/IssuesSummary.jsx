/* eslint eqeqeq: 0 */
import React  from "react";
import {Col, Row } from "reactstrap";
import { CardTypeOne, CardTypeThree } from "components/Common/Cards";
import { languageService } from "../../Language/language.service";
import { themeService } from "../../theme/service/activeTheme.service";
import { PlanningAndIssuesSummaryLinearStyle } from "./styles/PlanningAndIssueSummaryStyle";
import { commonStylesDashboard } from "./styles/commonStylesDashboard";
import { getStatusColor } from "utils/statusColors";
import moment from "moment";

export const IssuesSummaryDefault = props => {
  let summaryDesc = props.descriptions ? props.descriptions : {};
  let summaryVals = props.values ? props.values : {};
  let assigned = props.assignedToMe ? props.assignedToMe : {};
  return (
    <Col md="12" style={themeService(commonStylesDashboard.zeroPaddingCol)}>
      <Row style={themeService(commonStylesDashboard.summaryHeading)}>{languageService("Issues Summary")}</Row>
      <Row style={themeService(commonStylesDashboard.zeroMarginRow)}>
        <Col
          md="6"
          sm="6"
          style={themeService(PlanningAndIssuesSummaryLinearStyle.cardTypeRightPaddingStyle)}
          onClick={e => {
            props.handleSummaryClick(summaryDesc.first, "issuereports");
          }}
        >
          {summaryDesc.first && (
            //<Link to={{ pathname: "/issuereports", fromDashboard: "first" }}>
            <CardTypeOne
              number={summaryVals.total}
              numberColor={"rgb(64, 118, 179)"}
              topRight={assigned.first}
              text={summaryDesc.first}
              styles={{ cursor: "pointer" }}
            />
            //</Link>
          )}
        </Col>
        <Col
          md="6"
          sm="6"
          style={themeService(PlanningAndIssuesSummaryLinearStyle.cardTypLeftPaddingStyle)}
          onClick={e => {
            props.handleSummaryClick(summaryDesc.second, "issuereports");
          }}
        >
          {summaryDesc.second && (
            //<Link to={{ pathname: "/issuereports", fromDashboard: "second" }}>
            <CardTypeOne
              number={summaryVals.info}
              numberColor="#A6A8AB"
              topRight={assigned.second}
              text={summaryDesc.second}
              styles={{ cursor: "pointer" }}
            />
            //</Link>
          )}
        </Col>
      </Row>
      <Row style={{ margin: "0px" }}>
        <Col
          md="6"
          sm="6"
          style={themeService(PlanningAndIssuesSummaryLinearStyle.cardTypeRightPaddingStyle)}
          onClick={e => {
            props.handleSummaryClick(summaryDesc.third, "issuereports");
          }}
        >
          {summaryDesc.third && (
            //<Link to={{ pathname: "/issuereports", fromDashboard: "third" }}>
            <CardTypeOne
              number={summaryVals.low}
              numberColor="#25A9E0"
              topRight={assigned.third}
              text={summaryDesc.third}
              styles={{ cursor: "pointer" }}
            />
            //</Link>
          )}
        </Col>
        <Col
          md="6"
          sm="6"
          style={themeService(PlanningAndIssuesSummaryLinearStyle.cardTypLeftPaddingStyle)}
          onClick={e => {
            props.handleSummaryClick(summaryDesc.fourth, "issuereports");
          }}
        >
          {summaryDesc.fourth && (
            // <Link to={{ pathname: "/issuereports", fromDashboard: "fourth" }}>
            <CardTypeOne
              number={summaryVals.medium}
              numberColor="#F6921E"
              topRight={assigned.fourth}
              text={summaryDesc.fourth}
              styles={{ cursor: "pointer" }}
            />
            //</Link>
          )}
        </Col>
      </Row>
      <Row style={{ margin: "0px" }}>
        <Col
          md="6"
          sm="6"
          style={themeService(PlanningAndIssuesSummaryLinearStyle.cardTypeRightPaddingStyle)}
          onClick={e => {
            props.handleSummaryClick(summaryDesc.fifth, "issuereports");
          }}
        >
          {summaryDesc.fifth && (
            //<Link to={{ pathname: "/issuereports", fromDashboard: "fifth" }}>
            <CardTypeOne
              number={summaryVals.high}
              numberColor="#EC1C24"
              topRight={assigned.fifth}
              text={summaryDesc.fifth}
              styles={{ cursor: "pointer" }}
            />
            //</Link>
          )}
        </Col>
        <Col
          md="6"
          sm="6"
          style={themeService(PlanningAndIssuesSummaryLinearStyle.cardTypLeftPaddingStyle)}
          onClick={e => {
            props.handleSummaryClick(summaryDesc.sixth, "issuereports");
          }}
        >
          {summaryDesc.sixth && (
            //<Link to={{ pathname: "/issuereports", fromDashboard: "sixth" }}>
            <CardTypeOne
              number={summaryVals.marked}
              numberColor="#37B34A"
              topRight={assigned.sixth}
              text={summaryDesc.sixth}
              styles={{ cursor: "pointer" }}
            />
            //</Link>
          )}
        </Col>
      </Row>
    </Col>
  );
};

export const IssuesSummaryLinear = props => {
  let summaryDesc = props.descriptions ? props.descriptions : {};
  let summaryVals = props.values ? props.values : {};
  let summaryLbl = props.summaryLabels ? props.summaryLabels : {};
  let assigned = props.assignedToMe ? props.assignedToMe : {};
  return (
    <Col md="12" style={themeService(commonStylesDashboard.zeroPaddingCol)}>
      <Row style={themeService(commonStylesDashboard.summaryHeading)}>
        {languageService("Open") + " " + languageService("Issues Summary")} - {moment().format("MMMM YYYY")}
      </Row>
      <Row style={themeService(commonStylesDashboard.zeroMarginRow)}>
        <Col
          md="2"
          sm="6"
          style={themeService(PlanningAndIssuesSummaryLinearStyle.cartTypeBothPaddingStyle)}
          onClick={e => {
            props.handleSummaryClick(summaryLbl.first, "issuereports");
          }}
        >
          {summaryDesc.first && (
            //<Link to={{ pathname: "/issuereports", fromDashboard: "first" }}>
            <CardTypeThree
              number={summaryVals.total}
              numberColor={getStatusColor(props.summaryLabels.first)}
              topRight={assigned.first}
              text={summaryDesc.first}
              styles={{ cursor: "pointer" }}
            />
            //</Link>
          )}
        </Col>
        <Col
          md="2"
          sm="6"
          style={themeService(PlanningAndIssuesSummaryLinearStyle.cartTypeBothPaddingStyle)}
          onClick={e => {
            props.handleSummaryClick(summaryLbl.second, "issuereports");
          }}
        >
          {summaryDesc.second && (
            //<Link to={{ pathname: "/issuereports", fromDashboard: "second" }}>
            <CardTypeThree
              number={summaryVals.high}
              numberColor={getStatusColor(props.summaryLabels.second)}
              topRight={assigned.second}
              text={summaryDesc.second}
              styles={{ cursor: "pointer" }}
            />
            //</Link>
          )}
        </Col>

        <Col
          md="2"
          sm="6"
          style={themeService(PlanningAndIssuesSummaryLinearStyle.cartTypeBothPaddingStyle)}
          onClick={e => {
            props.handleSummaryClick(summaryLbl.third, "issuereports");
          }}
        >
          {summaryDesc.third && (
            //<Link to={{ pathname: "/issuereports", fromDashboard: "third" }}>
            <CardTypeThree
              number={summaryVals.medium}
              numberColor={getStatusColor(props.summaryLabels.third)}
              topRight={assigned.third}
              text={summaryDesc.third}
              styles={{ cursor: "pointer" }}
            />
            //</Link>
          )}
        </Col>
        <Col
          md="2"
          sm="6"
          style={themeService(PlanningAndIssuesSummaryLinearStyle.cartTypeBothPaddingStyle)}
          onClick={e => {
            props.handleSummaryClick(summaryLbl.fourth, "issuereports");
          }}
        >
          {summaryDesc.fourth && (
            //<Link to={{ pathname: "/issuereports", fromDashboard: "fourth" }}>
            <CardTypeThree
              number={summaryVals.low}
              numberColor={getStatusColor(props.summaryLabels.fourth)}
              topRight={assigned.fourth}
              text={summaryDesc.fourth}
              styles={{ cursor: "pointer" }}
            />
            //</Link>
          )}
        </Col>
        <Col
          md="2"
          sm="6"
          style={themeService(PlanningAndIssuesSummaryLinearStyle.cartTypeBothPaddingStyle)}
          onClick={e => {
            props.handleSummaryClick(summaryLbl.fifth, "issuereports");
          }}
        >
          {summaryDesc.fifth && (
            //<Link to={{ pathname: "/issuereports", fromDashboard: "fifth" }}>
            <CardTypeThree
              number={summaryVals.info}
              numberColor={getStatusColor(props.summaryLabels.fifth)}
              topRight={assigned.fifth}
              text={summaryDesc.fifth}
              styles={{ cursor: "pointer" }}
            />
            //</Link>
          )}
        </Col>

        <Col
          md="2"
          sm="6"
          style={themeService(PlanningAndIssuesSummaryLinearStyle.cartTypeBothPaddingStyle)}
          onClick={e => {
            props.handleSummaryClick(summaryLbl.sixth, "issuereports");
          }}
        >
          {summaryDesc.sixth && (
            //<Link to={{ pathname: "/issuereports", fromDashboard: "sixth" }}>
            <CardTypeThree
              number={summaryVals.pending}
              numberColor={getStatusColor(props.summaryLabels.sixth)}
              topRight={assigned.sixth}
              text={summaryDesc.sixth}
              styles={{ cursor: "pointer" }}
            />
            //</Link>
          )}
        </Col>
      </Row>
    </Col>
  );
};
