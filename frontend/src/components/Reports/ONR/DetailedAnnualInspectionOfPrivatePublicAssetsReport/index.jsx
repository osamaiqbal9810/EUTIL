import React, { Component, Fragment } from "react";
import { getAllowedSwitches } from "../../../../AssetTypeConfig/Reports/SwitchinspectionReport";
import { ReportGeneratorUtils } from "../../utils/reportGeneratorUtils";
import { switchReportStyle } from "../../Timps/Switch/style/index";
import { themeService } from "../../../../theme/service/activeTheme.service";
import _ from "lodash";
import ReportTitleSection from "../../../../libraries/ReportGenerator/ReportTitleSection";
import { tick_char } from "../../../jobBriefing/JobBrieifingReport/special-char";
import { dataFormatters } from "../../../../utils/dataFormatters";
import ReportInfoSection from "../../../../libraries/ReportGenerator/ReportInfoSection";

const crossingTypesList = ['TIMBER', 'TIMBER W/ MUD RAIL', 'PAVED W/ RUBBER FW', 'PAVED W/ MUD RAIL', 'GRAVEL', 'GRAVEL W/ MUD RAIL', 'CONCRETE', 'TIES', 'STEEL RAIL', 'FULL DEPTH RUBBER', 'TIES W/ MUD RAIL', 'OTHER']

const sightLinesOptions = ["CLEAR", "OBSTRUCTED", "BRUSH", "OTHER"]
const structureConditionOptions = ["EXCELLENT", "GOOD", "FAIR", "POOR"]
const mudrailTypeOptions = ["STEEL", "RUBBER", "NONE", ""]
const flangewayConditionOptions = ["CLEAR", "CLOGGED", "", ""]
const guageMeasurementOptions = ['56 ½"', 'OTHER', '', '']
const yesNoOptions = ["YES", "NO", "", ""]
const signageConditionOptions = ["GOOD", "DAMAGED", "MISSING", "N/A"]


const TickBox = ({ flag, label, style }) => {
    return <div className="custom-tick-box" style={style ? style : {}}>
        <span className="custom-tick-box-check"> {flag ? tick_char : ''} </span>
        <span className="custom-tick-box-label">{label}</span>
    </div>
}


const SectionHeader = ({ title }) => {
    return <div style={{ borderTop: '2px solid', padding: '5px', textAlign: 'center', fontSize: '25px', fontWeight: 600 }}>
        {title}
    </div>
}

const EqualContentsRow = ({ children }) => {
    return <div class={'report-equal-contents-row'}>
        {children}
    </div>
}

const EqualContentJustfy = ({ children }) => {
    return <div class={'report-equal-contents-justify'}>
        {children}
    </div>
}

const DataPropertyRow = ({ title, id, data, options }) => {
    return <EqualContentsRow>
        <div style={{ fontWeight: 600, flexGrow: 2 }}>{title}</div>
        {options.map(val => val === '' ? <div></div> : <TickBox flag={data[id] === val} label={val} />)}
    </EqualContentsRow>
}


