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
import {FORM_SUBMIT_TYPES, MODAL_TYPES} from "../../../utils/globals";
import AssetTypeAttributeAddEdit from "./Add";
import _ from 'lodash';

class AssetTypeAttributeDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            assetType: {},
            assetTypeAttribute: {},
            spinnerLoading: false,
            assetTypeAttributeFields: [],
            modals: {
                type: MODAL_TYPES.NONE,
                data: null
            }
        };

        this.styles = planStyle;
    }

    componentDidMount() {
        const assetTypeAttribute = this.props.location.state.selectedObj;
        let assetTypeAttributeFields = [];
        const {assetType} = this.props.location.state;

        switch (assetTypeAttribute.title) {
            case 'lampAttributes':
                assetTypeAttributeFields = assetTypeAttribute.data ? Object.keys(assetTypeAttribute.data).map(key => ({
                    name: assetTypeAttribute.data[key].name,
                    type: assetTypeAttribute.data[key].type,
                    order: assetTypeAttribute.data[key].order,
                    value: assetTypeAttribute.data[key].value,
                })) : [];
                break;

            default:
                assetTypeAttributeFields = assetTypeAttribute.data ? Object.keys(assetTypeAttribute.data).map(key => ({
                    name: key, value: assetTypeAttribute.data[key]
                })) : [];
        }


        this.setState({
            assetTypeAttribute,
            assetTypeAttributeFields,
            assetType
        });
    }

    handleModals = (modalType, selectedObj = null) => {
        let modals = _.cloneDeep(this.state.modals);

        if (modalType === MODAL_TYPES.DELETE && selectedObj.isDeleteable) {
            modals.type = MODAL_TYPES.WARNING;
        } else {
            modals.type = modalType;
            modals.data = selectedObj;
        }

        this.setState({modals});
    };

    handleSubmitForm = (formData, formType) =>  {
        let {assetType, assetTypeAttributeFields} = this.state;

        formData = {_id: assetType._id, formData, formType, fieldToUpdate: this.state.assetTypeAttribute.title};

        assetTypeAttributeFields.push(formData.formData);

        this.setState({modals: {type: MODAL_TYPES.NONE, data: null}, assetTypeAttributeFields});

        this.props.updateAssetType(formData);

    };


    render() {
        let mainTitle = languageService("AssetType Detail");
        let m1 = this.state.assetTypeAttribute;

        return (
            <div>
                <AssetTypeAttributeAddEdit
                    modal={this.state.modals.type === MODAL_TYPES.ADD || this.state.modals.type === MODAL_TYPES.EDIT}
                    modals={this.state.modals}
                    toggle={() => this.handleModals(MODAL_TYPES.NONE)}
                    handleSubmitForm={this.handleSubmitForm}
                />

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
                    <Col md="11" style={{ padding: "0px" }}>
                        <div style={this.styles.MaintenanceDetailsContainer}>
                            <Row>
                                <Col md={"4"}>
                                    <div style={this.styles.fieldHeading}>{languageService("Attribute Name")} #</div>
                                    <div style={this.styles.fieldText}>
                                        {/* <Gravatar style={{ borderRadius: '30px', marginRight: '5px' }} email={'abc@abc.com'} size={20} /> */}
                                        {m1.title}
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                    <Col md={'1'}>
                        <div id="toolTipAddTask">
                            <ButtonCirclePlus
                                iconSize={60}
                                icon={withPlus}
                                handleClick={() => {
                                    this.handleModals(MODAL_TYPES.ADD);
                                }}
                                backgroundColor="#e3e9ef"
                                margin="5px 0px 0px 0px"
                                borderRadius="50%"
                                hoverBackgroundColor="#e3e2ef"
                                hoverBorder="0px"
                                activeBorder="1px solid #e3e2ef "
                                iconStyle={{
                                    color: "#c4d4e4",
                                    background: "#fff",
                                    borderRadius: "50%",
                                    border: "3px solid ",
                                }}
                                // buttonTitleText={languageService('Add')}
                            />
                            {/*<Tooltip isOpen={this.state.tooltipOpen} target="toolTipAddTask" toggle={this.toggleTooltip}>*/}
                            {/*{languageService(compDetailNames.addButtonToolTipName)}*/}
                            {/*</Tooltip>*/}
                        </div>
                    </Col>
                    <Col md="12">
                        <div style={commonPageStyle.commonSummaryHeadingContainer}>
                            <h4 style={commonPageStyle.commonSummaryHeadingStyle}>{languageService("AssetType Attributes Properties")}</h4>
                        </div>
                    </Col>
                    <Col md="12">
                        <AttributesTable
                            data={this.state.assetTypeAttributeFields}
                            handleEdit={this.handleModals}
                        />
                    </Col>
                </Row>
            </div>
        );
    }
}

const updateAssetType = curdActions.updateAssetType;

let actionOptions = {
    create: false,
    update: false,
    read: false,
    delete: false,
    others: { updateAssetType },
};

let variableList = {

};

const AssetTypeDetailContainer = CRUDFunction(AssetTypeAttributeDetail, "assetTypeAttributeDetail", actionOptions, variableList, [

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
