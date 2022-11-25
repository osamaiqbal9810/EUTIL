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

const structureConditionOptions = ["Poor", "Fair", "Good", ""]
const yesNoOptions = ["YES", "NO", "", ""]
const derailType = ["Hinge", "Switch Point", "Sliding", "Other"]
const selectOne = ["Left Hand", "Right Hand", "Both", ""]
const secureTies = ["Spiked", "Lagged", "", ""]

const TickBox = ({ flag, label }) => {
    return <div className="custom-tick-box">
        <span className="custom-tick-box-check"> {flag ? tick_char : ''} </span>
        <span className="custom-tick-box-label">{label}</span>
    </div>
}


const SectionHeader = ({ title }) => {
    return <div style={{ padding: '5px', textAlign: 'left', fontSize: '20px', fontWeight: 600 }}>
        {title}
    </div>
}

const EqualContentsRow = ({ children }) => {
    return <div class={'report-equal-contents-row'}>
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
            <ReportTitleSection title={`Derail Inspection (Annual)`} hideLogo={true} displayRevisedAreaText={'Revised: June 1, 2010'} />
            <ReportInfoSection
                rows={[
                    {
                        col1: {
                            title: "Date",
                            value: dataFormatters.dateFormatter(reportData.date),

                        },
                        col2: {
                            title: "Inspector",
                            value: reportData.user && reportData.user.name,
                        },
                    },
                    {
                        col1: {
                            title: "Derail Location",
                            value: reportData.milepost,
                        },
                        col2: {
                            title: "Subdivision",
                            value: reportData.location,

                        },
                    },
                ]}
            />

            <span className="spacer"></span>

            <DataPropertyRow title={"Derail Type"} id={"dtype"} data={data} options={derailType} />
            <span className="spacer"></span>
            <ReportInfoSection
                rows={[
                    {
                        col1: {
                            title: "Derail Size",
                            value: data.dsize,

                        },
                        col2: {
                            title: "Lock Condition",
                            value: data.cond,
                        },
                    },

                ]}
            />
            <span className="spacer"></span>
            <DataPropertyRow title={"Select One"} id={"sone"} data={data} options={selectOne} />
            <DataPropertyRow title={"Securement to Ties"} id={"ties"} data={data} options={secureTies} />
            <DataPropertyRow title={"Tie Condition"} id={"tcond"} data={data} options={structureConditionOptions} />
            <DataPropertyRow title={"Handle on Derail"} id={"hand"} data={data} options={yesNoOptions} />
            <DataPropertyRow title={"Derail Sign"} id={"sign"} data={data} options={yesNoOptions} />
            <DataPropertyRow title={"Derail Target"} id={"targ"} data={data} options={yesNoOptions} />
            <DataPropertyRow title={"Overall Derail Condition"} id={"tcond1"} data={data} options={structureConditionOptions} />
            <SectionHeader title={'Additional Comments'} />
            <div style={{ border: '2px solid', padding: '5px', fontSize: '13px', height: '100px' }}>
                {data.com}
            </div>
        </div>
    );
};

const ONR_DerailInspectionAnnual = (props) => <ReportView {...props} />

export default ONR_DerailInspectionAnnual;
