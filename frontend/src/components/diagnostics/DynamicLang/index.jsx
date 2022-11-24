/* eslint eqeqeq: 0 */
import React, { Component } from "react";
import {
  Row,
  Col
} from "reactstrap";
// import { Control, LocalForm, Errors, actions } from "react-redux-form";
import { CRUDFunction } from "reduxCURD/container";
import LanguageList from "./LanguageList/index";
// import CategoryAddEdit from './CategoryAddEdit/CategoryAddEdit'
import { commonPageStyle } from "components/Common/Summary/styles/CommonPageStyle";
//import "./CategoryAddEdit/commonform.css";
import _ from "lodash";
// import { withPlus } from 'react-icons-kit/entypo/withPlus'
// import SvgIcon from 'react-icons-kit'
// import { ButtonCirclePlus } from 'components/Common/Buttons'
// import { curdActions } from "reduxCURD/actions";
import {
  getAppMockupsTypes,
  setNewDynamicLangWord,
  setEditDynamicLangWord,
  removeDynamicLangWord,
} from "reduxRelated/actions/diagnosticsActions";
import { ButtonCirclePlus } from "components/Common/Buttons";
import { withPlus } from "react-icons-kit/entypo/withPlus";
import CommonModal from "components/Common/CommonModal";
import FormFields from "../../../wigets/forms/formFields";
import { langFieldsTemplates } from "./variables";
import { curdActions } from "reduxCURD/actions";
import { checkFormIsValid, processFromFields } from "../../../utils/helpers";

class DynamicLang extends Component {
  constructor(props) {
    super(props);
    this.state = {
      langType: "",
      displayLangData: [],
      en: [],
      langFields: _.cloneDeep(langFieldsTemplates),
      langData: {},
      //langDataEs: {},
      modalState: "",
    };
    this.handleAddEditModalClick = this.handleAddEditModalClick.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.setLanguageData = this.setLanguageData.bind(this);
  }

