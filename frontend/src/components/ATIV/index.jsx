/* eslint eqeqeq: 0 */
import React, { Component } from "react";
import { Col, Row } from "reactstrap";
import { CRUDFunction } from "reduxCURD/container";
import { curdActions } from "reduxCURD/actions";
import _ from "lodash";
import SpinnerLoader from "components/Common/SpinnerLoader";
import { languageService } from "../../Language/language.service";
import CommonModal from "components/Common/CommonModal";
import MenuFilter from "components/Common/MenuFilters/index";
import { themeService } from "../../theme/service/activeTheme.service";
import { commonStyles } from "../../theme/commonStyles";
import { commonPageStyle } from "../Common/Summary/styles/CommonPageStyle";
import { ButtonStyle } from "style/basic/commonControls";
import moment from "moment";
import ATIVDataList from "./ATIVDataList";
import { withPlus } from "react-icons-kit/entypo/withPlus";
import { ButtonCirclePlus } from "components/Common/Buttons";
import ATIVImporter from "./ATIVImporter";
class ATIVData extends Component {
  constructor(props) {
    super(props);

    this.state = {
      spinnerLoading: false,
      pageSize: 50,
      showImporter: false,
      recordsData: [],
      templatesList: [],
    };

    this.openDeleteConfirmation = null;

    this.handleActionClick = this.handleActionClick.bind(this);
    this.handlePageSize = this.handlePageSize.bind(this);
    this.handleImportCSV = this.handleImportCSV.bind(this);
    this.toggleShowImporter = this.toggleShowImporter.bind(this);
    this.importCallback = this.importCallback.bind(this);
    this.updateWorkplan = this.updateWorkplan.bind(this);
  }
  componentDidMount() {
    this.props.getATIVDatas();
    this.props.getWorkPlanTemplates("/?trackOnly=true");
  }
  componentDidUpdate(prevProps) {
    if (this.props.actionType === "ATIVDATAS_READ_REQUEST" && prevProps.actionType !== this.props.actionType) {
      this.setState({ spinnerLoading: true });
    } else if (this.props.actionType === "ATIVDATAS_READ_SUCCESS" && prevProps.actionType !== this.props.actionType) {
      this.setState({ spinnerLoading: false, recordsData: this.props.ATIVDatas });
    } else if (
      (this.props.actionType === "ATIVDATA_DELETE_SUCCESS" ||
        this.props.actionType === "ATIVDATA_UPDATE_SUCCESS" ||
        this.props.actionType === "ATIVDATA_CREATE_SUCCESS") &&
      prevProps.actionType !== this.props.actionType
    ) {
      this.props.getATIVDatas();
    } else if (
      this.props.workPlanTemplateActionType === "WORKPLANTEMPLATES_READ_SUCCESS" &&
      prevProps.workPlanTemplateActionType !== this.props.workPlanTemplateActionType
    ) {
      this.updateInspectionsList(this.props.workPlanTemplates);
    }
  }
  updateInspectionsList(templates) {
    // console.log(`templates count: ${JSON.stringify(templates, null, 4)}`);
    const templatesList = templates.map((template) => {
      return { id: template._id, name: template.title };
    });
    // console.log(`templates: ${JSON.stringify(templatesList, null, 4)}`);
    this.setState({ templatesList: templatesList });
  }
  handleActionClick(action, obj) {
    console.log(`Action ${action}-> ${JSON.stringify(obj, null, 4)}`);
    this.setState({ deleteRecord: obj });
    this.openDeleteConfirmation && this.openDeleteConfirmation();
    // this.props.deleteATIVData(obj._id);
  }
  handlePageSize(pageSize) {
    // this.props.updateFilterState("workOrderFilters", {
    //   listViewDataToShow: this.state.listViewDataToShow,
    //   pageSize,
    // });
  }
  toggleShowImporter() {
    this.setState({ showImporter: !this.state.showImporter });
  }
  handleImportCSV() {
    this.toggleShowImporter();
  }
  importCallback(data) {
    this.props.createATIVData(data);
    // console.table(data);
  }
  updateWorkplan(obj, workplanId) {
    obj.workplanId = workplanId;
    // console.log('updating objext', obj);
    this.props.updateATIVData(obj);
  }
  render() {
    let modelRendered = <SpinnerLoader spinnerLoading={this.state.spinnerLoading} />;
    return (
      <Col id="mainContent" md={12}>
        <CommonModal
          handleSubmitClick={(e) => {
            this.state.deleteRecord && this.props.deleteATIVData(this.state.deleteRecord);
            this.setState({ deleteRecord: null });
          }}
          setModalOpener={(model) => (this.openDeleteConfirmation = model)}
          footerSubmitText="Confirm"
          headerText={languageService("Confirmation")}
        >
          <div>
            <div>{languageService("Are you sure you want to perform this action")} </div>
            <div style={{ color: "red" }}>
              <strong>{languageService("Note")}: </strong>
              {languageService("This would remove the record")}
            </div>
          </div>
        </CommonModal>
        {modelRendered}
        {this.state.showImporter && (
          <ATIVImporter isOpen={this.state.showImporter} toggle={this.toggleShowImporter} importCallback={this.importCallback} />
        )}
        <Row>
          <Col md="11">
            <div style={themeService(commonPageStyle.commonSummaryHeadingContainer)}>
              <h4 style={themeService(commonPageStyle.commonSummaryHeadingStyle)}>{languageService("ATIV Data Items")}</h4>
            </div>
          </Col>
          <Col md="1">
            <ButtonCirclePlus
              iconSize={60}
              icon={withPlus}
              handleClick={() => {
                this.handleImportCSV();
              }}
              backgroundColor="#e3e9ef"
              margin="5px 0px 0px 0px"
              borderRadius="50%"
              hoverBackgroundColor="#e3e2ef"
              hoverBorder="0px"
              activeBorder="1px solid #e3e2ef "
              iconStyle={{
                color: "#c4d4e4",
                background: "var(--fifth)",
                borderRadius: "50%",
                border: "3px solid ",
              }}
            />
          </Col>
        </Row>
        <ATIVDataList
          ativData={this.state.recordsData}
          handleClick={this.handleActionClick}
          handlePageSize={this.handlePageSize}
          pageSize={this.state.pageSize}
          templatesList={this.state.templatesList}
          updateWorkplan={this.updateWorkplan}
        />
      </Col>
    );
  }
}
const getWorkPlanTemplates = curdActions.getWorkPlanTemplates;

let actionOptions = {
  create: true,
  update: true,
  read: true,
  delete: true,
  others: { getWorkPlanTemplates },
};

let variableList = {
  workPlanTemplateReducer: { workPlanTemplates: [] },
};

let reducers = ["workPlanTemplateReducer"];

const ATIVDataContainer = CRUDFunction(ATIVData, "ATIVData", actionOptions, variableList, reducers);
export default ATIVDataContainer;
