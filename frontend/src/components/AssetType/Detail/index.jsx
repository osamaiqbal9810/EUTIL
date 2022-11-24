import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import { DateUtils } from "react-day-picker";
import { withPlus } from "react-icons-kit/entypo/withPlus";
import { ButtonCirclePlus } from "components/Common/Buttons";
import SvgIcon from "react-icons-kit";
import { guid } from "utils/UUID";
import { commonPageStyle } from "components/Common/Summary/styles/CommonPageStyle";
import { circle } from "react-icons-kit/fa/circle";
import { ic_arrow_back } from "react-icons-kit/md/ic_arrow_back";
import { Link } from "react-router-dom";
import { uploadImgs } from "reduxRelated/actions/imgsUpload.js";
import { getAppMockupsTypes } from "reduxRelated/actions/diagnosticsActions";
import { CRUDFunction } from "reduxCURD/container";
import { commonReducers } from "reduxCURD/reducer";
import { curdActions } from "reduxCURD/actions";
import { ButtonMain } from "components/Common/Buttons";
import { substractObjects } from "utils/utils";
import { MyButton } from "components/Common/Forms/formsMiscItems";
import AttributesTable from "./AttributesTable";
import { languageService } from "../../../Language/language.service";
import {MODAL_TYPES} from "../../../utils/globals";

class AssetTypeDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            assetType: {},
            spinnerLoading: false,
            assetTypeAttributes: []
        };

        this.styles = planStyle;
    }

    componentDidUpdate(prevProps, prevState) {

    }


    componentDidMount() {
        const {assetType} = this.props.location.state;
        const allowed = ['lampAttributes', 'timpsAttributes', 'defectCodesObj', 'defectCodes'];

        let assetTypeAttributes = Object.keys(assetType)
            .filter(key => allowed
                .includes(key)).reduce((obj, key) => {
                obj.push({
                    title: key,
                    data: assetType[key]
                });

                return obj;
            }, []);

        this.setState({
            assetType,
            assetTypeAttributes
        });
    }


    handleAssetTypeAttributeAction = (actionType, selectedObj) => {
        if (actionType === MODAL_TYPES.VIEW){

            this.props.history.push({
                pathname: `/setup/assetType/${this.state.assetType.assetType.replace(/\s+/g, '-').toLowerCase()}/${selectedObj.title.replace(/\s+/g, '-').toLowerCase()}`,
                state: {selectedObj, assetType: this.state.assetType}
            });

            return true;
        }
    };

    render() {
        let mainTitle = languageService("Asset Type");
        let m1 = this.state.assetType;

        return (
            <div>
                <Row style={{ borderBottom: "2px solid #d1d1d1", margin: "0px 30px", padding: "10px 0px" }}>
                    <Col md="6" style={{ paddingLeft: "0px" }}>
                        <div
                            style={{
                                float: "left",
                                fontFamily: "Myriad Pro",
                                fontSize: "24px",
                                letterSpacing: "0.5px",
                                color: " rgba(64, 118, 179)",
                            }}
                        >
                            <Link to="/setup/assetTypes" className="linkStyleTable">
                                <SvgIcon
                                    size={25}
                                    icon={ic_arrow_back}
                                    style={{ marginRight: "5px", marginLeft: "5px", verticalAlign: "middle", cursor: "pointer" }}
                                />
                            </Link>
                            <SvgIcon size={12} icon={circle} style={{ marginRight: "10px", marginLeft: "5px" }} />
                            {mainTitle}
                        </div>
                    </Col>
                </Row>
                <Row style={{ margin: "0px" }}>
                    <Col md="12">
                        <div style={commonPageStyle.commonSummaryHeadingContainer}>
                            <h4 style={commonPageStyle.commonSummaryHeadingStyle}>{languageService("AssetType Detail")}</h4>
                        </div>
                    </Col>
                    <Col md="12" style={{ padding: "0px" }}>
                        <div style={this.styles.MaintenanceDetailsContainer}>
                            <Row>
                                <Col md={"4"}>
                                    <div style={this.styles.fieldHeading}>{languageService("AssetType")} #</div>
                                    <div style={this.styles.fieldText}>
                                        {m1.assetType}
                                    </div>
                                </Col>
                                <Col md={"4"}>
                                    <div style={this.styles.fieldHeading}>{languageService("AssetType Classify")}</div>
                                    <div style={this.styles.fieldText}>{m1.assetTypeClassify}</div>
                                </Col>
                                <Col md={"4"}>
                                    <div style={this.styles.fieldHeading}>{languageService("Created at")}</div>
                                    <div style={this.styles.fieldText}>{m1.timestamp ? m1.timestamp : m1.createdAt}</div>
                                </Col>
                            </Row>

                            <Row>
                                <Col md="6">
                                    <div style={this.styles.fieldHeading}> {languageService("Description")}</div>
                                    <div style={this.styles.MaintenanceDescriptionContainer}>{m1.description}</div>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                    <Col md="12">
                        <div style={commonPageStyle.commonSummaryHeadingContainer}>
                            <h4 style={commonPageStyle.commonSummaryHeadingStyle}>{languageService("AssetType Attributes")}</h4>
                        </div>
                    </Col>
                    <Col md="12">
                        <AttributesTable
                            data={this.state.assetTypeAttributes}
                            handleAssetTypeAttributeAction={this.handleAssetTypeAttributeAction}
                        />
                    </Col>
                </Row>
            </div>
        );
    }
}


let actionOptions = {
    create: false,
    update: false,
    read: false,
    delete: false,
    others: {  },
};

let variableList = {

};
const AssetTypeDetailContainer = CRUDFunction(AssetTypeDetail, "assetTypeDetail", actionOptions, variableList, [

]);

export default AssetTypeDetailContainer;

let planStyle = {
    dateHeading: {
        color: "rgba(64, 118, 179)",
        fontSize: "14px",
        padding: "2em 0em 1em ",
    },
    dateStyle: {
        width: "fit-content",
        border: "1px solid #f1f1f1",
        boxShadow: "rgb(238, 238, 238) 1px 1px 1px",
        padding: "10px",
        borderRadius: "5px",
        display: "inline-block",
    },
    copyButtonContainer: { display: "inline-block", marginLeft: "10px" },
    journeyPlanDateTableContainer: {
        marginTop: "30px",
    },

    MaintenanceDetailsContainer: {
        background: "#fff",
        boxShadow: "3px 3px 5px #cfcfcf",
        margin: "0px 30px  0px 30px",
        padding: "15px",
        textAlign: "left",
        color: " rgba(64, 118, 179)",
        fontSize: "12px",
    },
    MaintenanceDescriptionContainer: {
        background: "#fff",
        boxShadow: "1px 1px 2px #cfcfcf",
        padding: "15px",
        textAlign: "left",
        color: " rgba(64, 118, 179)",
        fontSize: "12px",
        marginBottom: "20px",
    },
    fieldHeading: {
        color: "rgba(64, 118, 179)",
        fontWeight: "600",
        fontSize: "14px",
        paddingBottom: "0.5em",
    },
    fieldText: {
        color: "rgba(64, 118, 179)",
        fontSize: "14px",
        paddingBottom: "1em",
    },
    subfieldText: {
        color: "rgba(64, 118, 179)",
        fontSize: "11px",
        paddingBottom: "0em",
    },
    fieldGroup: {
        marginBottom: "2em",
    },
};
