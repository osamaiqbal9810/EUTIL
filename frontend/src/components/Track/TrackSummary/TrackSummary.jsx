import React, { Component } from "react";
import { CardTypeOne } from "components/Common/Cards";
import { Row, Col, Label, Button } from "reactstrap";
import { trackSummaryStyle } from "components/Track/styles/TrackSummaryStyle.js";
import { plusCircle } from "react-icons-kit/fa/plusCircle";
import { withPlus } from "react-icons-kit/entypo/withPlus";
import SvgIcon from "react-icons-kit";
import { ButtonCirclePlus } from "components/Common/Buttons";
import { Tooltip } from "reactstrap";
import permissionCheck from "utils/permissionCheck.js";
import { languageService } from "../../../Language/language.service";
class TrackSummary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tooltipOpen: false,
    };
    this.toggleTooltip = this.toggleTooltip.bind(this);
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
    return (
      <div>
        <Row>
          <Col md="11">
            <Row style={trackSummaryStyle.allCardSummaryContainer}>
              <Col md="2" style={trackSummaryStyle.cardContainer}>
                {summaryDesc.first && (
                  <CardTypeOne number={summaryVals.first} numberColor="rgba(64, 118, 179)" topRight={assigned.first} text={summaryDesc.first} />
                )}
              </Col>
              <Col md="2" style={trackSummaryStyle.cardContainer}>
                {summaryDesc.second && (
                  <CardTypeOne number={summaryVals.second} numberColor="#A6A8AB" topRight={assigned.second} text={summaryDesc.second} />
                )}
              </Col>
              <Col md="2" style={trackSummaryStyle.cardContainer}>
                {summaryDesc.third && (
                  <CardTypeOne number={summaryVals.third} numberColor="#25A9E0" topRight={assigned.third} text={summaryDesc.third} />
                )}
              </Col>
              <Col md="2" style={trackSummaryStyle.cardContainer}>
                {summaryDesc.fourth && (
                  <CardTypeOne number={summaryVals.fourth} numberColor="#F6921E" topRight={assigned.fourth} text={summaryDesc.fourth} />
                )}{" "}
              </Col>
              <Col md="2" style={trackSummaryStyle.cardContainer}>
                {summaryDesc.fifth && (
                  <CardTypeOne number={summaryVals.fifth} numberColor="#EC1C24" topRight={assigned.fifth} text={summaryDesc.fifth} />
                )}{" "}
              </Col>
              <Col md="2" style={trackSummaryStyle.cardContainer}>
                {summaryDesc.sixth && (
                  <CardTypeOne number={summaryVals.sixth} numberColor="#37B34A" topRight={assigned.sixth} text={summaryDesc.sixth} />
                )}{" "}
              </Col>
            </Row>
          </Col>
          <Col md="1">
            {permissionCheck("TRACK", "create") && (
              <div>
                <div id="toolTipAddTrack">
                  <ButtonCirclePlus
                    iconSize={70}
                    icon={withPlus}
                    handleClick={(e) => {
                      this.props.handleAddNewClick("Add");
                    }}
                    backgroundColor="#e3e9ef"
                    margin="5px 0px 0px 0px"
                    borderRadius="50%"
                    hoverBackgroundColor="#e3e2ef"
                    hoverBorder="0px"
                    activeBorder="3px solid #e3e2ef "
                    iconStyle={{
                      color: "#c4d4e4",
                      background: "#fff",
                      borderRadius: "50%",
                      border: "3px solid ",
                    }}
                    buttonTitleText={this.props.addButtonText}
                  />
                </div>
                <Tooltip isOpen={this.state.tooltipOpen} target="toolTipAddTrack" toggle={this.toggleTooltip}>
                  {languageService("Add")} {languageService(this.props.addTootTipText)}
                </Tooltip>
              </div>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

export default TrackSummary;
