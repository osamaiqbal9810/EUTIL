import React, { Component } from "react";
import { CardTypeTwo } from "components/Common/Cards";
import { Row, Col, Label, Button } from "reactstrap";
import { smartSummaryStyle } from "components/Common/SmartSummary/styles/SmartSummaryStyle.js";
import { plusCircle } from "react-icons-kit/fa/plusCircle";
//import { withPlus } from 'react-icons-kit/entypo/withPlus'
import SvgIcon from "react-icons-kit";
import { ButtonCirclePlus } from "components/Common/Buttons";
import { plus } from "react-icons-kit/icomoon/plus";
import { Tooltip } from "reactstrap";
//import { ic_expand_more } from "react-icons-kit/md/ic_expand_more"
import { Icon } from "react-icons-kit";
import { ic_expand_more } from "react-icons-kit/md/ic_expand_more";
import { iconShowHideStyle, summeryStyle } from "./styles/SmartSummaryStyle";
import { getStatusColor } from "../../../utils/statusColors";
import { themeService } from "../../../theme/service/activeTheme.service";
import { basicColors, retroColors, electricColors } from "../../../style/basic/basicColors";
import { languageService } from "../../../Language/language.service";

class SmartSummary extends Component {
  constructor(props) {
    super(props);
    this.toggleTooltip = this.toggleTooltip.bind(this);
    this.state = {
      tooltipOpen: false,
    };
    this.RoatetIcon = this.RoatetIcon.bind(this);
  }
  RoatetIcon() {
    this.props.handleHideShow();
    this.setState({ valueRotate: this.state.valueRotate + 180 });
  }
  toggleTooltip() {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen,
    });
  }

  render() {
    let summaryDesc = this.props.descriptions ? this.props.descriptions : {};
    let summaryVals = this.props.values ? this.props.values : {};
    let assigned = this.props.assignedToMe ? this.props.assignedToMe : {};
    let permissionValue = true;

    if (this.props.permissionCheckProps) {
      permissionValue = this.props.permissionCheck;
    }
    return (
      <div>
        {!this.props.noHideSummary && (
          <button onClick={this.RoatetIcon} style={iconShowHideStyle}>
            <Icon size={"30"} icon={ic_expand_more} />
          </button>
        )}
        <div style={{ overflow: "hidden" }}>
          <Row style={summeryStyle(this.props)}>
            <Col md="11">
              <Row style={smartSummaryStyle.allCardSummaryContainer}>
                {summaryDesc.first && (
                  <Col md="2" style={smartSummaryStyle.cardContainer}>
                    <div onClick={() => this.props.handleSummaryClick("first")}>
                      <CardTypeTwo
                        number={summaryVals.first}
                        numberColor={getStatusColor(this.props.summaryLabels.first)}
                        topRight={assigned.first}
                        text={summaryDesc.first}
                      />
                    </div>
                  </Col>
                )}
                {summaryDesc.second && (
                  <Col md="2" style={smartSummaryStyle.cardContainer}>
                    <div onClick={() => this.props.handleSummaryClick("second")}>
                      <CardTypeTwo
                        number={summaryVals.second}
                        numberColor={getStatusColor(this.props.summaryLabels.second)}
                        topRight={assigned.second}
                        text={summaryDesc.second}
                      />
                    </div>
                  </Col>
                )}
                {summaryDesc.third && (
                  <Col md="2" style={smartSummaryStyle.cardContainer}>
                    <div onClick={() => this.props.handleSummaryClick("third")}>
                      <CardTypeTwo
                        number={summaryVals.third}
                        numberColor={getStatusColor(this.props.summaryLabels.third)}
                        topRight={assigned.third}
                        text={summaryDesc.third}
                      />
                    </div>
                  </Col>
                )}
                {summaryDesc.fourth && (
                  <Col md="2" style={smartSummaryStyle.cardContainer}>
                    <div onClick={() => this.props.handleSummaryClick("fourth")}>
                      <CardTypeTwo
                        number={summaryVals.fourth}
                        numberColor={getStatusColor(this.props.summaryLabels.fourth)}
                        topRight={assigned.fourth}
                        text={summaryDesc.fourth}
                      />
                    </div>
                  </Col>
                )}
                {summaryDesc.fifth && (
                  <Col md="2" style={smartSummaryStyle.cardContainer}>
                    <div onClick={() => this.props.handleSummaryClick("fifth")}>
                      <CardTypeTwo
                        number={summaryVals.fifth}
                        numberColor={getStatusColor(this.props.summaryLabels.fifth)}
                        topRight={assigned.fifth}
                        text={summaryDesc.fifth}
                      />
                    </div>
                  </Col>
                )}
                {summaryDesc.sixth && (
                  <Col md="2" style={smartSummaryStyle.cardContainer}>
                    <div onClick={() => this.props.handleSummaryClick("sixth")}>
                      <CardTypeTwo
                        number={summaryVals.sixth}
                        numberColor={getStatusColor(this.props.summaryLabels.sixth)}
                        topRight={assigned.sixth}
                        text={summaryDesc.sixth}
                        onClick={() => this.props.handleSummaryClick("sixth")}
                      />
                    </div>
                  </Col>
                )}
                {summaryDesc.seventh && (
                  <Col md="2" style={smartSummaryStyle.cardContainer}>
                    <div onClick={() => this.props.handleSummaryClick("seventh")}>
                      <CardTypeTwo
                        number={summaryVals.seventh}
                        numberColor={getStatusColor(this.props.summaryLabels.seventh)}
                        topRight={assigned.seventh}
                        text={summaryDesc.seventh}
                        onClick={() => this.props.handleSummaryClick("seventh")}
                      />
                    </div>
                  </Col>
                )}
              </Row>
            </Col>
            {this.props.AddButton && (
              <Col md="1">
                {permissionValue && (
                  <div style={{ padding: "4px 0px" }}>
                    <div id={"toolTipAdd" + this.props.addToolTipId} style={themeService({ default: { margin: "auto", color: "var(--first)", cursor: "pointer" }, retro: { margin: "auto", color: retroColors.second, cursor: "pointer" }, electric: { margin: "auto", color: electricColors.second, cursor: "pointer" } })}>
                      <SvgIcon
                        size={24}
                        icon={plus}
                        onClick={e => {
                          this.props.handleAddNewClick("Add");
                        }}
                      />
                    </div>

                    <Tooltip isOpen={this.state.tooltipOpen} target={"toolTipAdd" + this.props.addToolTipId} toggle={this.toggleTooltip}>
                      {languageService("Add")} {languageService(this.props.addTootTipText)}
                    </Tooltip>
                  </div>
                )}
              </Col>
            )}
          </Row>
        </div>
      </div>
    );
  }
}

export default SmartSummary;