  componentDidMount() {
    this.props.getApplicationlookupss(["DynamicLanguage_en", "DynamicLanguage_es", "DynamicLanguage_fr"]);
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.applicationlookupsActionType !== this.props.applicationlookupsActionType &&
      this.props.applicationlookupsActionType == "APPLICATIONLOOKUPSS_READ_SUCCESS"
    ) {

      this.setLanguageData(this.props.applicationlookupss);

      // if (this.props.dynamicLanguageList.length > 0) {
      //   if (this.props.dynamicLanguageList[0].listName == "DynamicLanguage_en") {
      //     this.setState({
      //       en: this.props.dynamicLanguageList[0].opt1,
      //     });
      //     // console.log(this.props.dynamicLanguageList[0]);
      //     this.props.getAppMockupsTypes("DynamicLanguage_es");
      //   } else {
      //     this.mergeAndDisplay();
      //   }
      // }
    }
    //console.log(this.props.diagnosticsActionType);
    if (
      prevProps.diagnosticsActionType !== this.props.diagnosticsActionType &&
      this.props.diagnosticsActionType == "ADD_LANGUAGE_CHANGE_SUCCESS"
    ) {
        this.props.getApplicationlookupss(["DynamicLanguage_en", "DynamicLanguage_es", "DynamicLanguage_fr"]);
    }
    if (
      prevProps.diagnosticsActionType !== this.props.diagnosticsActionType &&
      this.props.diagnosticsActionType == "EDIT_LANGUAGE_CHANGE_SUCCESS"
    ) {
        this.props.getApplicationlookupss(["DynamicLanguage_en", "DynamicLanguage_es", "DynamicLanguage_fr"]);
    }
    if (
      prevProps.diagnosticsActionType !== this.props.diagnosticsActionType &&
      this.props.diagnosticsActionType == "DELETE_LANGUAGE_CHANGE_SUCCESS"
    ) {
        this.props.getApplicationlookupss(["DynamicLanguage_en", "DynamicLanguage_es", "DynamicLanguage_fr"]);
    }
  }
  handleDeleteClick(field) {
    //console.log(field);
    this.props.removeDynamicLangWord(field);
  }
  // mergeAndDisplay() {
  //   let displayLangData = [];
  //   let keys = Object.keys(this.state.en);
  //   keys.forEach(key => {
  //     let obj = { key: key, en: this.state.en[key].en, es: this.props.dynamicLanguageList[0].opt1[key].es };
  //     displayLangData.push(obj);
  //   });
  //
  //   this.setState({ displayLangData: displayLangData });
  // }
  handleAddEditModalClick(filter, d) {
    if (filter == "Add") {
      this.openModelMethod();
      this.setState({ modalState: "Add" });
    } else if (filter == "Edit") {
      this.openModelMethod();
      this.setState({ modalState: "Edit" });

      let { langFields } = this.state;

      for (let key in d) {
        langFields[key].value = d[key];
        langFields[key].valid = true;
      }
      this.setState({ langFields });
    }
  }
  updateFrom = newState => this.setState({ ...newState });
  async submitForm() {
    //e.preventDefault();

    let { langFields } = this.state;
    let dataToSubmit = processFromFields(langFields);
    let formIsValid = checkFormIsValid(langFields);

    if (formIsValid) {
      // let langData = { key: dataToSubmit.key, en: dataToSubmit.en, es: dataToSubmit.es };
      if (this.state.modalState === "Add") {
        // this.setState(
        //   {
        //     langData: langData,
        //   },
        //   () => {
            //console.log(this.state.langData);
            await this.props.setNewDynamicLangWord(dataToSubmit);
            this.setState({langFields: _.cloneDeep(langFieldsTemplates)});
          // },
        // );
      } else if (this.state.modalState === "Edit") {
        // this.setState(
        //   {
        //     langData: langData,
        //   },
        //   () => {
            //console.log("edit", this.state.langData);
            await this.props.setEditDynamicLangWord(dataToSubmit);
          this.setState({langFields: _.cloneDeep(langFieldsTemplates)});
          // },
        // );
      }
    }
  }
  setLanguageData(languagesDataFromServer) {
      if (languagesDataFromServer && languagesDataFromServer.length) {
        let displayLangData = [];
        let en, es, fr = null;

        for (let ld of languagesDataFromServer) {
          if (ld.listName === 'DynamicLanguage_en') {
            en = ld;
          } else if (ld.listName === 'DynamicLanguage_es') {
            es = ld;
          } else if (ld.listName === 'DynamicLanguage_fr') {
            fr = ld;
          }
        }

        if (en && en.opt1 && Object.keys(en.opt1).length) {
          Object.keys(en.opt1).forEach(key => {
            let langObj = {
                key
            };

            if (en && en.opt1 && Object.keys(en.opt1).length && en.opt1[key])
              langObj.en = en.opt1[key]['en'];

              if (es && es.opt1 && Object.keys(es.opt1).length && es.opt1[key])
              langObj.es = es.opt1[key]['es'];

            if (fr && fr.opt1 && Object.keys(fr.opt1).length && fr.opt1[key])
              langObj.fr = fr.opt1[key]['fr'];

              displayLangData.push(langObj);
          })
        }

        this.setState({displayLangData});

      }
  }
  render() {
    return (
      <Col md="12">
        <CommonModal
          handleSubmitClick={this.submitForm}
          headerText="Add New Words to Dynamic Dictionery"
          //handleCancelClick={this.handleLinesCancelClick}
          setModalOpener={method => {
            this.openModelMethod = method;
          }}
        >
          <div className="commonform">
            <FormFields langFields={this.state.langFields} fieldTitle={"langFields"} change={this.updateFrom} />
          </div>
        </CommonModal>
        <Row style={{ borderBottom: "2px solid #d1d1d1", margin: "0px 15px", padding: "10px 0px" }}>
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
              Dynamic Language
            </div>
          </Col>
        </Row>
        <Row>
          <Col md="10">
            <div style={commonPageStyle.commonSummaryHeadingContainer}>
              <h4 style={commonPageStyle.commonSummaryHeadingStyle}>Detail</h4>
            </div>
          </Col>
          <Col md="2">
            <ButtonCirclePlus
              iconSize={70}
              icon={withPlus}
              handleClick={e => {
                this.handleAddEditModalClick("Add");
              }}
              backgroundColor="#e3e9ef"
              margin="10px 0px 0px 0px"
              borderRadius="50%"
              hoverBackgroundColor="#e3e2ef"
              hoverBorder="0px"
              activeBorder="3px solid #e3e2ef "
              iconStyle={{
                color: "#c4d4e4",
                background: "#fff",
                borderRadius: "50%",
                border: "3px solid ",
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col md="12">
            {
              <LanguageList
                tableData={this.state.displayLangData}
                handleEditClick={this.handleAddEditModalClick}
                handleDeleteClick={this.handleDeleteClick}
              />
            }
          </Col>
        </Row>
      </Col>
    );
  }
}

const getApplicationlookupss = curdActions.getApplicationlookupss;
let actionOptions = {
  create: false,
  update: false,
  read: false,
  delete: false,
  others: { getAppMockupsTypes, setNewDynamicLangWord, setEditDynamicLangWord, removeDynamicLangWord, getApplicationlookupss },
};
let variableList = {
  diagnosticsReducer: { dynamicLanguageList: "" },
    applicationlookupsReducer: { applicationlookupss: [] },
};

const DynamicLangContainer = CRUDFunction(DynamicLang, "dynamiclang", actionOptions, variableList, ["diagnosticsReducer", "applicationlookupsReducer"]);

export default DynamicLangContainer;
