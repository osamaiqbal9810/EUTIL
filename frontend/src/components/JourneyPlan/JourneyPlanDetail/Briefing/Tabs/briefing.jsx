/* eslint eqeqeq: 0 */
import React from "react";
import { TYPE_OF_PROTECTION } from "../variables";
import { languageService } from "../../../../../Language/language.service";

const BriefingTab = ({ briefing }) => {
  const answerDisplayStyle = { paddingLeft: "3px", fontStyle: "italic", fontWeight: "900" };

  return (
    <div className="defect-code">
      {/*dateTime*/}
      <div className="data-row">
        <div style={{ display: "inline-block" }}>
          <label>{languageService("Date and Time")}: </label>
          <span style={answerDisplayStyle}>{briefing.dateTime}</span>
        </div>
        {/*<div style={{display:"inline-block"}}>*/}
        {/*<label>Time: </label>*/}
        {/*<span>{briefing.dateTime}</span>*/}
        {/*</div>*/}
        <div style={{ display: "inline-block" }}>
          <label>{`${languageService("Work Location")}`}: </label>
          <span style={answerDisplayStyle}>{briefing.workLocation}</span>
        </div>
      </div>

      {/*description*/}
      <div className="data-row">
        <div style={{ display: "inline-block" }}>
          <label>{languageService("Description of Work Assignment")}: </label>
          <span
            style={{
              verticalAlign: "top",
              height: "50px",
              display: "inline-block",
              paddingTop: "4px",
              paddingLeft: "3px",
              fontStyle: "italic",
              fontWeight: "900",
            }}
          >
            {briefing.workAssignment}
          </span>
        </div>
      </div>

      {/*Qualified Protection Employee*/}
      <div className="data-row">
        <div style={{ display: "inline-block" }}>
          <label>Qualified Protection Employee (QPE) in charge of providing on-track protection: </label>
          <span style={answerDisplayStyle}>{briefing.qPE}</span>
        </div>
      </div>

      {/*dateOnQPE*/}
      <div className="data-row">
        <div style={{ display: "inline-block" }}>
          <label>Confirm Current Qualifications: (Date on Qualification)</label>
          <span style={answerDisplayStyle}>{briefing.confirmCQ}</span>
        </div>
      </div>

      {/*lineOfTrack*/}
      <div className="data-row">
        <div style={{ display: "inline-block" }}>
          <label>On what Line and track(s) will the Roadway Worker protection be required: </label>
          <span style={answerDisplayStyle}>{briefing.lineOfTrack}</span>
        </div>
      </div>

      {/*trackMaxSpeed*/}
      <div className="data-row">
        <div style={{ display: "inline-block" }}>
          <label>Track Maximum Authorized Speed (MAS): </label>
          <span style={answerDisplayStyle}>{briefing.trackMaxSpeed}</span>
        </div>
      </div>

      {/*TYPE_OF_PROTECTION*/}
      <div className="data-row with-chkbox">
        <div style={{ display: "inline-block" }}>
          <label>What form of Protection will be used? </label>
          <span>
            <label>
              <input
                type="checkbox"
                defaultChecked={briefing.typeOfProtection.includes(TYPE_OF_PROTECTION.ITD) ? "checked" : null}
                disabled={true}
              />
              ITD
            </label>
          </span>

          <span>
            <label>
              <input
                type="checkbox"
                defaultChecked={briefing.typeOfProtection.includes(TYPE_OF_PROTECTION.FOUL_TIME) ? "checked" : null}
                disabled={true}
              />
              Foul Time
            </label>
          </span>

          <span>
            <label>
              <input
                type="checkbox"
                defaultChecked={briefing.typeOfProtection.includes(TYPE_OF_PROTECTION.TAW) ? "checked" : null}
                disabled={true}
              />
              TAW
            </label>
          </span>

          <span>
            <label>
              <input
                type="checkbox"
                defaultChecked={briefing.typeOfProtection.includes(TYPE_OF_PROTECTION.WORK_ZONE) ? "checked" : null}
                disabled={true}
              />
              Work Zone
            </label>
          </span>

          <span>
            <label>
              <input
                type="checkbox"
                defaultChecked={briefing.typeOfProtection.includes(TYPE_OF_PROTECTION.OOS) ? "checked" : null}
                disabled={true}
              />
              OOS
            </label>
          </span>
        </div>
      </div>

      {/*ITD Protection time*/}
      <div className="data-row">
        <div style={{ display: "inline-block" }}>
          <label>
            If using Individual Train Detection (ITD), you must be a QPE. What time has the Train Dispatcher been notified of you intention
            to use ITD as protection <span style={answerDisplayStyle}> {briefing.itdProtectionTime || "_________:________"}</span> AM/PM
          </label>
        </div>
      </div>

      {/*Have foul time Form*/}
      <div className="data-row  with-chkbox">
        <div style={{ display: "inline-block" }}>
          <label>
            If requesting Foul Time, the "Employee Record of Foul Time Authority" form must be used in accordance with Operating Rule RDR
            504. Do you have Foul Time Form?
          </label>
          <span>
            <label>
              <input type="checkbox" defaultChecked={briefing.haveFoulTimeForms ? "checked" : null} disabled={true} />
              YES
            </label>
          </span>

          <span>
            <label>
              <input type="checkbox" defaultChecked={briefing.haveFoulTimeForms === false ? "checked" : null} disabled={true} />
              NO
            </label>
          </span>
        </div>
      </div>

      {/*tawWatchPersonRequired*/}
      <div className="data-row">
        <div style={{ display: "inline-block", border: "none" }}>
          <label>If using Train Approach Warning for protection (TAW), how many Watchpersons/Advanced Watchpersons are required?</label>
          <span style={answerDisplayStyle}>{briefing.tawWatchPersonRequired || "______________"}</span>
        </div>
        <div style={{ display: "inline-block" }}>
          <label>What time has the Train Dispatcher been notified of your intention to use TAW as protection?</label>
          <span style={answerDisplayStyle}>{briefing.tawTime || "_______:_______"} AM/PM</span>
        </div>
      </div>

      {/*tawLocationHotspot*/}
      <div className="data-row with-chkbox">
        <div style={{ display: "inline-block", border: "none" }}>
          <label>If using Train Approach Warning for protection (TAW), is the location considered a "Hot Spot"? </label>
          <span>
            <label>
              <input type="checkbox" defaultChecked={briefing.tawLocationHotspot ? "checked" : null} disabled={true} />
              YES
            </label>
          </span>

          <span>
            <label>
              <input type="checkbox" defaultChecked={briefing.tawLocationHotspot === false ? "checked" : null} disabled={true} />
              NO
            </label>
          </span>
        </div>

        <div style={{ display: "inline-block" }}>
          <label>If Yes, have you considered the requirement for additional advanced watchpersons? </label>
          <span>
            <label>
              <input type="checkbox" defaultChecked={briefing.tawAdditionalWatchpersons ? "checked" : null} disabled={true} />
              YES
            </label>
          </span>

          <span>
            <label>
              <input type="checkbox" defaultChecked={briefing.tawAdditionalWatchpersons === false ? "checked" : null} disabled={true} />
              NO
            </label>
          </span>
        </div>
      </div>

      {/*15 second rule*/}
      <div className="data-row with-chkbox">
        <div style={{ display: "inline-block", border: "none" }}>
          <label>
            If using ITD or TAW, has the Speed Distance Table (RDR/OTS 508) been reviewed for required clearing distances to apply the
            15-second rule?
          </label>
        </div>
        <span>
          <label>
            <input type="checkbox" defaultChecked={briefing.taw15PerRule ? "checked" : null} disabled={true} />
            YES
          </label>
        </span>

        <span>
          <label>
            <input type="checkbox" defaultChecked={briefing.taw15PerRule === false ? "checked" : null} disabled={true} />
            NO
          </label>
        </span>
        <div style={{ display: "inline-block" }}>
          <label>What is the required distance?</label>
          <span style={answerDisplayStyle}>{briefing.tawRequiredDistanceFeet || "____________"} Feet.</span>
        </div>
      </div>

      {/*Work Zone Sign Placement*/}
      <div className="data-row  with-chkbox">
        <div style={{ display: "inline-block" }}>
          <label>
            If establishing a Work Zone for protection, has the Braking Chart (RDR/OTS 231) been reviewed for proper sign placement?{" "}
          </label>
          <span>
            <label>
              <input type="checkbox" defaultChecked={briefing.workZoneSignPlaced ? "checked" : null} disabled={true} />
              YES
            </label>
          </span>

          <span>
            <label>
              <input type="checkbox" defaultChecked={briefing.workZoneSignPlaced === false ? "checked" : null} disabled={true} />
              NO
            </label>
          </span>
        </div>
      </div>

      {/*oosTrainStopPlans*/}
      <div className="data-row  with-chkbox">
        <div style={{ display: "inline-block" }}>
          <label>
            If the track is taken OOS for protection, have either Barricades or Portable Train Stops been erected at the limits at all
            required locations?{" "}
          </label>
          <span>
            <label>
              <input type="checkbox" defaultChecked={briefing.oosTrainStopPlans ? "checked" : null} disabled={true} />
              YES
            </label>
          </span>

          <span>
            <label>
              <input type="checkbox" defaultChecked={briefing.oosTrainStopPlans === false ? "checked" : null} disabled={true} />
              NO
            </label>
          </span>
        </div>
      </div>

      {/*protectionEntryPoints*/}
      <div className="data-row  with-chkbox">
        <div style={{ display: "inline-block " }}>
          <label>
            When establishing protection, have all entry points (turnouts, crossigns interlockings) been considered and properly protected?{" "}
          </label>
          <span>
            <label>
              <input type="checkbox" defaultChecked={briefing.protectionEntryPoints ? "checked" : null} disabled={true} />
              YES
            </label>
          </span>

          <span>
            <label>
              <input type="checkbox" defaultChecked={briefing.protectionEntryPoints === false ? "checked" : null} disabled={true} />
              NO
            </label>
          </span>
        </div>
      </div>

      {/*protectionAllDirections*/}
      <div className="data-row  with-chkbox">
        <div style={{ display: "inline-block", border: "none" }}>
          <label>Has protection been established in all directions? </label>
          <span>
            <label>
              <input type="checkbox" defaultChecked={briefing.protectionAllDirections ? "checked" : null} disabled={true} />
              YES
            </label>
          </span>

          <span>
            <label>
              <input type="checkbox" defaultChecked={briefing.protectionAllDirections === false ? "checked" : null} disabled={true} />
              NO
            </label>
          </span>
        </div>

        <strong>Remember - Any Time, Any Direction!</strong>

        <div style={{ display: "inline-block", border: "none" }}>
          <label>If No, explain: </label>
          <span style={answerDisplayStyle}>{briefing.protectionAllDirectionNoExplain}</span>
        </div>
      </div>

      {/*otherGroupsInvolved*/}
      <div className="data-row  with-chkbox">
        <div style={{ display: "inline-block", border: "none" }}>
          <label>Are other work groups involved? </label>
          <span>
            <label>
              <input type="checkbox" defaultChecked={briefing.otherGroupsInvolved ? "checked" : null} disabled={true} />
              YES
            </label>
          </span>

          <span>
            <label>
              <input type="checkbox" defaultChecked={briefing.otherGroupsInvolved === false ? "checked" : null} disabled={true} />
              NO
            </label>
          </span>
        </div>

        <span>If yes, the Employee-in-charge (EIC) of the additional group(s) must be briefed and added to Part 2 of the form "W"</span>
      </div>

      {/*discussRoadWorkerClear*/}
      <div className="data-row">
        <div style={{ display: "inline-block" }}>
          <label>Discuss where Roadway Workers will clear: </label>
          <span style={answerDisplayStyle}>{briefing.discussRoadWorkerClear}</span>
        </div>
      </div>

      {/*watchPersonsHaveProperEquipment*/}
      <div className="data-row  with-chkbox">
        <div style={{ display: "inline-block", border: "none" }}>
          <label>Do all watchpersons have the proper equipment: </label>
          <span>
            <label>
              <input type="checkbox" defaultChecked={briefing.watchPersonsHaveProperEquipment ? "checked" : null} disabled={true} />
              YES
            </label>
          </span>

          <span>
            <label>
              <input
                type="checkbox"
                defaultChecked={briefing.watchPersonsHaveProperEquipment === false ? "checked" : null}
                disabled={true}
              />
              NO
            </label>
          </span>
        </div>

        <strong>Remember, a whistle test MUST be done after the watchmen are in place!</strong>
      </div>

      {/*workersCheckedVQC*/}
      <div className="data-row  with-chkbox">
        <div style={{ display: "inline-block" }}>
          <label>Have all workers been checked for Valid Qualification Cards & PPE?: </label>
          <span>
            <label>
              <input type="checkbox" defaultChecked={briefing.workersCheckedVQC ? "checked" : null} disabled={true} />
              YES
            </label>
          </span>

          <span>
            <label>
              <input type="checkbox" defaultChecked={briefing.workersCheckedVQC === false ? "checked" : null} disabled={true} />
              NO
            </label>
          </span>
        </div>
      </div>

      {/*allRadiosChecked*/}
      <div className="data-row  with-chkbox">
        <div style={{ display: "inline-block" }}>
          <label>Were Radio Checks performed on all radios? </label>
          <span>
            <label>
              <input type="checkbox" defaultChecked={briefing.allRadiosChecked ? "checked" : null} disabled={true} />
              YES
            </label>
          </span>

          <span>
            <label>
              <input type="checkbox" defaultChecked={briefing.allRadiosChecked === false ? "checked" : null} disabled={true} />
              NO
            </label>
          </span>
        </div>
      </div>

      {/*discussedWithOperator*/}
      <div className="data-row">
        <div style={{ display: "inline-block" }}>
          <label>If working around equipment the following must be discussed with the operator: </label>
          <div>
            <strong style={{ marginRight: "100px" }}>Dangers of Equipment</strong>
            <strong style={{ marginRight: "100px" }}>Spacing</strong>
            <strong style={{ marginRight: "100px" }}>Speeds</strong>
            <strong>Weather Conditions</strong>
          </div>
        </div>
      </div>

      {/*anyoneHaveConcern*/}
      <div className="data-row  with-chkbox">
        <div style={{ display: "inline-block", border: "none" }}>
          <label>Does anyone have any question or concerns? </label>
          <span>
            <label>
              <input type="checkbox" defaultChecked={briefing.anyoneHaveConcern ? "checked" : null} disabled={true} />
              YES
            </label>
          </span>

          <span>
            <label>
              <input type="checkbox" defaultChecked={briefing.anyoneHaveConcern === false ? "checked" : null} disabled={true} />
              NO
            </label>
          </span>
        </div>
        <div style={{ display: "inline-block" }}>
          <label>If yes, have they been addressed to everyone's satisfaction? </label>
          <span>
            <label>
              <input type="checkbox" defaultChecked={briefing.anyoneHaveConcernSatisfied ? "checked" : null} disabled={true} />
              YES
            </label>
          </span>

          <span>
            <label>
              <input type="checkbox" defaultChecked={briefing.anyoneHaveConcernSatisfied === false ? "checked" : null} disabled={true} />
              NO
            </label>
          </span>
        </div>
      </div>
    </div>
  );
};

export default BriefingTab;
