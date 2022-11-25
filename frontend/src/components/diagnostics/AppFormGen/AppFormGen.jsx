import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import { AppFormAdd } from "./AppFormAdd";
import { AppFormList } from "./AppFormList";
import { AppFormEditor } from "./AppFormEditor";
import { AppFormProperties } from "./AppFormProperties";
import { CRUDFunction } from "../../../reduxCURD/container";
import "./style.css";
import { AppFormEditorHeader, AppFormListHeader, AppFormToolBar } from "./AppFormTopBar";
import { guid } from "../../../utils/UUID";
import { appFormFieldTemplate, appFormTemplate } from "./AppFormInfo";
import _ from "lodash";

class Appformgen extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedAppForm: null, selectedChanged: false, selectedField: null, activeRowID: "", selectedAppFormCode: null };
    this.handleSelectAppForm = this.handleSelectAppForm.bind(this);
    this.handleAddType = this.handleAddType.bind(this);
    this.handleSelectedField = this.handleSelectedField.bind(this);
    this.onAddNewForm = this.onAddNewForm.bind(this);
    this.onFieldPropertyChange = this.onFieldPropertyChange.bind(this);
    this.onAppFormPropertyChange = this.onAppFormPropertyChange.bind(this);
    this.handleSaveForm = this.handleSaveForm.bind(this);
    this.handleMove = this.handleMove.bind(this);
    this.exportData = this.exportData.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.props.getAppFormGenerators("assetTypeTests/noForm");
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.actionType !== prevProps.actionType && this.props.actionType === "APPFORMGENERATOR_READ_SUCCESS") {
      let form = this.props.appFormGenerator;
      form.opt1 = adjust_idToFormField(form.opt1);
      this.setState({
        selectedAppForm: this.props.appFormGenerator,
      });
    }
    if (this.props.actionType !== prevProps.actionType && this.props.actionType === "APPFORMGENERATOR_CREATE_SUCCESS") {
      this.setState({ selectedAppForm: null, selectedChanged: false, selectedField: null });
    }
    if (this.props.actionType !== prevProps.actionType && this.props.actionType === "APPFORMGENERATOR_UPDATE_SUCCESS") {
      let form = this.props.appFormGenerator;
      form.opt1 = adjust_idToFormField(form.opt1);
      this.setState({ selectedAppForm: form, selectedChanged: false, selectedField: null });
    }
  }
  exportData() {
    let data = JSON.parse(JSON.stringify(this.state.selectedAppForm)); //{ ...this.state.selectedAppForm };
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(data))}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "data.json";
    link.click();
  }
  handleMove(direction) {
    const items = { ...this.state.selectedAppForm };
    const id = this.state.activeRowID;
    //console.log(items.opt1);
    var position = items.opt1
      .map(function (x) {
        return x.id;
      })
      .indexOf(id);

    //console.log(position);

    if (position < 0) {
      console.log("Given item not found.");
    } else if ((direction === -1 && position === 0) || (direction === 1 && position === items.opt1.length - 1)) {
      return;
    }

    const item = items.opt1[position];
    const newItems = items.opt1.filter((i) => i.id !== id);
    newItems.splice(position + direction, 0, item);

    items.opt1.length = 0;
    items.opt1.push.apply(items.opt1, newItems);

    this.setState({ selectedAppForm: items });
  }
  handleSelectedField(field) {
    this.setState({
      selectedField: field,
      activeRowID: field.id,
    });
    console.log(field.id);
  }
  handleChange(e) {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (e) => {
      console.log("e.target.result", e.target.result);
      //setFiles(e.target.result);
      var formObject = JSON.parse(e.target.result);
      this.setState({
        selectedAppForm: { ...formObject, newForm: true },
        selectedChanged: false,
        selectedField: null,
      });
    };
  }
  handleSelectAppForm(appForm) {
    this.props.getAppFormGenerator("single/" + appForm._id);
    //console.log(appForm, this.state.selectedAppForm);
    this.setState({ selectedAppForm: null, selectedChanged: false, selectedField: null, selectedAppFormCode: appForm });
  }
  handleAddType(fieldType) {
    let newField = { ...appFormFieldTemplate[fieldType.type] };
    let form = { ...this.state.selectedAppForm };
    if (form) {
      !form.opt1 && (form.opt1 = []);
      newField._id = guid();
      form.opt1.push(newField);
      this.setState({ selectedAppForm: form, selectedChanged: true, selectedField: newField });
    }
  }
  onAddNewForm() {
    this.setState({
      selectedAppForm: { ...appFormTemplate, newForm: true },
      selectedChanged: false,
      selectedField: null,
    });
  }
  onFieldPropertyChange(e) {
    let form = { ...this.state.selectedAppForm };
    if (form) {
      let updatedField = { ...this.state.selectedField };
      if (updatedField) {
        updatedField[e.target.name] = e.target.value;
        let fieldIndex = form.opt1.findIndex((item) => item._id === updatedField._id);
        if (fieldIndex > -1) {
          form.opt1[fieldIndex] = updatedField;
        }
        this.setState({
          selectedAppForm: form,
          selectedField: updatedField,
          selectedChanged: true,
        });
      }
    }
  }
  onAppFormPropertyChange(e) {
    let form = { ...this.state.selectedAppForm };
    if (form) {
      form[e.target.name] = e.target.value;
      this.setState({
        selectedAppForm: form,
        selectedChanged: true,
      });
    }
  }
  handleSaveForm() {
    let form = { ...this.state.selectedAppForm };
    form.opt1 = adjust_idToFormField(form.opt1, true);
    if (form.newForm) {
      this.props.createAppFormGenerator(form, "applicationlookups");
    } else {
      this.props.updateAppFormGenerator(form);
    }
  }
  render() {
    return (
      <div className="app-form-main" id="mainContent">
        <Row>
          <Col md={12}>
            <AppFormAdd
              handleAddType={this.handleAddType}
              selectedAppFormCode={this.state.selectedAppFormCode}
              exportData={this.exportData}
              handleChange={this.handleChange}
            />
            {/* </Col>
          <Col md={4}>
            <AppFormToolBar handleSave={this.handleSaveForm} iconChanged={this.state.selectedChanged} /> */}
          </Col>
        </Row>
        <Row>
          <Col md={2}>
            <AppFormListHeader onAddNewForm={this.onAddNewForm} />
            <AppFormList
              appForms={this.props.appFormGenerators}
              handleSelectAppForm={this.handleSelectAppForm}
              selectedAppFormCode={this.state.selectedAppFormCode}
            />
          </Col>
          <Col md={6}>
            <AppFormEditorHeader
              selectedAppForm={this.state.selectedAppForm}
              onFormValueUpdate={this.onFormNameEdit}
              handleMove={this.handleMove}
            />
            <AppFormEditor
              selectedAppForm={this.state.selectedAppForm}
              handleSelectedField={this.handleSelectedField}
              toggleActiveRowID={this.toggleActiveRowID}
              activeRowID={this.state.activeRowID}
            />
          </Col>
          <Col md={4}>
            <AppFormProperties
              selectedAppForm={this.state.selectedAppForm}
              selectedField={this.state.selectedField}
              onFieldPropertyChange={this.onFieldPropertyChange}
              onAppFormPropertyChange={this.onAppFormPropertyChange}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

const AppFormGenContainer = CRUDFunction(Appformgen, "appFormGenerator", null, null, null, "applicationlookups");
export default AppFormGenContainer;

function adjust_idToFormField(opt1, remove) {
  let adjustedOpt1 = opt1.map((field) => {
    if (remove) delete field._id;
    else field._id = guid();
    return field;
  });
  return adjustedOpt1;
}
