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
import { SFRTA_SignalIncidentResponseRecord_MaterialSectionSchema, SFRTA_SignalIncidentResponseRecord_NotificationSectionSchema } from "./SFRTA_SignalIncidentResponseRecord_SectionsSchema";
import ReportTableSectionRenderer from "../../../../libraries/ReportGenerator";

const SectionHeader = ({ title }) => {
    return <div style={{ padding: '5px', textAlign: 'left', fontSize: '20px', fontWeight: 600 }}>
        <span style={{ borderBottom: '2px solid' }}>{title}</span>
    </div>
}

const EqualContentsRow = ({ children }) => {
    return <div class={'report-equal-contents-row'}>
        {children}
    </div>
}

const KeyValBox = ({ title, id, data, style, valBackground }) => {
    return <div className="key-val-box" style={style ? style : {}}>
        <div className="title">{`${title}:`}</div>
        <div className="value" style={valBackground ? { backgroundColor: valBackground } : {}}>{data[id]}</div>
    </div>
}

const SpecialKeyValComboBox = ({ rows, data }) => {

    const getRow = (row) => {
        const { columns, height } = row;
        return <tr style={height ? { height: height } : {}}>
            {columns.map(property => {

                const { title, titleColSpan, valId, valueColSpan } = property;
                return <Fragment>
                    <td colSpan={titleColSpan} style={{ textAlign: 'center', fontWeight: '600', paddingLeft: '5px' }}>
                        {`${title}:`}
                    </td>
                    <td colSpan={valueColSpan} style={{ textAlign: 'left' }}>
                        {data[valId]}
                    </td>
                </Fragment>
            })
            }
        </tr >
    }

    return <div style={{ padding: '0px 35px 0 0', fontSize: '20px' }}>
        <table style={{ paddingLeft: '35px', width: '100%', paddingRight: '35px' }}>
            <tbody>
                {rows.map(row => {
                    return getRow(row);
                })}
            </tbody>
        </table>
    </div>
}

const ReportView = (props) => {
    let data = props.data ? props.data : {};
    let reportData = {}
    data.neq = "OBSTRUCTED";
    // todo: read from props
    let assetType = "Crossings";
    return (
        <div id="mainContent" className="table-report" style={{ ...themeService(switchReportStyle.mainStyle), pageBreakAfter: "always" }}>
            <ReportTitleSection title={`SIGNAL INCIDENT RESPONSE RECORD`} displayRevisedAreaText={'Revised: 3/21/17 (B)'} />

            <span className="spacer"></span>

            <EqualContentsRow>
                <KeyValBox title={"RESPONDER"} data={data} id={"resp"} style={{ flexGrow: 2 }} />
                <KeyValBox title={"SIG/XNG"} data={data} id={"sigxng"} />
            </EqualContentsRow>

            <EqualContentsRow>
                <KeyValBox title={"REPORTED BY"} data={data} id={"reportedBy"} />
                <KeyValBox title={"DATE"} data={data} id={"date"} />
                <KeyValBox title={"TIME"} data={data} id={"time"} />
            </EqualContentsRow>

            <EqualContentsRow>
                <KeyValBox title={"LOCATION"} data={data} id={"loc"} />
                <KeyValBox title={"ASSET"} data={data} id={"asset"} />
                <KeyValBox title={"MP"} data={data} id={"mp"} />
            </EqualContentsRow>

            <span className="spacer"></span>
            
            <SpecialKeyValComboBox data={data} rows={[
                { columns: [{ title: 'REPORTED', valId: "updateTime", titleColSpan: 3, valueColSpan: 7 }] },
                { height: '100px', columns: [{ title: 'DESCRIPTION', valId: "updatesDes", titleColSpan: 3, valueColSpan: 17 }] }
            ]} />

            <EqualContentsRow>
                <KeyValBox title={"TIME OF ARRIVAL"} data={data} id={"toa"} style={{ flexGrow: 2 }} />
                <KeyValBox title={"RESPONSE TIME"} data={data} id={"resTime"} valBackground={'lightgray'} />
            </EqualContentsRow>
            <SectionHeader title={'NOTIFICATIONS'} />
            <div style={{ padding: '0px 35px 0px 0px' }}>
                <table className="table-bordered" style={{ width: '100%' }}>
                    <ReportTableSectionRenderer section={SFRTA_SignalIncidentResponseRecord_NotificationSectionSchema} rowsData={[]} />
                </table>
            </div>
            <SectionHeader title={'UPDATES'} />
            <SpecialKeyValComboBox data={data} rows={[
                {
                    columns: [
                        { title: 'TIME', valId: "updateTime", titleColSpan: 3, valueColSpan: 7 },
                        { title: 'BY', valId: "updateTime", titleColSpan: 3, valueColSpan: 7 }
                    ]
                },
                { height: '100px', columns: [{ title: 'DESCRIPTION', valId: "updatesDes", titleColSpan: 3, valueColSpan: 17 }] }
            ]} />
            <SpecialKeyValComboBox data={data} rows={[
                {
                    columns: [
                        { title: 'TIME CLEARED', valId: "updateTime", titleColSpan: 3, valueColSpan: 7 },
                        { title: 'BY', valId: "updateTime", titleColSpan: 3, valueColSpan: 7 }
                    ]
                },
                { height: '100px', columns: [{ title: 'DESCRIPTION', valId: "updatesDes", titleColSpan: 3, valueColSpan: 17 }] }
            ]} />
            <SpecialKeyValComboBox data={data} rows={[
                {
                    columns: [
                        { title: 'CAUSE', valId: "cause", titleColSpan: 3, valueColSpan: 7 },
                        { title: 'CORRECTION', valId: "updateTime", titleColSpan: 3, valueColSpan: 7 }
                    ]
                },
                { height: '100px', columns: [{ title: 'DESCRIPTION', valId: "updatesDes", titleColSpan: 3, valueColSpan: 17, valueAlign: 'left' }] }
            ]} />
            <EqualContentsRow>
                <KeyValBox title={"TIME REPAIRED"} data={data} id={"timeRep"} style={{ flexGrow: 2 }} />
                <KeyValBox title={"TOTAL TIME"} data={data} id={"totTime"} valBackground={'lightgray'} />
            </EqualContentsRow>
            <SectionHeader title={'MATERIALS'} />
            <div style={{ padding: '0px 35px 0px 0px' }}>
                <table className="table-bordered" style={{ width: '100%' }}>
                    <ReportTableSectionRenderer section={SFRTA_SignalIncidentResponseRecord_MaterialSectionSchema} rowsData={[]} />
                </table>
            </div>
        </div>
    );
};

const SFRTA_SignalIncidentResponseRecord = (props) => <ReportView {...props} />

export default SFRTA_SignalIncidentResponseRecord;