const ReportView = (props) => {
    let data = props.data ? props.data : {};
    let reportData = {}
    data.neq = "OBSTRUCTED";
    // todo: read from props
    let assetType = "Crossings";
    return (
        <div id="mainContent" className="table-report" style={{ ...themeService(switchReportStyle.mainStyle), pageBreakAfter: "always" }}>
            <ReportTitleSection title={`Annual Inspection of Private or Public ${assetType} (DETAILED)`} hideLogo={true} displayRevisedAreaText={'Revised: October 14, 2021'} />
            <ReportInfoSection
                rows={[
                    {
                        col1: {
                            title: "INSPECTION DATE",
                            value: dataFormatters.dateFormatter(reportData.date),

                        },
                        col2: {
                            title: "TRACK INSPECTOR",
                            value: reportData.user && reportData.user.name,
                        },
                    },
                    {
                        col1: {
                            title: "MILEAGE",
                            value: reportData.milepost,
                        },
                        col2: {
                            title: "SUBDIVISION",
                            value: reportData.location,

                        },
                    },
                ]}
            />

            <SectionHeader title={'GENERAL INFORMATION'} />
            <EqualContentsRow>
                <div style={{ fontWeight: 600 }}>CROSSING DESIGNATION</div>
                <TickBox flag={true} label={'PUBLIC'} />
                <TickBox flag={true} label={'PRIVATE'} />
                <div></div>
            </EqualContentsRow>
            <EqualContentsRow>
                <div style={{ fontWeight: 600 }}>CROSSING PROTECTION</div>
                <TickBox flag={true} label={'LIGHTS'} />
                <TickBox flag={true} label={'CROSSBUCKS'} />
                <div></div>
            </EqualContentsRow>
            <SectionHeader title={'CROSSING TYPE'} />
            <EqualContentJustfy>
                {crossingTypesList.map(val => <TickBox flag={true} label={val} style={{ flex: '1 0 21%' }} />)}
            </EqualContentJustfy>


            <SectionHeader title={'SIGHTLINES'} />

            <DataPropertyRow title={"NORTH-EAST QUADRANT"} id={"neq"} data={data} options={sightLinesOptions} />
            <DataPropertyRow title={"NORTH-WEST QUADRANT"} id={"nwq"} data={data} options={sightLinesOptions} />
            <DataPropertyRow title={"SOUTH-EAST QUADRANT"} id={"seq"} data={data} options={sightLinesOptions} />
            <DataPropertyRow title={"SOUTH-WEST QUADRANT"} id={"swq"} data={data} options={sightLinesOptions} />

            <SectionHeader title={'STRUCTURE'} />
            <DataPropertyRow title={"MUDRAIL TYPE"} id={"mdt"} data={data} options={mudrailTypeOptions} />
            <DataPropertyRow title={"MUDRAIL CONDITION"} id={"mdc"} data={data} options={structureConditionOptions} />
            <DataPropertyRow title={"FLANGEWAY CONDITION"} id={"fwc"} data={data} options={flangewayConditionOptions} />
            <DataPropertyRow title={"BALLAST & DRAINAGE"} id={"bad"} data={data} options={structureConditionOptions} />
            <DataPropertyRow title={"LINE CONDITION"} id={"lc"} data={data} options={structureConditionOptions} />
            <DataPropertyRow title={"SURFACE CONDITION"} id={"sc"} data={data} options={structureConditionOptions} />
            <DataPropertyRow title={"TIE CONDITION"} id={"tc"} data={data} options={structureConditionOptions} />
            <DataPropertyRow title={"RAIL CONDITION"} id={"rc"} data={data} options={structureConditionOptions} />
            <DataPropertyRow title={"GAUGE MEASUREMENTS"} id={"ijc"} data={data} options={guageMeasurementOptions} />
            <DataPropertyRow title={"INSULATED JOINT CONDITION"} id={"ijc"} data={data} options={structureConditionOptions} />
            <DataPropertyRow title={"ROAD APPROACHES"} id={"ra"} data={data} options={structureConditionOptions} />

            <SectionHeader title={'SIGNAGE'} />
            <DataPropertyRow title={"MILEAGE IDENTIFIED AT CROSSING"} id={"ra"} data={data} options={yesNoOptions} />
            <DataPropertyRow title={"CROSSBUCK CONDITION"} id={"ra"} data={data} options={signageConditionOptions} />
            <DataPropertyRow title={"# OF TRACKS CONDITION"} id={"ra"} data={data} options={signageConditionOptions} />
            <DataPropertyRow title={"REFLECTIVE TAPE"} id={"ra"} data={data} options={signageConditionOptions} />
            <DataPropertyRow title={"ENS CONDITION"} id={"ra"} data={data} options={signageConditionOptions} />
            <DataPropertyRow title={"STOP SIGN CONDITION"} id={"ra"} data={data} options={signageConditionOptions} />
            <DataPropertyRow title={"FLANGER MARKERS"} id={"ra"} data={data} options={signageConditionOptions} />
            <DataPropertyRow title={"WHISTLE POST"} id={"ra"} data={data} options={signageConditionOptions} />

            <SectionHeader title={'COMMENTS'} />

            <div style={{ border: '2px solid', padding: '5px', fontSize: '13px', height: '100px' }}>
                {data.comments}
            </div>


        </div>
    );
};

const ONR_DetailedAnnualInspectionOfPrivatePublicAssetsReport = (props) => <ReportView {...props} />

export default ONR_DetailedAnnualInspectionOfPrivatePublicAssetsReport;
