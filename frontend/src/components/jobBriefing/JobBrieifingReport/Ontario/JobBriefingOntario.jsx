import React, { Component } from "react";
import { trackReportStyle } from "../../../Reports/Timps/style/index";
import "../../../Reports/Timps/style/style.css";
import { Container, Col, Row, Label, Button, FormGroup } from "reactstrap";
import { themeService } from "../../../../theme/service/activeTheme.service";
import { iconToShow, iconTwoShow } from "../../../Reports/variables";
import _ from "lodash";
import { dataFormatters } from "../../../../utils/dataFormatters";
import { tick_char } from "../special-char";
import moment from "moment";
import { SignatureImage } from "../../../Reports/utils/SignatureImage";
class JobBriefingOntario extends Component {
  constructor(props) {
    super(props);
    this.config = {
      minRows: 5,
    };

    this.state = {
      data: props.data ? props.data : {},
    };
  }

  render() {
    let { data } = this.state;
    let tbltest = getTabletbltest(data && data.tbltest);
    let tbliop = getTabletbliop(data && data.tbliop);
    return (
      <React.Fragment>
        <div
          className="table-report job-briefing-ontario"
          style={{ ...themeService(trackReportStyle.mainStyle), pageBreakAfter: "always" }}
        >
          <Row>
            <Col md={2}>
              <img src={themeService(iconToShow)} alt="Logo" style={{ width: "100%" }} />
            </Col>
            <Col md={3}></Col>
            <Col md={7}>
              <h2 style={{ ...themeService(trackReportStyle.headingStyle), textAlign: "right" }}>
                {"RAIL INFRASTRUCTURE"} <br /> {"JOB BRIEFING"}
              </h2>
            </Col>
          </Row>
          <hr />
          <table className="table-bordered">
            <tbody>
              <tr>
                <td colSpan={3}>
                  <span className="title-in-report">Date: </span>
                  <span>{data.date ? moment(data.date).format("MM-DD-YYYY") : ""}</span>
                </td>
                <td colSpan={6}>
                  <span className="title-in-report">Employee In Charge: </span>
                  <span>{data.empl}</span>
                </td>
                <td colSpan={3}>
                  <span className="title-in-report">Head Count: </span>
                  <span>{data.hcou}</span>
                </td>
              </tr>
              <tr>
                <td colSpan={12}>
                  <div className="title-in-report text-left">
                    Work Location(s) and Task(s) to be Performed Today: <p className="work-description">{data.loc2}</p>
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan={12}>
                  <div className="title-in-report text-left">
                    Train Line-Up{" "}
                    <small>(if applicable):</small>{" "}
                    <span>
                      <small>{data.tline}</small>
                    </span>
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <div className="title-in-report text-left">Protection Type: </div>
                  {/* <small>(circle applicable)</small> */}
                </td>
                <td colSpan={1}>
                  <span className={matchValueActiveClass(data, "ptype", "841") === " active" ? "title-small-report" : ""}>
                    {" "}
                    <span className={"selection-char" + matchValueActiveClass(data, "ptype", "841")}>{tick_char}</span>841
                  </span>
                </td>
                <td colSpan={1}>
                  <span className={matchValueActiveClass(data, "ptype", "OCS") === " active" ? "title-small-report" : ""}>
                    {" "}
                    <span className={"selection-char" + matchValueActiveClass(data, "ptype", "OCS")}>{tick_char}</span>OCS
                  </span>
                </td>
                <td colSpan={2}>
                  <span className={matchValueActiveClass(data, "ptype", "SAFETY WATCH") === " active" ? "title-small-report" : ""}>
                    {" "}
                    <span className={"selection-char" + matchValueActiveClass(data, "ptype", "SAFETY WATCH")}>{tick_char}</span>SAFETY WATCH
                  </span>
                </td>
                <td colSpan={2}>
                  <span className={matchValueActiveClass(data, "ptype", "LONE WORKER") === " active" ? "title-small-report" : ""}>
                    {" "}
                    <span className={"selection-char" + matchValueActiveClass(data, "ptype", "LONE WORKER")}>{tick_char}</span>LONE WORKER
                  </span>
                </td>
                <td colSpan={2}>
                  <div className="title-in-report text-left">Clearance #: </div>
                </td>
                <td colSpan={2}>
                  <span>{data.clear}</span>
                </td>
              </tr>
              <tr>
                <td colSpan={3}>
                  <div className="title-in-report text-left">Protection Limits Between </div>
                </td>
                <td colSpan={2}>{data.plb}</td>
                <td colSpan={2}></td>
                <td colSpan={1}>
                  <span className="title-small-report">and</span>
                </td>
                <td colSpan={2}>{data.and}</td>
                <td colSpan={2}></td>
              </tr>
              <tr>
                <td colSpan={12}>
                  <div className="title-in-report text-left">
                    Communication Info: RTC - Channel 2 #1 TOWER(S): <small>{data.towers}</small>{" "}
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan={5}>
                  <div className="title-in-report text-left">
                    Rule 125 reviewed (Ch. 2 #9)? <small>(check off)</small>
                  </div>
                </td>
                <td colSpan={1}>{data.tow}</td>
                <td colSpan={6}>
                  <div className="text-left pd-left-10px">
                    {data.tow === "No" && data.open ? data.open : ""}
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan={8}>
                  <div className="title-in-report text-left">
                    Emergency Phone / Radio Persons: <small>(identify person(s))</small>
                    <span className="rpt-values"> {data.rper}</span> <br />
                  </div>{" "}
                </td>{" "}
                <td colSpan={4}>
                  <div className="title-in-report text-left">
                    Alt:<span className="rpt-values"> {data.alt}</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan={5}>
                  <div className="title-in-report text-left">
                    Rule 110 process in place and reviewed? <small>(check off)</small>
                    <br />
                  </div>
                </td>
                <td colSpan={1}>{data.au_no}</td>
                <td colSpan={6}>
                  <div className="text-left pd-left-10px">
                    {data.au_no === "No" && data.open1 ? data.open1 : ""}
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan={8}>
                  <div className="title-in-report text-left" style={{ display: 'flex' }}>
                    <span>First Aid / CPR Persons:  <br /> <small>(identify person(s))</small></span>
                    <span className="rpt-values pd-left-10px">{data.faid}</span> <br />{" "}
                  </div>
                </td>{" "}
                <td colSpan={4}>
                  <div className="title-in-report text-left">
                    Alt: <span className="rpt-values">{data.alt1}</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan={5}>
                  <div className="title-in-report text-left">
                    Location of First Aid Kit(s) Identified? <small>(check off)</small>
                  </div>
                </td>
                <td colSpan={1}>{data.yes && "Yes"}</td>
                <td colSpan={5}>
                  <div className="title-in-report text-left">
                    Evacuation Plan Reviewed? {" "}
                    <small>(check off)</small>
                  </div>
                </td>
                <td colSpan={1}>{data.yes1 && "Yes"}</td>
              </tr>
              <tr>
                <td colSpan={11}>
                  <div className="title-in-report  text-left">
                    {" "}
                    Rule / General Circular / Safety Bulletin of the Week <small>(See schedule - check off)</small> <br />
                    <small>
                      Tip: 1st workday, to be reviewed in its entirety with crew. Thereafter, review a smaller section of information each
                      day.{" "}
                    </small>
                  </div>
                </td>
                <td colSpan={1}>{data.yes2 && "Yes"}</td>
              </tr>
              <tr>
                <td colSpan={5}>
                  <div className="title-in-report text-left">
                    Signal Maintainer Required? <br /> <small>(if so, name and contact info otherwise strike through)</small>
                  </div>
                </td>
                <td colSpan={3}>{data.na ? "N/A" : data.trname}</td>
                <td colSpan={4}>{data.tocontin}</td>
              </tr>
            </tbody>
          </table>
          <table className="table-bordered values-circle ">
            <tbody>
              <tr>
                <td colSpan={10}>
                  <span className="title-in-report">Hand / Power Tools Required and Inspected</span> <small>(circle)</small>
                </td>
                <td colSpan={2}>
                  <span className={data.adze ? "selection-char active" : "selection-char"}>{tick_char}</span>Adze
                </td>
                <td colSpan={2}>
                  <span className={data.bblow ? "selection-char active" : "selection-char"}>{tick_char}</span>Backpack Blower
                </td>
                <td colSpan={2}>
                  <span className={data.bsaw ? "selection-char active" : "selection-char"}>{tick_char}</span>Brush Saw
                </td>
                <td colSpan={2}>
                  <span className={data.csaw ? "selection-char active" : "selection-char"}>{tick_char}</span>Chain Saw
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <span className={data.cbar ? "selection-char active" : "selection-char"}>{tick_char}</span>Claw Bar
                </td>
                <td colSpan={2}>
                  <span className={data.dpins ? "selection-char active" : "selection-char"}>{tick_char}</span>Drift Pins
                </td>
                <td colSpan={2}>
                  <span className={data.htamp ? "selection-char active" : "selection-char"}>{tick_char}</span>Hand Tamper
                </td>
                <td colSpan={2}>
                  <span className={data.lboar ? "selection-char active" : "selection-char"}>{tick_char}</span>Level Board
                </td>
                <td colSpan={2}>
                  <span className={data.lbar ? "selection-char active" : "selection-char"}>{tick_char}</span>Lining Bar
                </td>
                <td colSpan={2}>
                  <span className={data.pick ? "selection-char active" : "selection-char"}>{tick_char}</span>Pick
                </td>
                <td colSpan={2}>
                  <span className={data.polo ? "selection-char active" : "selection-char"}>{tick_char}</span>Pick Pole
                </td>
                <td colSpan={2}>
                  <span className={data.pwren ? "selection-char active" : "selection-char"}>{tick_char}</span>Pipe Wrench
                </td>
                <td colSpan={2}>
                  <span className={data.pdrill ? "selection-char active" : "selection-char"}>{tick_char}</span>Plank Drill
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <span className={data.ptwre ? "selection-char active" : "selection-char"}>{tick_char}</span>Power Track Wrench
                </td>
                <td colSpan={2}>
                  <span className={data.rbend ? "selection-char active" : "selection-char"}>{tick_char}</span>Rail Bender
                </td>
                <td colSpan={2}>
                  <span className={data.rdril ? "selection-char active" : "selection-char"}>{tick_char}</span>Rail Drill
                </td>
                <td colSpan={2}>
                  <span className={data.rfork ? "selection-char active" : "selection-char"}>{tick_char}</span>Rail Fork
                </td>
                <td colSpan={2}>
                  <span className={data.rsaw ? "selection-char active" : "selection-char"}>{tick_char}</span>Rail Saw
                </td>
                <td colSpan={2}>
                  <span className={data.rtong ? "selection-char active" : "selection-char"}>{tick_char}</span>Rail Tongs
                </td>
                <td colSpan={2}>
                  <span className={data.rake ? "selection-char active" : "selection-char"}>{tick_char}</span>Rake
                </td>
                <td colSpan={2}>
                  <span className={data.shame ? "selection-char active" : "selection-char"}>{tick_char}</span>Sledge Hammer
                </td>
                <td colSpan={2}>
                  <span className={data.snowsho ? "selection-char active" : "selection-char"}>{tick_char}</span>Snow Shovel
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <span className={data.spike ? "selection-char active" : "selection-char"}>{tick_char}</span>Spike Maul
                </td>
                <td colSpan={2}>
                  <span className={data.spikepul ? "selection-char active" : "selection-char"}>{tick_char}</span>Spike Puller
                </td>
                <td colSpan={2}>
                  <span className={data.spikestar ? "selection-char active" : "selection-char"}>{tick_char}</span>Spike Starter
                </td>
                <td colSpan={2}>
                  <span className={data.broom ? "selection-char active" : "selection-char"}>{tick_char}</span>Switch Brooms
                </td>
                <td colSpan={2}>
                  <span className={data.tampbar ? "selection-char active" : "selection-char"}>{tick_char}</span>Tamping Bar
                </td>
                <td colSpan={2}>
                  <span className={data.tppug ? "selection-char active" : "selection-char"}>{tick_char}</span>Tie Plug Punch
                </td>
                <td colSpan={2}>
                  <span className={data.ttong ? "selection-char active" : "selection-char"}>{tick_char}</span>Tie Tongs
                </td>
                <td colSpan={2}>
                  <span className={data.tom ? "selection-char active" : "selection-char"}>{tick_char}</span>Tommy Bar
                </td>
                <td colSpan={2}>
                  <span className={data.chisel ? "selection-char active" : "selection-char"}>{tick_char}</span>Track Chisel
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <span className={data.tgage ? "selection-char active" : "selection-char"}>{tick_char}</span>Track Gauge
                </td>
                <td colSpan={2}>
                  <span className={data.tjack ? "selection-char active" : "selection-char"}>{tick_char}</span>Track Jack
                </td>
                <td colSpan={2}>
                  <span className={data.tshov ? "selection-char active" : "selection-char"}>{tick_char}</span>Track Shovel
                </td>
                <td colSpan={2}>
                  <span className={data.tren ? "selection-char active" : "selection-char"}>{tick_char}</span>Track Wrench
                </td>
                <td colSpan={5}>
                  <span className={data.mmeter ? "selection-char active" : "selection-char"}>{tick_char}</span>Signals Multi-Meter
                </td>
                <td colSpan={5}>
                  <span className={data.handtol ? "selection-char active" : "selection-char"}>{tick_char}</span>Small Hand Tools
                </td>
              </tr>
              <tr>
                <td colSpan={6}></td>
                <td colSpan={6}></td>
                <td colSpan={6}></td>
              </tr>
              <tr>
                <td colSpan={6}>
                  <span className="title-in-report">Pre-Trip Inspection Completed?</span>
                </td>
                <td colSpan={3}>{data.inspecomp}</td>
                <td colSpan={9}>{data.inspecomp === "No" && data.open2 ? data.open2 : ""}</td>
              </tr>
            </tbody>
          </table>
          <table className="table-bordered table-bordered">
            <thead>
              <tr>
                <td colSpan={20} className="dark-bg">
                  {data.na3 && <span className="haeading-na"> ( N/A ) </span>}

                  <span className={data.na3 ? "main-heading-in-rpt na" : "main-heading-in-rpt"}>DISTANCE TO STOP TEST(S)</span>
                  <br />
                  <small>
                    This must be performed by all hi-rail and work equipment the first time you track travel each day and when rail
                    conditions changes.
                  </small>
                </td>
              </tr>
              <tr>
                <th colSpan={2}>Unit#</th>
                <th colSpan={5}>Location</th>
                <th colSpan={1}>Time</th>
                <th colSpan={2}>Speed</th>
                <th colSpan={5}>Distance to Stop</th>
                <th colSpan={5}>Rail Condition</th>
              </tr>
            </thead>
            <tbody>
              {tbltest}
              {addEmptyColsIfNotEnough(tbltest, this.config.minRows, 1)}
            </tbody>
          </table>
        </div>

        <div
          className="table-report job-briefing-ontario risk-assessment"
          style={{ ...themeService(trackReportStyle.mainStyle), pageBreakAfter: "always" }}
        >
          <Row>
            <Col md={2}>
              <img src={themeService(iconToShow)} alt="Logo" style={{ width: "100%" }} />
            </Col>
            <Col md={3}></Col>
            <Col md={7}>
              <h2 style={{ ...themeService(trackReportStyle.headingStyle), textAlign: "right" }}>
                {"RAIL INFRASTRUCTURE"} <br /> {"JOB BRIEFING"}
              </h2>
            </Col>
          </Row>
          <hr />
          <table className="table-bordered background-dark values-circle" style={{ marginBottom: "0" }}>
            <thead>
              <tr>
                <td colSpan={3} className="dark-bg">
                  <span className="main-heading-in-rpt">FIELD LEVEL RISK ASSESSMENT</span>
                </td>
              </tr>
              <tr>
                <td colSpan={3}>
                  <h5> HAZARD EXAMPLES</h5>
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <span className={data.access ? "selection-char active" : "selection-char"}>{tick_char}</span>Access / Egress
                </td>
                <td>
                  <span className={data.heavy ? "selection-char active" : "selection-char"}>{tick_char}</span>Heavy Lifting / Material
                  Handling
                </td>
                <td>
                  <span className={data.sharp ? "selection-char active" : "selection-char"}>{tick_char}</span>Sharp Surfaces
                </td>
              </tr>
              <tr>
                <td>
                  <span className={data.anime ? "selection-char active" : "selection-char"}>{tick_char}</span>Animals / Insects
                </td>
                <td>
                  <span className={data.ice ? "selection-char active" : "selection-char"}>{tick_char}</span>Ice
                </td>
                <td>
                  <span className={data.sightline ? "selection-char active" : "selection-char"}>{tick_char}</span>Sightlines
                </td>
              </tr>
              <tr>
                <td>
                  <span className={data.postma ? "selection-char active" : "selection-char"}>{tick_char}</span>Awkward Positions
                  (ergonomics)
                </td>
                <td>
                  <span className={data.inexp ? "selection-char active" : "selection-char"}>{tick_char}</span> Inexperienced Workers
                </td>
                <td>
                  <span className={data.stfa ? "selection-char active" : "selection-char"}>{tick_char}</span>Slips / Trips / Falls
                </td>
              </tr>
              <tr>
                <td>
                  <span className={data.chem ? "selection-char active" : "selection-char"}>{tick_char}</span>Chemicals
                </td>
                <td>
                  <span className={data.wlone ? "selection-char active" : "selection-char"}>{tick_char}</span>Lone Worker
                </td>
                <td>
                  <span className={data.sturckb ? "selection-char active" : "selection-char"}>{tick_char}</span>Struck By / Against
                </td>
              </tr>
              <tr>
                <td>
                  <span className={data.cranesr ? "selection-char active" : "selection-char"}>{tick_char}</span>Cranes / Rigging
                </td>
                <td>
                  <span className={data.mobic ? "selection-char active" : "selection-char"}>{tick_char}</span>Mobile Equipment
                </td>
                <td>
                  <span className={data.sfail ? "selection-char active" : "selection-char"}>{tick_char}</span>Structural Failure
                </td>
              </tr>
              <tr>
                <td>
                  <span className={data.dehyd ? "selection-char active" : "selection-char"}>{tick_char}</span>Dehydration
                </td>
                <td>
                  <span className={data.wnight ? "selection-char active" : "selection-char"}>{tick_char}</span>Night Work
                </td>
                <td>
                  <span className={data.train ? "selection-char active" : "selection-char"}>{tick_char}</span>Train(s)
                </td>
              </tr>
              <tr>
                <td>
                  <span className={data.dust ? "selection-char active" : "selection-char"}>{tick_char}</span>Dust / Flying Particles
                </td>
                <td>
                  <span className={data.noise ? "selection-char active" : "selection-char"}>{tick_char}</span>Noise Obstructions
                </td>
                <td>
                  <span className={data.underg ? "selection-char active" : "selection-char"}>{tick_char}</span>Underground Utilities
                </td>
              </tr>
              <tr>
                <td>
                  <span className={data.electuc ? "selection-char active" : "selection-char"}>{data.electuc && tick_char}</span>
                  Electrocution
                </td>
                <td>
                  <span className={data.access ? "selection-char active" : "selection-char"}>{data.hopen && tick_char}</span>Open Holes
                </td>
                <td>
                  <span className={data.hopen ? "selection-char active" : "selection-char"}>{data.uneven && tick_char}</span>Uneven Surfaces
                  / Rough Terrain
                </td>
              </tr>
              <tr>
                <td>
                  <span className={data.blind ? "selection-char active" : "selection-char"}>{data.blind && tick_char}</span>Equipment Blind
                  Spots
                </td>
                <td>
                  <span className={data.wgrop ? "selection-char active" : "selection-char"}>{data.wgrop && tick_char}</span>Other Work
                  Groups
                </td>
                <td>
                  <span className={data.uvexpo ? "selection-char active" : "selection-char"}>{data.uvexpo && tick_char}</span>UV Exposure
                </td>
              </tr>
              <tr>
                <td>
                  <span className={data.fobj ? "selection-char active" : "selection-char"}>{data.fobj && tick_char}</span>Falling Objects
                </td>
                <td>
                  <span className={data.overhead ? "selection-char active" : "selection-char"}>{data.overhead && tick_char}</span>Overhead
                  Power Lines
                </td>
                <td>
                  <span className={data.vibra ? "selection-char active" : "selection-char"}>{data.vibra && tick_char}</span>Vibration
                </td>
              </tr>
              <tr>
                <td>
                  <span className={data.fatik ? "selection-char active" : "selection-char"}>{data.fatik && tick_char}</span>Fatigue
                </td>
                <td>
                  <span className={data.pinch ? "selection-char active" : "selection-char"}>{data.pinch && tick_char}</span>Pinch Points{" "}
                </td>
                <td>
                  <span className={data.weath ? "selection-char active" : "selection-char"}>{data.weath && tick_char}</span>Weather
                </td>
              </tr>
              <tr>
                <td>
                  <span className={data.fire45 ? "selection-char active" : "selection-char"}>{data.fire45 && tick_char}</span>Fire{" "}
                </td>
                <td>
                  <span className={data.puninta ? "selection-char active" : "selection-char"}>{data.puninta && tick_char}</span>Public
                  Interaction{" "}
                </td>
                <td>
                  <span className={data.heiwor ? "selection-char active" : "selection-char"}>{data.heiwor && tick_char}</span>Working at
                  Heights
                </td>
              </tr>
              <tr>
                <td>
                  <span className={data.hazmat ? "selection-char active" : "selection-char"}>{data.hazmat && tick_char}</span>Hazardous
                  Materials{" "}
                </td>
                <td>
                  <span className={data.remoloc ? "selection-char active" : "selection-char"}>{data.remoloc && tick_char}</span>Remote
                  Location{" "}
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
          <table className="table-bordered background-light values-circle" style={{ marginBottom: "0" }}>
            <thead>
              <tr>
                <td colSpan={3}>CONTROLS / PPE EXAMPLES</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {" "}
                  <span className={data.travel5 ? "selection-char active" : "selection-char"}>{data.travel5 && tick_char}</span>500’
                  Travelling Distance{" "}
                </td>
                <td>
                  {" "}
                  <span className={data.signage ? "selection-char active" : "selection-char"}>{data.signage && tick_char}</span>Flags /
                  Signage{" "}
                </td>
                <td>
                  {" "}
                  <span className={data.warmup ? "selection-char active" : "selection-char"}>{data.warmup && tick_char}</span>Stretching /
                  Warm-Up Excercies
                </td>
              </tr>
              <tr>
                <td>
                  {" "}
                  <span className={data.wspace ? "selection-char active" : "selection-char"}>{data.wspace && tick_char}</span>40’ Work Space
                </td>
                <td>
                  {" "}
                  <span className={data.jobrif ? "selection-char active" : "selection-char"}>{data.jobrif && tick_char}</span>Job Briefing
                  w/ RTC or Foreman <br />
                  (complete “Lone Worker” form if Hazard 18)
                </td>
                <td>
                  {" "}
                  <span className={data.stob ? "selection-char active" : "selection-char"}>{data.stob && tick_char}</span>Substitute the
                  Object
                </td>
              </tr>
              <tr>
                <td>
                  {" "}
                  <span className={data.cpoint ? "selection-char active" : "selection-char"}>{data.cpoint && tick_char}</span>3-Point
                  Contact
                </td>
                <td>
                  {" "}
                  <span className={data.locates ? "selection-char active" : "selection-char"}>{data.locates && tick_char}</span>Locates
                </td>
                <td>
                  {" "}
                  <span className={data.tc900 ? "selection-char active" : "selection-char"}>{data.tc900 && tick_char}</span>Traffic Control
                </td>
              </tr>
              <tr>
                <td>
                  {" "}
                  <span className={data.adev ? "selection-char active" : "selection-char"}>{data.adev && tick_char}</span>Aerial Devices
                </td>
                <td>
                  {" "}
                  <span className={data.ppp410 ? "selection-char active" : "selection-char"}>{data.ppp410 && tick_char}</span>Policies /
                  Procedures / Practices
                </td>
                <td>
                  {" "}
                  <span className={data.tedu ? "selection-char active" : "selection-char"}>{data.tedu && tick_char}</span>Training /
                  Education
                </td>
              </tr>
              <tr>
                <td>
                  {" "}
                  <span className={data.bguard ? "selection-char active" : "selection-char"}>{data.bguard && tick_char}</span>Barriers /
                  Guards / Covers
                </td>
                <td>
                  {" "}
                  <span className={data.pro841 ? "selection-char active" : "selection-char"}>{data.pro841 && tick_char}</span>Protection
                  (OCS, 841){" "}
                </td>
                <td>
                  {" "}
                  <span className={data.trvwacz ? "selection-char active" : "selection-char"}>{data.trvwacz && tick_char}</span>Travel
                  Restraint
                </td>
              </tr>
              <tr>
                <td>
                  {" "}
                  <span className={data.bumpcap ? "selection-char active" : "selection-char"}>{data.bumpcap && tick_char}</span>Bump Cap /
                  Hard Hat
                </td>
                <td>
                  {" "}
                  <span className={data.pglow ? "selection-char active" : "selection-char"}>{data.pglow && tick_char}</span>Protective
                  Gloves
                </td>
                <td>
                  {" "}
                  <span className={data.ventil ? "selection-char active" : "selection-char"}>{data.ventil && tick_char}</span>Ventilation
                </td>
              </tr>
              <tr>
                <td>
                  {" "}
                  <span className={data.inspequ ? "selection-char active" : "selection-char"}>{data.inspequ && tick_char}</span>Equipment
                  Inspection
                </td>
                <td>
                  {" "}
                  <span className={data.radiocom ? "selection-char active" : "selection-char"}>{data.radiocom && tick_char}</span>Radio
                  Communication
                </td>
                <td>
                  {" "}
                  <span className={data.wacaz ? "selection-char active" : "selection-char"}>{data.wacaz && tick_char}</span>Work Area
                  Control Zone
                </td>
              </tr>
              <tr>
                <td>
                  {" "}
                  <span className={data.eyeprot ? "selection-char active" : "selection-char"}>{data.eyeprot && tick_char}</span>Eye
                  Protection
                </td>
                <td>
                  {" "}
                  <span className={data.spoter ? "selection-char active" : "selection-char"}>{data.spoter && tick_char}</span>Safety Watch /
                  Spotter (complete “Safety Watch” form)
                </td>
                <td>
                  {" "}
                  <span className={data.wagah ? "selection-char active" : "selection-char"}>{data.wagah && tick_char}</span>Work on Ground
                  vs. At Heights
                </td>
              </tr>
              <tr>
                <td>
                  {" "}
                  <span className={data.fprevt ? "selection-char active" : "selection-char"}>{data.fprevt && tick_char}</span>Fire
                  Prevention / Suppression Equipment{" "}
                </td>
                <td>
                  {" "}
                  <span className={data.sinspe ? "selection-char active" : "selection-char"}>{data.sinspe && tick_char}</span> Site
                  Inspection
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
          <table className="table-bordered">
            <thead>
              <tr>
                <td colSpan={21} className="dark-bg">
                  {data.na5 && <span className="haeading-na"> ( N/A ) </span>}
                  <span className={data.na5 ? "main-heading-in-rpt na" : "main-heading-in-rpt"}>
                    INDUSTRIAL OPERATIONS PROTOCOL <small>(during fire season)</small>
                  </span>
                  <br />
                  <small>See “Steps to Work with the Industrial Operations Protocol” at back of booklet</small>
                </td>
              </tr>
              <tr>
                <th colSpan={4}>Description of Operation</th>
                <th colSpan={5}>Equipment Required</th>
                <th colSpan={2}>
                  Stoniness <br />
                  <small></small>
                </th>
                <th colSpan={2}>
                  Fire Risk <br />
                  <small></small>{" "}
                </th>
                <th colSpan={2}>
                  Fuel Group <br />
                  <small>(+/- modifier)</small>
                </th>
                <th colSpan={2}>
                  Fire Intensity <br />
                  Code
                  <small></small>
                </th>
                <th colSpan={2}>
                  NOT Trained <br />& Capable{" "}
                </th>
                <th colSpan={2}>
                  Trained & <br />
                  Capable
                </th>
              </tr>
            </thead>
            <tbody>
              {tbliop}
              {addEmptyColsIfNotEnough(tbliop, 4, 2)}
              <tr>
                <td colSpan={21} style={{ textAlign: "left" }}>
                  <span className="signature-heading-in-table">Crew Signatures: </span>
                  <p style={{ minHeight: "100px" }}> {renderSignatures(this.props.workers)}</p>
                </td>
              </tr>
            </tbody>
          </table>
          <table>
            <thead>
              <tr>
                <td colSpan={19} className="dark-bg">
                  <span className="main-heading-in-rpt">
                    DEBRIEFING<small> (to be conducted at end of each work days – check off and complete) </small>
                  </span>
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={9}>
                  <div className="title-in-report text-left">
                    Has the work area been cleaned up, tools inspected after use and stored properly?{" "}
                  </div>
                </td>
                <td colSpan={1}> {data.hwbcp === "Yes"}</td>
                <td colSpan={9}>
                  <div className="text-left pd-left-10px">{data.hwbcp === "No" && data.open5 ? data.open5 : ""}</div>

                </td>
              </tr>
              <tr>
                <td colSpan={9}>
                  <div className="title-in-report text-left">Have all switches been restored to normal</div>
                </td>
                <td colSpan={1}> {data.hasrn === "Yes"}</td>
                <td colSpan={9}>
                  <div className="text-left pd-left-10px">{data.hasrn === "No" && data.open6 ? data.open6 : ""}</div>
                </td>
              </tr>
              <tr>
                <td colSpan={9}>
                  <div className="title-in-report text-left">Notes / Planning / Signal Maintainer Required Next Day? / Improvements / </div>
                </td>
                <td colSpan={10}>
                  <div className="text-left pd-left-10px">{data.pnotes}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </React.Fragment>
    );
  }
}
export default JobBriefingOntario;

function addEmptyColsIfNotEnough(mapArray = [], minRows, type) {
  let emptyRows = null;
  let mapArrayLength = mapArray ? mapArray.length : 0;
  let countToAdd = minRows - mapArrayLength;

  if (countToAdd > 0) {
    emptyRows = [];
    for (let i = 0; i < countToAdd; i++) {
      let row = <tr>{getCols(type)}</tr>;
      emptyRows.push(row);
    }
  }

  return emptyRows;
}
function getCols(type) {
  let cols = [];
  let span = [];
  if (type == 2) span = [4, 5, 2, 2, 2, 2, 2, 2];
  else span = [2, 5, 1, 2, 5, 5];
  for (let i = 0; i < span.length; i++) {
    cols.push(<td colSpan={span[i]}></td>);
  }
  return cols;
}

function getActiveCheckBox(data, field) {
  return data && data[field] ? "active" : "";
}

function matchValueActiveClass(data, field, matchField) {
  return data && data[field] === matchField ? " active" : "";
}

function getTabletbltest(tbltest) {
  let toRet = null;
  if (tbltest && tbltest.length > 0) {
    toRet = tbltest.map((tbltestObj) => {
      return (
        <tr className="small-font">
          <td colSpan={2}>
            <small>{tbltestObj.unitno}</small>
          </td>
          <td colSpan={5}>
            <small>{tbltestObj.loco}</small>
          </td>
          <td colSpan={1}>
            <small>{tbltestObj.timo}</small>
          </td>
          <td colSpan={2}>
            <small>{tbltestObj.speedo}</small>
          </td>
          <td colSpan={5}>
            <small>{tbltestObj.dts}</small>
          </td>
          <td colSpan={5}>
            <small>{tbltestObj.rcond}</small>
          </td>
        </tr>
      );
    });
  }
  return toRet;
}

function getTabletbliop(tbliop) {
  let toRet = null;
  if (tbliop && tbliop.length > 0) {
    toRet = tbliop.map((tbliopObj) => {
      return (
        <tr>
          <td colSpan={4}>{tbliopObj.doper}</td>
          <td colSpan={5}>{tbliopObj.reqequi}</td>
          <td colSpan={2}>{tbliopObj.stonin}</td>
          <td colSpan={2}>{tbliopObj.frisk}</td>
          <td colSpan={2}>{tbliopObj.fuel}</td>
          <td colSpan={2}>{tbliopObj.fic}</td>
          <td colSpan={2}>{tbliopObj.ntac}</td>
          <td colSpan={2}>{tbliopObj.taco}</td>
        </tr>
      );
    });
  }
  return toRet;
}

function renderSignatures(workersObjs) {
  let workers = workersObjs ? workersObjs : [];
  let toRet = null;
  if (workers.length > 0) {
    toRet = workers.map((worker) => {
      if (worker.signature) {
        return <SignatureImage signatureImage={worker.signature.imgName} userName={worker.name} />;
      } else return null;
    });
  }
  return <div className="multi-signatures">{toRet}</div>;
}
