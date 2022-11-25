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



const structureConditionOptions = ["GOOD", "FAIR", "POOR"]
const yesNoOptions = ["YES", "NO", ""]



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



const KeyValBox = ({ title, id, data, style, valBackground, titWidthPerc, minHeight }) => {

    let titleInlineStyle = {};
    titWidthPerc && (titleInlineStyle.flex = `1 1 ${titWidthPerc}%`);
    let valInlineStyle = {};
    titWidthPerc && (valInlineStyle.flex = `1 1 ${100 - titWidthPerc}%`);
    valBackground && (valInlineStyle.backgroundColor = valBackground);
    minHeight && (valInlineStyle.minHeight= minHeight)

    return <div className="key-val-box" style={style ? style : {}}>
        <div className="title" style={titleInlineStyle}>{title !== "" ? `${title}:` : title}</div>
        <div className="value" style={valInlineStyle}>{data[id]}</div>
    </div >
}


const DataPropertyRow = ({ title, id, data, options, titleStyle }) => {
    let titleInlineStyle = { fontWeight: 600, flexGrow: 2 };
    titleStyle && (titleInlineStyle = { ...titleInlineStyle, ...titleStyle })
    return <EqualContentsRow>
        <div style={titleInlineStyle}>{title}</div>
        {options.map(val => val === '' ? <div></div> : <TickBox flag={data[id] === val} label={val} />)}
    </EqualContentsRow>
}


const ReportView = (props) => {
    let data = props.data ? props.data : {};
    let reportData = {}
    data.neq = "OBSTRUCTED";

  
    return (
        <div id="mainContent" className="table-report" style={{ ...themeService(switchReportStyle.mainStyle), pageBreakAfter: "always" }}>
            <ReportTitleSection title={`Detailed Crossing Report`} hideLogo={true}/>
            <ReportInfoSection
                rows={[
                    {
                        col1: {
                            title: "Subdivision",
                            value: reportData.location,
                        },
                        col2: {
                            title: "Milepost",
                            value: reportData.milepost,
                        },
                    },
                    {
                        col1: {
                            title: "Location",
                            value: reportData.location,
                        },
                        col2: {
                            title: "Date",
                            value: dataFormatters.dateFormatter(reportData.date),
                        },
                    },
                ]}
            />

            <EqualContentsRow>
                <KeyValBox title={"Crossing Type"} data={data} id={"reportedBy"} />
                <KeyValBox title={"Rail Weight"} data={data} id={"date"} />
                <KeyValBox title={"Asphalt Width"} data={data} id={"time"} />
            </EqualContentsRow>

            <EqualContentsRow>
                <KeyValBox title={"# Ties"} data={data} id={"reportedBy"} />
                <KeyValBox title={"Crossing Protection"} data={data} id={"date"} />
                <KeyValBox title={"Rail Length"} data={data} id={"time"} />
            </EqualContentsRow>

            <EqualContentsRow>
                <KeyValBox title={"Asphalt Length"} data={data} id={"reportedBy"} />
                <KeyValBox title={"# Tie Plates"} data={data} id={"date"} />
                <KeyValBox title={"Construction Date"} data={data} id={"time"} />
            </EqualContentsRow>

            <EqualContentsRow>
                <KeyValBox title={"Rail Offset Length"} data={data} id={"reportedBy"} />
                <KeyValBox title={"Inner Poly Length"} data={data} id={"date"} />
                <KeyValBox title={"Poly Length"} data={data} id={"time"} />
            </EqualContentsRow>

            <SectionHeader title={'Inspection Items'} />
            <EqualContentsRow>
                <KeyValBox title={"Gauge Measurement at Widest Point"} data={data} id={"reportedBy"} titWidthPerc={40} />
            </EqualContentsRow>

            <DataPropertyRow title={"Track Deflection or Movement?"} id={"neq"} data={data} options={yesNoOptions} titleStyle= {{textAlign: "right",fontSize:"20px"}}/>
            <EqualContentsRow>
                <KeyValBox title={"Comments"} data={data} id={"reportedBy"} titWidthPerc={40} minHeight={"75px"}/>
            </EqualContentsRow>
            <DataPropertyRow title={"Surface Condition"} id={"neq"} data={data} options={structureConditionOptions} titleStyle= {{textAlign: "right",fontSize:"20px"}}/>
            <EqualContentsRow>
                <KeyValBox title={"Comments"} data={data} id={"reportedBy"} titWidthPerc={40} minHeight={"75px"}/>
            </EqualContentsRow>
            <DataPropertyRow title={"Sidewalk Condition"} id={"neq"} data={data} options={structureConditionOptions} titleStyle= {{textAlign: "right",fontSize:"20px"}}/>
            <EqualContentsRow>
                <KeyValBox title={"Comments"} data={data} id={"reportedBy"} titWidthPerc={40} minHeight={"75px"}/>
            </EqualContentsRow>
            <DataPropertyRow title={"Rail Conditions"} id={"neq"} data={data} options={structureConditionOptions} titleStyle= {{textAlign: "right",fontSize:"20px"}}/>
            <EqualContentsRow>
                <KeyValBox title={"Comments"} data={data} id={"reportedBy"} titWidthPerc={40} minHeight={"75px"}/>
            </EqualContentsRow>
            <DataPropertyRow title={"Flangeway Conditions"} id={"neq"} data={data} options={structureConditionOptions} titleStyle= {{textAlign: "right",fontSize:"20px"}}/>
            <EqualContentsRow>
                <KeyValBox title={"Comments"} data={data} id={"reportedBy"} titWidthPerc={40} minHeight={"75px"}/>
            </EqualContentsRow>
            <DataPropertyRow title={"Have Flangeways been cleaned?"} id={"neq"} data={data} options={yesNoOptions} titleStyle= {{textAlign: "right",fontSize:"20px"}}/>










        </div>
    );
};

const ETR_DetailedCrossingReport = (props) => <ReportView {...props} />

export default ETR_DetailedCrossingReport;
