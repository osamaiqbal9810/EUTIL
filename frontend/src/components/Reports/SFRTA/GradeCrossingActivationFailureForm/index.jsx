import React, { Component, Fragment } from "react";
import { getAllowedSwitches } from "../../../../AssetTypeConfig/Reports/SwitchinspectionReport";
import { ReportGeneratorUtils } from "../../utils/reportGeneratorUtils";
import { switchReportStyle } from "../../Timps/Switch/style/index";
import { themeService } from "../../../../theme/service/activeTheme.service";
import _ from "lodash";
import ReportTitleSection from "../../../../libraries/ReportGenerator/ReportTitleSection";
import { tick_char } from "../../../jobBriefing/JobBrieifingReport/special-char";
import { dataFormatters } from "../../../../utils/dataFormatters";

const subTitleStyle = {
  textAlign: 'center', fontWeight: 600, fontSize: '25px'
}
const HeaderAndValue = ({ title, value, topBottomPadding }) => {
  return <Fragment>
    <div style={_.merge({ paddingLeft: '5px', textAlign: 'left' }, topBottomPadding ? { paddingTop: '10px', paddingBottom: '10px' } : {})}>
      <div style={{ fontSize: '12px' }}>{title}</div>
      <div>{value}</div>
    </div>
  </Fragment>
}

const CauseOfFailure = ({ title, list }) => {
  return <div>
    <div>{title}</div>
    <ol type="a">
      {list.map(opt => <li>{opt}</li>)}
    </ol>

  </div>
}

const TickBox = ({ flag, label }) => {
  return <div style={{ paddingRight: '20px' }}><span style={{ border: '2px solid', padding: '2px', width: '25px', height: '25px', fontSize: '13px', textAlign: 'center', display: 'inline-block', fontWeight: '800' }}> {flag ? tick_char : ''} </span> {label}</div>
}
const CharBox = ({ val }) => {
  return <div style={{ paddingRight: '20px' }}><span style={{ border: '2px solid', width: '30px', height: '30px', textAlign: 'center', display: 'inline-block' }}> {val} </span> </div>
}

