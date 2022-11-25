import React, { Component } from "react";
import { trackReportStyle } from "../../Timps/style/index";
import "../../Timps/style/style.css";
import { Col, Row } from "reactstrap";
import { themeService } from "../../../../theme/service/activeTheme.service";
import _ from "lodash";

const SEPTA_TrackSectionTurnoutAndSpecialWorkInspectionReportInstructions = () => {

  return (
    <React.Fragment>
      <div className="table-report turnout-specialwork" style={{ ...themeService(trackReportStyle.mainStyle), pageBreakAfter: "always" }}>
        <Row>
          <Col md={12}>
            <h2>Inspection Form Instructions</h2>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <p>
              <strong>A. Turnouts and Special work areas to be inspected</strong> <br />
              <span className="comment-text">This form is to be used for the monthly inspection of an special work turnouts. </span>
              <br />
              <strong>B. Notation </strong> <br />
              <span className="comment-text">
                • Dated conditions shell be indicated as follows: <br />
                G (GOOD) No unsatisfactory conditions. <br />
                F (FAIR) Safety serving intended function but less than satisfactory conditions indicate repairs or replacement should be
                scheduled. <br />
                P (POOR) Defects that do not require a change in class <br />
                D (DEFECT) Defects that require immediate action. <br />• A remark number can be used in conjunction with the abort legend
                to direct information to the additional reporting space available on the bottom and back of this form. P(1), C(2), etc.{" "}
              </span>
              <br />
              <strong>C. Corrective action </strong> <br />
              <span className="comment-text">
                Any adjustments as necessary shell be made in conjunction with the Inspection and "adj" indicated in the peeper column. In
                cases of a "D" defect, action taken shall be noted in column No. 22.{" "}
              </span>
              <br />
              <strong>D. Details of Inspection</strong> <br />
              <strong>Column No. 1</strong>
              <span className="comment-text"> Show location of turnout by number. </span>
              <br />
              <strong>Column No. 2</strong>
              <span className="comment-text"> Switch. stock rail and lead designated Normal and Reverse. </span>
              <br />
              <strong>Column No. 3</strong>
              <span className="comment-text"> Record actin opening found at switch point. if adjusted. mark 'adj.' </span>
              <br />
              <strong>Column No. 4</strong>
              <span className="comment-text">
                {" "}
                include surface wear and any or all pants which may affect safe and proper operation of switch rails, such as; bolts,
                rivets, clips and fastenings including cotton pins,; chippings, wearing, lines of interference of switch rail facing
                against stock rail.
              </span>
            </p>{" "}
          </Col>
          <Col md={4}>
            <p>
              <strong>Column No. 5</strong>
              <span className="comment-text">
                Include fastenings to switch clips, cotter pins, boring of switch rods, etc. including insulation where applicable. Record
                any other damage to switch rod which may affect safe and proper operation of switch in remarks space.
              </span>
              <br />
              <strong>Column No. 6</strong>
              <span className="comment-text">
                Include contact of brace with stock rail and plate condition, condition of plates, bolts and nutlocks. Ary bolt tightening
                that was required must be recorded in Column 22.
              </span>
              <br />
              <strong>Column No. 7</strong>
              <span className="comment-text">
                Compare surface wear of stock rail of surface wear of switch point. Check flow of stock rail metal interfering with proper
                bearing of switch rail and polit against stock rail. Indicate if action taken.Indicate if stock rail is not properly bent
                ahead of switch point on curved side stock rail.
              </span>
              <br />
              <strong>Column No. 8</strong>
              <span className="comment-text">
                Switch lock must be in proper working order and fastened by a chain to the timber or stand so that the switch can only be
                locked in the normal position. If not applicable, enter N/A.
              </span>
              <br />
              <strong>Column No. 9</strong>
              <span className="comment-text">
                Latches (keepers) should be securely fastened and in proper working order. Latches should be tested for wear to ensue that
                the switch cannot be opened without removing the switch lock. if latches are are not applicable enter N/A.
              </span>
              <br />
              <strong>Column No. 10</strong>
              <span className="comment-text">
                Switch position indicators (targets)shall indicate the correct switch position, be in working order and visible.
              </span>
              <br />
              <strong>Column No. 11</strong>
              <span className="comment-text">
                (X) Record actual gauge at bend in stock rail ahead of point. (Y) Record actual gauge into switch rail two (2) feet from
                point of switch and record for normal and reverse move on corresponding line.
              </span>
              <br />
              <strong>Column No. 12</strong>
              <span className="comment-text">
                Record track gauge found from point of switch thru to the last long timber.Record gauge taken for normal and reverse more
                and record on the corresponding lire.{" "}
              </span>
              <br />
            </p>
          </Col>
          <Col md={4}>
            <p>
              <strong>Column No. 13</strong>
              <span className="comment-text">
                {" "}
                Record condition of frog and all components, including plates, indicate any grinding or welding required in remarks at the
                bottom of the form.
              </span>
              <br />

              <strong>Column No. 14</strong>
              <span className="comment-text">
                Record track gauge taken at frog six (6) inches back of point Record gauge taken for normal and reverse move and record on
                the corresponding line.{" "}
              </span>
              <br />

              <strong>Column No. 15</strong>
              <span className="comment-text">Record condition of guard rail and components.</span>
              <br />

              <strong>Column No. 16</strong>
              <span className="comment-text">
                Measure guard rail "Check" gauge from wheel flange face of guard rail to gauge line of existing frog point. Record guard
                rail "Check" gauge for normal and reverse move on the corresponding line.
              </span>
              <br />

              <strong>Column No. 17</strong>
              <span className="comment-text">
                Measure back to back "face" gauge from the guarding face of the guard rail to a corresponding frog wing rail face (or
                adjacent guard rail). Record back to back "face"gauge for normal and reverse move on the corresponding line.
              </span>
              <br />

              <strong>Column No. 18</strong>
              <span className="comment-text">
                Indicate whether timers are sound and properly tamped, or in such a rendition that renewals are required.
              </span>
              <br />

              <strong>Column No. 19</strong>
              <span className="comment-text">
                Indicate the conditions, of rail anchor's that are required to hold all components in relative position.
              </span>
              <br />

              <strong>Column No. 20</strong>
              <span className="comment-text">
                Derail should be in proper working order, spiked and clearly visible, free of any obstructions. if no derail is required
                enter as N/A.
              </span>
              <br />

              <strong>Column No. 20</strong>
              <span className="comment-text">
                Indicate track surface condition and note defects in: twist; variation (spirals) or difference (tangent curve bodies):
                Cross level/super elevation deviation; or profile.
              </span>
              <br />

              <strong>Column No. 20</strong>
              <span className="comment-text"> Record immediate remedial action taken for specific defects, if any.</span>
            </p>
          </Col>
        </Row>

        <table className="table-bordered special-work">
          <tbody>
            <tr>
              <td colSpan={25}>
                <div className="text-left"> Addition Remarks / Comments: </div>
                <p className="Comments-rpt"></p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </React.Fragment>)
}
export default SEPTA_TrackSectionTurnoutAndSpecialWorkInspectionReportInstructions;
