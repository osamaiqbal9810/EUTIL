/* eslint eqeqeq: 0 */
import React from "react";
import { Col, Row } from "reactstrap";
import { CardTypeOne, CardTypeThree } from "components/Common/Cards.jsx";
import { languageService } from "../../Language/language.service";
import { PlanningAndIssuesSummaryLinearStyle } from "./styles/PlanningAndIssueSummaryStyle";
import { commonStylesDashboard } from "./styles/commonStylesDashboard";
import { themeService } from "../../theme/service/activeTheme.service";
import { getStatusColor } from "../../utils/statusColors";
import moment from "moment";

export const PlanningSummaryDefault = (props) => {
  let summaryDesc = props.descriptions ? props.descriptions : {};
  let summaryVals = props.values ? props.values : {};
  let assigned = props.assignedToMe ? props.assignedToMe : {};
  return (
    <Col md="12" style={themeService(commonStylesDashboard.zeroPaddingCol)}>
      <Row style={themeService(commonStylesDashboard.summaryHeading)}>{languageService("Inspections Summary")}</Row>
      <Row style={themeService(commonStylesDashboard.zeroMarginRow)}>
        {summaryDesc.first && (
          <Col
            md="6"
            sm="6"
            style={themeService(PlanningAndIssuesSummaryLinearStyle.cartTypeBothPaddingStyle)}
            onClick={(e) => {
              props.handleSummaryClick(summaryDesc.first, "inspection");
            }}
          >
            <CardTypeOne
              number={summaryVals.total}
              numberColor="var(--first)"
              topRight={assigned.first}
              text={summaryDesc.first}
              styles={{ cursor: "pointer" }}
            />
          </Col>
        )}
        {summaryDesc.second && (
          <Col
            md="6"
            sm="6"
            style={themeService(PlanningAndIssuesSummaryLinearStyle.cartTypeBothPaddingStyle)}
            onClick={(e) => {
              props.handleSummaryClick(summaryDesc.second, "inspection");
            }}
          >
            <CardTypeOne
              number={summaryVals.upcoming}
              numberColor="#A6A8AB"
              topRight={assigned.second}
              text={summaryDesc.second}
              styles={{ cursor: "pointer" }}
            />
          </Col>
        )}
      </Row>
      <Row style={themeService(commonStylesDashboard.zeroMarginRow)}>
        {summaryDesc.third && (
          <Col
            md="6"
            sm="6"
            style={themeService(PlanningAndIssuesSummaryLinearStyle.cartTypeBothPaddingStyle)}
            onClick={(e) => {
              props.handleSummaryClick(summaryDesc.third, "inspection");
            }}
          >
            <CardTypeOne
              number={summaryVals.inProgress}
              numberColor="#25A9E0"
              topRight={assigned.third}
              text={summaryDesc.third}
              styles={{ cursor: "pointer" }}
            />
          </Col>
        )}
        {summaryDesc.sixth && (
          <Col
            md="6"
            sm="6"
            style={themeService(PlanningAndIssuesSummaryLinearStyle.cartTypeBothPaddingStyle)}
            onClick={(e) => {
              props.handleSummaryClick(summaryDesc.sixth, "inspection");
            }}
          >
            <CardTypeOne
              number={summaryVals.completed}
              numberColor="#37B34A"
              topRight={assigned.sixth}
              text={summaryDesc.sixth}
              styles={{ cursor: "pointer" }}
            />
          </Col>
        )}
      </Row>
      <Row style={themeService(commonStylesDashboard.zeroMarginRow)}>
        {summaryDesc.fifth && (
          <Col
            md="6"
            sm="6"
            style={themeService(PlanningAndIssuesSummaryLinearStyle.cartTypeBothPaddingStyle)}
            onClick={(e) => {
              props.handleSummaryClick(summaryDesc.fifth, "inspection");
            }}
          >
            <CardTypeOne
              number={summaryVals.overdue}
              numberColor="#EC1C24"
              topRight={assigned.fifth}
              text={summaryDesc.fifth}
              styles={{ cursor: "pointer" }}
            />
          </Col>
        )}
        {summaryDesc.fourth && (
          <Col
            md="6"
            sm="6"
            style={themeService(PlanningAndIssuesSummaryLinearStyle.cartTypeBothPaddingStyle)}
            onClick={(e) => {
              props.handleSummaryClick(summaryDesc.fourth, "inspection");
            }}
          >
            <CardTypeOne
              number={summaryVals.missed}
              numberColor="#F6921E"
              topRight={assigned.fourth}
              text={summaryDesc.fourth}
              styles={{ cursor: "pointer" }}
            />
          </Col>
        )}
      </Row>
    </Col>
  );
};

