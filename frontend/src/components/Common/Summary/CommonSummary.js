import React, { Component } from "react";
import { CardTypeThree } from "components/Common/Cards";
import { Row, Col, Label, Button } from "reactstrap";
import { commonSummaryStyle } from "components/Common/Summary/styles/CommonSummaryStyle.js";
import { plusCircle } from "react-icons-kit/fa/plusCircle";
import { withPlus } from "react-icons-kit/entypo/withPlus";
import SvgIcon from "react-icons-kit";
import { ButtonCirclePlus } from "components/Common/Buttons";
import { Tooltip } from "reactstrap";
//import { ic_expand_more } from "react-icons-kit/md/ic_expand_more";
import { Icon } from "react-icons-kit";
import { summeryStyle } from "style/components/Summary/commonSummary";
import { themeService } from "../../../theme/service/activeTheme.service";
import { getStatusColor } from "../../../utils/statusColors";
import propTypes from "prop-types";
/*
summaryDesc: { first: 'First Summary Card Text', second: 'Second Summary Card Text', third: 'Third Summary Card Text', fourth: 'Fourth Summary Card Text' , fifth : 'Fifth Summary Card Text ', sixth : 'sixth Summary Card Text' },
summaryValue: { first: 0, second: 0, third: 0, fourth: 0  , fifth: 0, sixth : 0}

*/
import { languageService } from "../../../Language/language.service";

class CommonSummary extends Component {
  constructor(props) {
    super(props);
    this.toggleTooltip = this.toggleTooltip.bind(this);
    this.state = {
      tooltipOpen: false,
      valueRotate: 0,
    };
    this.RoatetIcon = this.RoatetIcon.bind(this);
  }

  toggleTooltip() {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen,
    });
  }
  RoatetIcon() {
    this.props.handleHideShow();
    this.setState({ valueRotate: this.state.valueRotate + 180 });
  }
  render() {
    let summaryDesc = this.props.descriptions ? this.props.descriptions : {};
    let summaryVals = this.props.values ? this.props.values : {};
    let assigned = this.props.assignedToMe ? this.props.assignedToMe : {};
    let permissoinValue = true;

    if (this.props.permissionCheckProps) {
      permissoinValue = this.props.permissionCheck;
    }
    return (
      <div>
        <div style={themeService(commonSummaryStyle.summaryContainer(this.props))}>
          <Row style={themeService(commonSummaryStyle.summaryMainStyle(this.props))}>
            <Col md="11">
              <Row style={themeService(commonSummaryStyle.allCardSummaryContainer)}>
                {summaryDesc.first && (
                  <Col md="2" style={themeService(commonSummaryStyle.cardContainer)}>
                    <div onClick={() => this.props.handleSummaryClick("first")}>
                      <CardTypeThree
                        number={summaryVals.first}
                        numberColor={getStatusColor(this.props.summaryLabels.first)}
                        topRight={assigned.first}
                        text={summaryDesc.first}
                        styles={{ cursor: "pointer" }}
                      />
                    </div>
                  </Col>
                )}
                {summaryDesc.second && (
                  <Col md="2" style={themeService(commonSummaryStyle.cardContainer)}>
                    <div onClick={() => this.props.handleSummaryClick("second")}>
                      <CardTypeThree
                        number={summaryVals.second}
                        numberColor={getStatusColor(this.props.summaryLabels.second)}
                        topRight={assigned.second}
                        text={summaryDesc.second}
                        styles={{ cursor: "pointer" }}
                      />
                    </div>
                  </Col>
                )}
                {summaryDesc.third && (
                  <Col md="2" style={themeService(commonSummaryStyle.cardContainer)}>
                    <div onClick={() => this.props.handleSummaryClick("third")}>
                      <CardTypeThree
                        number={summaryVals.third}
                        numberColor={getStatusColor(this.props.summaryLabels.third)}
                        topRight={assigned.third}
                        text={summaryDesc.third}
                        styles={{ cursor: "pointer" }}
                      />
                    </div>
                  </Col>
                )}
                {summaryDesc.fourth && (
                  <Col md="2" style={themeService(commonSummaryStyle.cardContainer)}>
                    <div onClick={() => this.props.handleSummaryClick("fourth")}>
                      <CardTypeThree
                        number={summaryVals.fourth}
                        numberColor={getStatusColor(this.props.summaryLabels.fourth)}
                        topRight={assigned.fourth}
                        text={summaryDesc.fourth}
                        styles={{ cursor: "pointer" }}
                      />
                    </div>
                  </Col>
                )}
                {summaryDesc.fifth && (
                  <Col md="2" style={themeService(commonSummaryStyle.cardContainer)}>
                    <div onClick={() => this.props.handleSummaryClick("fifth")}>
                      <CardTypeThree
                        number={summaryVals.fifth}
                        numberColor={getStatusColor(this.props.summaryLabels.fifth)}
                        topRight={assigned.fifth}
                        text={summaryDesc.fifth}
                        styles={{ cursor: "pointer" }}
                      />
                    </div>
                  </Col>
                )}
                {summaryDesc.sixth && (
                  <Col md="2" style={themeService(commonSummaryStyle.cardContainer)}>
                    <div onClick={() => this.props.handleSummaryClick("sixth")}>
                      <CardTypeThree
                        number={summaryVals.sixth}
                        numberColor={getStatusColor(this.props.summaryLabels.sixth)}
                        topRight={assigned.sixth}
                        text={summaryDesc.sixth}
                        styles={{ cursor: "pointer" }}
                        onClick={() => this.props.handleSummaryClick("sixth")}
                      />
                    </div>
                  </Col>
                )}
                {summaryDesc.seventh && (
                  <Col md="2" style={themeService(commonSummaryStyle.cardContainer)}>
                    <div onClick={() => this.props.handleSummaryClick("seventh")}>
                      <CardTypeThree
                        number={summaryVals.seventh}
                        numberColor={getStatusColor(this.props.summaryLabels.seventh)}
                        topRight={assigned.seventh}
                        text={summaryDesc.seventh}
                        styles={{ cursor: "pointer" }}
                        onClick={() => this.props.handleSummaryClick("seventh")}
                      />
                    </div>
                  </Col>
                )}
              </Row>
            </Col>
            {this.props.AddButton && (
              <Col md="1">
                {permissoinValue && (
                  <div>
                    <div id={"toolTipAdd" + this.props.addToolTipId}>
                      <ButtonCirclePlus
                        handleClick={e => {
                          this.props.handleAddNewClick("Add");
                        }}
                        {...themeService(commonSummaryStyle.addButtonStyle(this.props))}
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

export default CommonSummary;

CommonSummary.defaultProps = {
  summaryLabels: {},
};
