/* eslint eqeqeq: 0 */
import React, { Component } from "react";
import { BRIEFING_TABS } from "./variables";
import TabsWrapper from "../../../Common/Tabs/TabsWrapper";
import "./Briefing.css";
import BriefingTab from "./Tabs/briefing";
import WorkersTab from "./Tabs/workers";
import CommentsTab from "./Tabs/comments";

// const staticImageUrl = "https://www.digitalcitizen.life/sites/default/files/styles/img_u_large/public/featured/2016-08/photo_gallery.jpg";

class Briefing extends Component {
  state = {
    briefing: {
      dateTime: "",
      workAssignment: "",
      workLocation: "",
      qPE: "",
      confirmCQ: "",
      lineOfTrack: "",
      trackMaxSpeed: "",
      typeOfProtection: [],
      itdProtectionTime: "",
      haveFoulTimeForms: "",
      tawWatchPersonRequired: "",
      tawTime: "",
      tawLocationHotspot: "",
      tawAdditionalWatchpersons: "",
      taw15PerRule: "",
      tawRequiredDistanceFeet: "",
      workZoneSignPlaced: "",
      oosTrainStopPlans: "",
      protectionEntryPoints: "",
      protectionAllDirections: "",
      protectionAllDirectionNoExplain: "",
      otherGroupsInvolved: "",
      discussRoadWorkerClear: "",
      watchPersonsHaveProperEquipment: "",
      workersCheckedVQC: "",
      allRadiosChecked: "",
      discussedWithOperator: "",
      anyoneHaveConcern: "",
      anyoneHaveConcernSatisfied: "",
    },

    workers: [],
    comment: {
      reviewComments: "",
      signature: "",
    },

    selectedTab: BRIEFING_TABS.BRIEFING,
    onHoverImage: "",
  };

  componentDidMount() {
    let { briefing, workers, comment } = this.state;

    if (this.props.journeyPlan && this.props.journeyPlan.safetyBriefing) {
      const { safetyBriefing } = this.props.journeyPlan;

      for (let key in safetyBriefing) {
        if (key in briefing) {
          briefing[key] = safetyBriefing[key];
        } else if (key === "workers") {
          workers = safetyBriefing[key];
        } else if (key in comment) {
          comment[key] = safetyBriefing[key];
        }
      }
    }

    this.setState({ briefing, workers, comment });
  }

  handleSelectTab = selectedTab => {
    this.setState({ selectedTab });
  };

  handleUpdateState = newState => this.setState({ ...newState });

  render() {
    const { briefing, selectedTab, workers, comment } = this.state;

    return (
      <div>
        <TabsWrapper tabsArray={Object.values(BRIEFING_TABS)} handleTabClick={this.handleSelectTab} selectedTab={selectedTab} />
        <div className="form-wrapper scrollbarHor">
          {selectedTab === BRIEFING_TABS.BRIEFING && <BriefingTab briefing={briefing} />}

          {selectedTab === BRIEFING_TABS.WORKERS && (
            <WorkersTab workers={workers} onHoverImage={this.state.onHoverImage} handleUpdateState={this.handleUpdateState} />
          )}

          {selectedTab === BRIEFING_TABS.COMMENTS && <CommentsTab comment={comment} />}
        </div>
      </div>
    );
  }
}

export default Briefing;