export const PlanningSummaryLinear = (props) => {
  let summaryDesc = props.descriptions ? props.descriptions : {};
  let summaryVals = props.values ? props.values : {};
  let assigned = props.assignedToMe ? props.assignedToMe : {};

  return (
    <Col md="12" style={themeService(commonStylesDashboard.zeroPaddingCol)}>
      <Row style={themeService(commonStylesDashboard.summaryHeading)}>
        {languageService("Inspections Summary")} - {moment().format("MMMM YYYY")}
      </Row>
      <Row style={themeService(commonStylesDashboard.zeroMarginRow)}>
        {summaryDesc.first && (
          <Col
            md="2"
            sm="6"
            style={themeService(PlanningAndIssuesSummaryLinearStyle.cartTypeBothPaddingStyle)}
            onClick={(e) => {
              props.handleSummaryClick(props.summaryLabels.first, "inspection");
            }}
          >
            <CardTypeThree
              number={summaryVals.total}
              numberColor={getStatusColor(props.summaryLabels.first)}
              topRight={assigned.first}
              text={summaryDesc.first}
              styles={{ cursor: "pointer" }}
            />
          </Col>
        )}

        {summaryDesc.second && (
          <Col
            md="2"
            sm="6"
            style={themeService(PlanningAndIssuesSummaryLinearStyle.cartTypeBothPaddingStyle)}
            onClick={(e) => {
              props.handleSummaryClick(props.summaryLabels.second, "inspection");
            }}
          >
            <CardTypeThree
              number={summaryVals.overdue}
              numberColor={getStatusColor(props.summaryLabels.second)}
              topRight={assigned.second}
              text={summaryDesc.second}
              styles={{ cursor: "pointer" }}
            />
          </Col>
        )}

        {summaryDesc.third && (
          <Col
            md="2"
            sm="6"
            style={themeService(PlanningAndIssuesSummaryLinearStyle.cartTypeBothPaddingStyle)}
            onClick={(e) => {
              props.handleSummaryClick(props.summaryLabels.third, "inspection");
            }}
          >
            <CardTypeThree
              number={summaryVals.missed}
              numberColor={getStatusColor(props.summaryLabels.third)}
              topRight={assigned.third}
              text={summaryDesc.third}
              styles={{ cursor: "pointer" }}
            />
          </Col>
        )}
        {summaryDesc.fourth && (
          <Col
            md="2"
            sm="6"
            style={themeService(PlanningAndIssuesSummaryLinearStyle.cartTypeBothPaddingStyle)}
            onClick={(e) => {
              props.handleSummaryClick(props.summaryLabels.fourth, "inspection");
            }}
          >
            <CardTypeThree
              number={summaryVals.upcoming}
              numberColor={getStatusColor(props.summaryLabels.fourth)}
              topRight={assigned.fourth}
              text={summaryDesc.fourth}
              styles={{ cursor: "pointer" }}
            />
          </Col>
        )}
        {summaryDesc.fifth && (
          <Col
            md="2"
            sm="6"
            style={themeService(PlanningAndIssuesSummaryLinearStyle.cartTypeBothPaddingStyle)}
            onClick={(e) => {
              props.handleSummaryClick(props.summaryLabels.fifth, "inspection");
            }}
          >
            <CardTypeThree
              number={summaryVals.inProgress}
              numberColor={getStatusColor(props.summaryLabels.fifth)}
              topRight={assigned.fifth}
              text={summaryDesc.fifth}
              styles={{ cursor: "pointer" }}
            />
          </Col>
        )}

        {summaryDesc.sixth && (
          <Col
            md="2"
            sm="6"
            style={themeService(PlanningAndIssuesSummaryLinearStyle.cartTypeBothPaddingStyle)}
            onClick={(e) => {
              props.handleSummaryClick(props.summaryLabels.sixth, "inspection");
            }}
          >
            <CardTypeThree
              number={summaryVals.completed}
              numberColor={getStatusColor(props.summaryLabels.sixth)}
              topRight={assigned.sixth}
              text={summaryDesc.sixth}
              styles={{ cursor: "pointer" }}
            />
          </Col>
        )}
      </Row>
    </Col>
  );
};
