/* eslint eqeqeq: 0 */
import React, { Component } from "react";
import { CRUDFunction } from "./../../../reduxCURD/container";
import { Row, Col, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { ModalStyles } from "./../../Common/styles.js";
import AssetImageArea from "./AssetImageArea";
import ImageGallery from "./../../Common/ImageGallery/index";
// import { plus } from 'react-icons-kit/icomoon/plus';
import { getAppMockupsTypes } from "./../../../reduxRelated/actions/diagnosticsActions";
import _ from "lodash";
import "components/Common/commonform.css";
import { languageService } from "../../../Language/language.service";
import {attributes, LINE_OBJ_TEMPLATE, lineAddFields, POPUP_TYPES_TO_SHOW} from "./variables";
import FormFields from "../../../wigets/forms/formFields";
import {FORM_SUBMIT_TYPES, MODAL_TYPES} from "../../../utils/globals";
import {createFieldFromTemplate} from "../../../wigets/forms/common";
import { curdActions } from "reduxCURD/actions";
import {locationGPSFields, locationMilepostFields} from "./variables";
import AssetTabs from 'components/Common/Tabs/CommonTabs'
import {checkFormIsValid, processFromFields} from "../../../utils/helpers";
import TrackLineSelect from "../../TrackLineSelect/TrackLineSelect";

const MyButton = props => (
    <button className="setPasswordButton" {...props}>
        {props.children}
    </button>
);

class AddLineIndex extends Component {
    state = {
        lineFields: _.cloneDeep(lineAddFields),
        locationGPSFields: _.cloneDeep(locationGPSFields),
        locationMilepostFields: _.cloneDeep(locationMilepostFields),
        diagnosticFields: null,
        attributes: _.cloneDeep(attributes),
        locationType: 0,

        imageList: [], //['test.jpg', 'test.jpg', 'test.jpg', 'test.jpg', 'test.jpg', 'test.jpg', 'test.jpg'],
        lines: {
            lines: []
        },
        documentList: [],

        popupTypeToShow: POPUP_TYPES_TO_SHOW.MAIN_FORM,

        showImgGal: false,
        showLineCanvas: false,
        subdivisionsOptions: [],
        assetTypeList: [],
        modalState: "None",
    };


    componentDidMount() {
        if (this.props.assetTypes.length < 1) {
            this.props.getAssetType();
        } else {
            this.setAssetTypes();
        }
        if (this.props.subdivisions.length < 1) {
            this.props.getAppMockupsTypes("Subdivision");
        } else {
            this.setSubdivisionOptions();
        }
    };

    componentDidUpdate (prevProps, prevState) {
        if (this.props.assetTypeActionType === "ASSETTYPES_READ_SUCCESS" && this.props.assetTypeActionType !== prevProps.assetTypeActionType) {
            this.setAssetTypes();
        }

        if (
            this.props.diagnosticsActionType !== prevProps.diagnosticsActionType &&
            this.props.diagnosticsActionType === "SUBDIVISION_LIST_GET_SUCCESS"
        ) {
            this.setSubdivisionOptions();
        }

        if (this.props.modal !== prevProps.modal) {
            this.setAssetTypes();
            this.setSubdivisionOptions();

            if (this.props.modals.type === MODAL_TYPES.EDIT) {
                this.mapSelectedLineFieldsToState();
            }
        }


        if (prevProps.modal !== this.props.modal) {
            if (this.props.modal) {
                if (this.props.modals.type === MODAL_TYPES.EDIT) {
                    this.mapSelectedLineToFields();
                }
            } else {
                this.setState({
                    lineFields: _.cloneDeep(lineAddFields),
                    locationGPSFields: _.cloneDeep(locationGPSFields),
                    locationMilepostFields: _.cloneDeep(locationMilepostFields),
                    attributes: _.cloneDeep(attributes),
                });
            }
        }

    };

    mapSelectedLineToFields = () => {
        let {lineFields, locationGPSFields, locationMilepostFields, attributes} = this.state;
        let diagnosticFields = null;
        let {data} = this.props.modals;

        for (let key in data) {
            let item = data[key];

            if (key in lineFields) {
                lineFields[key].value = item;
                lineFields[key].valid = true;
            }

            if (key in locationMilepostFields) {
                locationMilepostFields[key].value = item;
                locationMilepostFields[key].valid = true;
            }

            if (key === 'coordinates') {
                locationGPSFields.start_lat.value = item[0][0];
                locationGPSFields.start_lat.valid = item[0][0] ? true : false;
                locationGPSFields.start_lon.value = item[0][1];
                locationGPSFields.start_lon.valid = item[0][1] ? true : false;
                locationGPSFields.end_lat.value = item[1][0];
                locationGPSFields.end_lat.valid = item[1][0] ? true : false;
                locationGPSFields.end_lon.value = item[1][1];
                locationGPSFields.end_lon.valid = item[1][1] ? true : false;
            }

            if (key === 'attributes') {
                attributes.geoJsonCord.value = JSON.stringify(item, undefined, 2);
            }

            if (key === 'systemAttributes') {
                for (let key2 in item){
                    let item2 = item[key2];

                    let newField = createFieldFromTemplate(key2, '', key2);

                    diagnosticFields = {[key2]: _.cloneDeep(newField), ...diagnosticFields};

                }
            }
        }

        let imageList = data.images.map(item => item.imgName);
        this.updateFrom({
            lineFields,
            locationGPSFields,
            locationMilepostFields,
            diagnosticFields,
            attributes,
            imageList
        });
    };

    mapSelectedLineFieldsToState = () => {
        const {data} = this.props.modals;
        const {lineFields} = this.state;

        for (let key in data) {
            if (key in lineFields) {
                lineFields[key].value = data[key];
            }

            if (key in locationMilepostFields) {
                locationMilepostFields[key].value = data[key];
            }
        }

        this.updateFrom({lineFields});
    };

    setAssetTypes = () => {
        let {lineFields, diagnosticFields} = this.state;
        lineFields.assetType.config.options = this.props.assetTypes.map(item => ({val: item.assetType, text: item.assetType}));

        let line = this.props.assetTypes.find(item => item.assetType === lineFields.assetType.value);

        if (line && line.diagnosticAttributes && line.diagnosticAttributes.length) {
            line.diagnosticAttributes.forEach(item => {
                let newField = createFieldFromTemplate(item.name, '', item.name);

                newField.config.required = item.required;

                diagnosticFields = {[item.name]: _.cloneDeep(newField), ...diagnosticFields};
            });
        }

        this.setState({lineFields, diagnosticFields});
    };

    setSubdivisionOptions = () => {
        let {lineFields} = this.state;
        lineFields.subdivision.config.options = this.props.subdivisions.map(item => ({val: item.description, text: item.description}));
        lineFields.subdivision.value = this.props.subdivisions[0] ? this.props.subdivisions[0].description : '';
        this.setState({lineFields});
    };

    addSelectedImage = (imgName) => {
        const { imageList } = this.state;
        if (imgName) {imageList.push(imgName);}

        this.setState({imageList, popupTypeToShow: POPUP_TYPES_TO_SHOW.MAIN_FORM});
    };

    handleSubmitLine = formType => () =>  {
        let {lineFields, locationGPSFields, locationMilepostFields, imageList, attributes} = this.state;

        let coordinates = this.processGPSFields(locationGPSFields);
        // let systemAttributes = processFromFields(diagnosticFields);

        let formIsValid = checkFormIsValid(lineFields);
        formIsValid = checkFormIsValid(locationMilepostFields) && formIsValid;
        formIsValid = checkFormIsValid(locationGPSFields) && formIsValid;

        if (formIsValid) {
            lineFields = {
                ...processFromFields(lineFields),
                ...processFromFields(locationMilepostFields),
                coordinates,
                attributes: {...processFromFields(attributes)},
                imageList
            };
            this.props.handleSubmitForm(lineFields, formType);

        } else {
            this.setFormValidation(lineFields, 'lineFields');
            this.setFormValidation(locationMilepostFields, 'locationMilepostFields');
            this.setFormValidation(locationGPSFields, 'locationGPSFields');
        }

    };

    setFormValidation = (data, stateVarName) => {
        for (let key in data) {
            data[key].touched = true;
            data[key].validationMessage = languageService('Validation failed');
        }

        this.setState({[stateVarName]: data});
    };

    processGPSFields = locationGPSFields => [
        [locationGPSFields.start_lat.value, locationGPSFields.start_lon.value],
        [locationGPSFields.end_lat.value, locationGPSFields.end_lon.value]
    ];

    handleClose = () => {
        this.setState({
            lineFields: _.cloneDeep(lineAddFields),
            locationGPSFields: _.cloneDeep(locationGPSFields),
            locationMilepostFields: _.cloneDeep(locationMilepostFields),
            diagnosticFields: null,

            locationType: 0,

            imageList: [], //['test.jpg', 'test.jpg', 'test.jpg', 'test.jpg', 'test.jpg', 'test.jpg', 'test.jpg'],
            lines: {
                lines: []
            },
            documentList: [],
            subdivisionsOptions: [],
            assetTypeList: [],
            modalState: "None",
        });
        this.props.toggle("None", null);
    };

    updateFrom = newState => this.setState({ ...newState });

    // locationTypeSelectionHandler = e => {
    //     const { name, value } = e.target;
    //     this.setState({ [name]: value });
    // };
    //
    // locationAddHandler = () => {
    //     const { locationType } = this.state;
    //
    //     if (!this.state[LOCATION_TYPES[locationType].modelName]) {
    //         this.setState({ [LOCATION_TYPES[locationType].modelName]: Object.assign({}, LOCATION_TYPES[locationType].model) });
    //     }
    // };

    handlePopupTypeDisplay = popupTypeToShow => this.setState({popupTypeToShow});

    handleDrawLine = e => {
        let {lines} = this.state;
        if (lines.lines.length <= 0) {
            lines.lines.push(LINE_OBJ_TEMPLATE);
        }

        if (lines.lines[0].object.points.length <= 1){
            let x = e.evt.layerX;
            let y = e.evt.layerY;
            lines.lines[0].object.points.push({x, y});

            this.setState({lines});
        }
    };

    addLineToState = () => {
        this.setState({
            popupTypeToShow: POPUP_TYPES_TO_SHOW.MAIN_FORM
        })
    };

    render() {

        let imgGal, addAsset;
        imgGal = null;
        addAsset = null;
        return (
            <Modal isOpen={this.props.modal} toggle={this.props.toggle} style={{ maxWidth: "98vw" }}>
                {this.props.modals.type === MODAL_TYPES.ADD && <ModalHeader style={ModalStyles.modalTitleStyle}>{languageService("Add New Line")}</ModalHeader>}
                {this.props.modals.type === MODAL_TYPES.EDIT && <ModalHeader style={ModalStyles.modalTitleStyle}>{languageService("Edit Line")}</ModalHeader>}
                <ModalBody>
                    {this.state.popupTypeToShow === POPUP_TYPES_TO_SHOW.MAIN_FORM && (
                        <Row>
                            <Col md={2}>
                                <Row style={{ margin: "0px" }}>
                                    <AssetImageArea imagesList={this.state.imageList} showImageGallery={() => this.handlePopupTypeDisplay(POPUP_TYPES_TO_SHOW.IMAGE_GALLERY)} />
                                </Row>

                                {/* <AssetDocumentsArea documentList={this.state.documentList} addDocument={this.addDocumentHandle} /> */}
                            </Col>
                            <Col md={5}>
                                <ModalHeader style={ModalStyles.modalTitleStyle}>Line Attributes </ModalHeader>
                                <div className={"commonform"}>
                                    <FormFields lineFields={this.state.lineFields} fieldTitle={"lineFields"} change={this.updateFrom} />

                                    <FormFields
                                        locationGPSFields={this.state.locationGPSFields}
                                        fieldTitle={"locationGPSFields"}
                                        change={this.updateFrom}
                                    />



                                    <FormFields
                                        locationMilepostFields={this.state.locationMilepostFields}
                                        fieldTitle={"locationMilepostFields"}
                                        change={this.updateFrom}
                                    />

                                </div>
                            </Col>
                            <Col md={5}>
                                {/*<ModalHeader style={ModalStyles.modalTitleStyle}>Diagnostic Attributes </ModalHeader>*/}
                                <div className="commonform">
                                    <div style={{ display: 'inline-block' }}>
                                        <AssetTabs tabValue={"GEO ATTRIBUTES"} tabState={true} handleTabClick={() => {}} />
                                    </div>

                                    <FormFields
                                        attributes={this.state.attributes}
                                        fieldTitle={"attributes"}
                                        change={this.updateFrom}
                                    />

                                    {/*<div style={{ display: 'inline-block' }}>*/}
                                        {/*<AssetTabs tabValue={"OTHER"} tabState={true} handleTabClick={() => {}} />*/}
                                    {/*</div>*/}

                                    {/*<MyButton type="button" onClick={() => this.handlePopupTypeDisplay(POPUP_TYPES_TO_SHOW.LINE_CANVAS)}>*/}
                                        {/*{languageService("Draw Line")}*/}
                                    {/*</MyButton>*/}

                                    {/*{this.state.diagnosticFields && (*/}
                                        {/*<FormFields*/}
                                            {/*diagnosticFields={this.state.diagnosticFields}*/}
                                            {/*fieldTitle={"diagnosticFields"}*/}
                                            {/*change={this.updateFrom}*/}
                                        {/*/>*/}
                                    {/*)}*/}
                                </div>
                            </Col>
                            <Col md={5}/>
                        </Row>
                    )}


                    {this.state.popupTypeToShow === POPUP_TYPES_TO_SHOW.IMAGE_GALLERY && (
                        // <Modal isOpen={this.state.showImgGal}>
                        <ImageGallery
                            handleSave={this.addSelectedImage}
                            handleCancel={() => this.handlePopupTypeDisplay(POPUP_TYPES_TO_SHOW.MAIN_FORM)}
                            loadImgPath={"showAssetImgs"}
                            customFolder={"assetImages"}
                            uploadImageAllow
                        />
                        // </Modal>
                    )}

                    {this.state.popupTypeToShow === POPUP_TYPES_TO_SHOW.LINE_CANVAS && (
                        // <Modal isOpen={this.state.showImgGal}>
                        <TrackLineSelect
                            isEditMode={true}
                            addLineMode={true}
                            lines={this.state.lines}
                            handleDrawLine={this.handleDrawLine}
                        />
                        // </Modal>
                    )}

                </ModalBody>
                {this.state.popupTypeToShow === POPUP_TYPES_TO_SHOW.MAIN_FORM && (
                    <ModalFooter style={ModalStyles.footerButtonsContainer}>
                        {this.props.modals.type === MODAL_TYPES.ADD && (
                            <MyButton type="submit" onClick={this.handleSubmitLine(FORM_SUBMIT_TYPES.ADD)}>
                                {languageService("Add")}
                            </MyButton>
                        )}
                        {this.props.modals.type === MODAL_TYPES.EDIT && <MyButton type="submit" onClick={this.handleSubmitLine(FORM_SUBMIT_TYPES.EDIT)}>{languageService("Update")} </MyButton>}
                        <MyButton type="button" onClick={this.handleClose}>
                            {languageService("Close")}
                        </MyButton>
                    </ModalFooter>
                )}

                {this.state.popupTypeToShow === POPUP_TYPES_TO_SHOW.LINE_CANVAS && (
                    <ModalFooter style={ModalStyles.footerButtonsContainer}>
                        <MyButton type="submit" onClick={() => this.addLineToState}>
                            {languageService("Add")}
                        </MyButton>

                        <MyButton type="button" onClick={() => this.handlePopupTypeDisplay(POPUP_TYPES_TO_SHOW.MAIN_FORM)}>
                            {languageService("Close")}
                        </MyButton>
                    </ModalFooter>
                )}
            </Modal>
        );
    }
}

const getAssetType = curdActions.getAssetType;

let actionOptions = {
    create: false,
    update: false,
    read: true,
    delete: false,
    others: { getAppMockupsTypes , getAssetType},
};

let variables = {
    diagnosticsReducer: {
        subdivisions: [],
    },
    assetTypeReducer: {
        assetTypes: []
    }
    // utilReducer: {
    //   trackPageNum: 0,
    //   trackPageSize: 10
    // },
};

let AddLineContainer = CRUDFunction(AddLineIndex, "AddLineIndex", actionOptions, variables, [
    "diagnosticsReducer",
    "assetTypeReducer"
]);
export default AddLineContainer;