const ReportView = (props) => {
  let { data } = props;
  // let sectionsData = [{}, data, data.tbltes ? data.tbltes : [], [data]];
  return (
    <div id="mainContent" className="table-report" style={{ ...themeService(switchReportStyle.mainStyle), pageBreakAfter: "always" }}>
      <ReportTitleSection title="HIGHWAY-RAIL GRADE CROSSING WARNING SYSTEM ACTIVATION FAILURE REPORT" hideLogo={true} />

      <div style={{ textAlign: 'end', fontSize: '15px' }}>
        OMB Approval No.: 2130-0534
      </div>
      <div style={{ border: '2px solid', padding: '5px', fontSize: '13px' }}>
        Public reporting burden for this information collection is estimated to average 10 minutes per response, including the time for reviewing instructions, searching existing data sources, gathering and maintaining the data needed, and completing and reviewing the collection of information.  According to the Paperwork Reduction Act of 1995, a federal agency may not conduct or sponsor, and a person is not required to respond to, nor shall a person be subject to a penalty for failure to comply with, a collection of information unless it displays a currently valid OMB control number. The valid OMB control number for this information collection is 2130-0534. All responses to this collection of information are mandatory.  Send comments regarding this burden estimate or any other aspect of this collection, including suggestions for reducing this burden to: Information Collection Officer, Federal Railroad Administration, 1200 New Jersey Ave., S.E., Washington D.C. 20590.
      </div>
      <div style={{ padding: '5px' }}>
        Each railroad shall submit a report of each activation failure to FRA within 15 days after the failure occurs. Copies of this form may be obtained from the Federal Railroad Administration's web site at www.fra.dot.gov
      </div>
      <div style={{ padding: '5px' }}>
        An activation failure means the failure of an active highway-rail grade crossing warning system to indicate the approach of a train at least 20 seconds prior to the train's arrival at the crossing, or to indicate the presence of a train occupying the crossing, unless the crossing is provided with an alternative means of active warning to highway users of approaching trains. (This failure indicates to the motorist that it is safe to proceed across the railroad tracks when, in fact, it is not safe to do so.)
      </div>
      <div style={{ padding: '5px' }}>
        A train means one or more locomotives, with or without cars
      </div>

      <table>
        <tbody>
          <tr>
            <td colSpan={8} rowSpan={5}>
              <div style={{ height: '100%', textAlign: 'left', padding: '5px' }}>Email to: fra.af_fp.reporting@dot.gov</div>
            </td>
            <td colSpan={8} rowSpan={1}>
              <HeaderAndValue title={'Name of Railroad'} value={'Test Name'} />
            </td>
            <td colSpan={4} rowSpan={1}>
              <HeaderAndValue title={'RR Code'} value={'Test RR Code'} />
            </td>
          </tr>
          <tr>
            <td colSpan={12} rowSpan={1}>
              <HeaderAndValue title={'Region/Division (Optional)'} value={'Test Region'} />
            </td>
          </tr>
          <tr>
            <td colSpan={8} rowSpan={1}>
              <HeaderAndValue title={'Reporting Employee (Signature/Title)'} value={'Test Employee'} />
            </td>
            <td colSpan={4} rowSpan={1}>
              <HeaderAndValue title={'Date Signed'} value={dataFormatters.dateFormatter(new Date())} />
            </td>
          </tr>
          <tr>
            <td colSpan={12} rowSpan={1}>
              <HeaderAndValue title={'DOT Crossing Number'} value={'Test DOT'} />
            </td>
          </tr>
          <tr>
            <td colSpan={12} rowSpan={1}>
              <div style={{ paddingLeft: '5px', textAlign: 'left', display: 'flex' }}>
                <div style={{ paddingRight: '30px' }}>Accident/Incident Involved?</div>
                <TickBox flag={true} label={'Yes'} />
                <TickBox flag={true} label={'No'} />
                <div style={{ paddingLeft: '50px' }}>{'(Defined in 49 CFR Section 225.5)'}</div>
              </div>
            </td>
          </tr>


        </tbody>
      </table>
      <div style={subTitleStyle}>CLASSIFICATION</div>
      <div style={{ border: '2px solid', padding: '15px' }}>
        <div>
          Current Active Warning Devices (Check all that apply)
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <TickBox flag={true} label={'Gates'} />
          <TickBox flag={true} label={'Cantilevered Flashing Lights'} />
          <TickBox flag={true} label={'Flashing Lights'} />
          <TickBox flag={true} label={'Wig Wags'} />
          <TickBox flag={true} label={'Hwy. Traffic Signals'} />
          <TickBox flag={true} label={'Bell'} />
          <TickBox flag={true} label={'Other (Describe)'} />
        </div>
      </div>
      <span className="spacer"></span>
      <div style={subTitleStyle}>LOCATION</div>
      <table>
        <tbody>
          <tr>
            <td colSpan={5}>
              <HeaderAndValue title={'Street/Road'} value={'Test Street'} topBottomPadding={true} />
            </td>
            <td colSpan={5}>
              <HeaderAndValue title={'County/Parish'} value={'Test County'} topBottomPadding={true} />
            </td>
            <td colSpan={5}>
              <HeaderAndValue title={'City'} value={'Test City'} topBottomPadding={true} />
            </td>
            <td colSpan={5}>
              <HeaderAndValue title={'Test State'} value={'Test State'} topBottomPadding={true} />
            </td>
            <td colSpan={5}>
              <HeaderAndValue title={'RR Mile Post'} value={'Test RR'} topBottomPadding={true} />
            </td>
          </tr>
        </tbody>
      </table>
      <div style={subTitleStyle}>CORRECTIVE ACTION</div>
      <table>
        <tbody>
          <tr>
            <td colSpan={10}>
              <div style={{ textAlign: 'left', padding: '15px' }}>Failure Reported/Discovered</div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <HeaderAndValue title={'Date'} value={dataFormatters.dateFormatter(new Date())} topBottomPadding={true} />
                <HeaderAndValue title={'Time'} value={`${dataFormatters.timeFormatterWithoutSecs(new Date())}`} topBottomPadding={true} />
                <div style={{ display: 'flex' }}>
                </div>
              </div>
            </td>
            <td colSpan={10}>
              <div style={{ textAlign: 'left', padding: '15px' }}>Repairs Completed</div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <HeaderAndValue title={'Date'} value={dataFormatters.dateFormatter(new Date())} topBottomPadding={true} />
                <HeaderAndValue title={'Time'} value={`${dataFormatters.timeFormatterWithoutSecs(new Date())}`} topBottomPadding={true} />
                <div style={{ display: 'flex' }}>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td colSpan={10}>
              <div style={{ textAlign: 'left', padding: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>Cause of Failure Codes (Primary & Secondary Required)</div>
                  <div style={{ display: "flex" }}>
                    <CharBox val={2} />
                    <CharBox val={'a'} />
                  </div>
                </div>
                <div style={{ display: 'flex', padding: '10px' }}>
                  <div style={{ width: '50%' }}>
                    <CauseOfFailure
                      title={'1. Power'}
                      list={
                        [
                          'Commercial',
                          'Railroad',
                          'Batteries',
                          'Chargers/Transformers',
                          'Power Surge',
                          'Lightning (Fuses, Arresters)',
                          'Loose Connections/Frayed Wires',
                          'Other'
                        ]}
                    />
                  </div>
                  <div style={{ width: '50%' }}>
                    <CauseOfFailure
                      title={'2. Equipment'}
                      list={
                        [
                          'Relays',
                          'Motion Detector',
                          'Constant Warning Time Device',
                          'Other Train Detection (e.g. AFO)',
                          'Shunts/Couplers',
                          'Crossing Controller',
                          'Lamps',
                          'Cable, Wiring Harness, or Grounds',
                          'Other'
                        ]}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', padding: '10px' }}>
                  <div style={{ width: '50%' }}>
                    <CauseOfFailure
                      title={'3. Rail'}
                      list={
                        [
                          'Rusty',
                          'Contaminants on Rail',
                          'Contaminants on Train Wheels',
                          'Broken Rail',
                          'Shorted Rail',
                          'Track Connections',
                          'Other'
                        ]}
                    />
                  </div>
                  <div style={{ width: '50%' }}>
                    <CauseOfFailure
                      title={'4. Human Factor'}
                      list={
                        [
                          'Interference',
                          'Vandalism',
                          'Design',
                          'Testing',
                          'Maintenance Procedures',
                          'Communications Procedures',
                          'Adjustments',
                          'Other'
                        ]}
                    />
                  </div>
                </div>
              </div>
            </td>
            <td colSpan={10}>
              <div style={{ textAlign: 'left', padding: '15px', height: '100%' }}>
                <div style={{ height: '30px' }}>Provide a Brief Explanation of Failure:</div>
                <div style={{ height: 'calc(100% - 30px)', backgroundColor: 'aliceblue', border: '1px solid', padding: '5px' }}>Test Paragraph filled by the user</div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div style={{ display: "flex" }}>
        <div style={{ fontSize: '15px', width: '33%' }}>FRA F 6180.83 Rev. 10/21</div>
        <div style={{ fontSize: '20px', fontWeight: 600, width: '33%', textAlign: 'center' }}>OMB approval expires 05/31/2023</div>
        <div style={{ width: '33%' }}></div>
      </div>
      <span className="spacer"></span>
    </div>
  );
};

const SFRTA_GradeCrossingActivationFailureReport = (props) => <ReportView {...props} />

export default SFRTA_GradeCrossingActivationFailureReport;
