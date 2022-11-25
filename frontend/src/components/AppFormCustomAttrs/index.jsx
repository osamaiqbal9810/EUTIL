import React, { Component } from "react";
import Dialog from "../../libraries/Dialog";
import CustomForm from "../../libraries/form";
import { customForm_AppFormCustomAttrs } from "./schemas/customForm_AppFormCustomAttrs";
import { pencilSquare } from "react-icons-kit/fa/pencilSquare";
import { Button } from "reactstrap";
import { themeService } from "theme/service/activeTheme.service";
import { ButtonStyle } from "style/basic/commonControls";
import { languageService } from "../../Language/language.service";
import SvgIcon from "react-icons-kit";
import ThisTable from "components/Common/ThisTable/index";
import { dataFormatters } from "../../utils/dataFormatters";
import _ from 'lodash'

const modalTitle = "Manage App Form Attributes";
class AppFormCustomAttrs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openAddEditAttrForm: false,
      updatedRequired: false,
      appFormAttributeList: _.cloneDeep(props.appFormAttributeList),
      selectedAttrIndex: -1,
      selectedFormData: {},
      formState: "edit", // change when create is also required
    };
    this.closeDialog = this.closeDialog.bind(this);
    this.addFormAttribute = this.addFormAttribute.bind(this);
    this.updateFormAttribute = this.updateFormAttribute.bind(this);

    this.columns = [
      {
        Header: "Field Id",
        accessor: "id",
      },
      {
        Header: "Allowed Form",
        accessor: "allowedForms",
        minWidth: 130,
        Cell: (row) => dataFormatters.stringArrayFormatter(row.value),
      },
      {
        Header: "Allowed Values",
        accessor: "value",
        minWidth: 130,
        Cell: (row) => dataFormatters.stringArrayFormatter(row.value),
      },
      {
        Header: "Edit",
        Cell: () => <SvgIcon size={20} icon={pencilSquare} />,
      },
    ];
  }
  closeDialog() {
    this.setState({ openAddEditAttrForm: false, selectedAttrIndex: -1 });
  }
  addFormAttribute() {
    //   TODO: implement me. not required for now
  }
  updateFormAttribute(filledForm) {
    let { appFormAttributeList, selectedAttrIndex } = this.state;
    let updatedList = [...appFormAttributeList];
    updatedList[selectedAttrIndex] = filledForm.fields;
    this.setState({
      appFormAttributeList: updatedList,
      selectedAttrIndex: -1,
      updatedRequired: true,
    });

    this.closeDialog();
  }
  render() {
    const { appFormAttributeList, selectedFormData, formState, openAddEditAttrForm, updatedRequired } = this.state;
    const { updateFormAttributesCallback, openCallback } = this.props;
    return (
      <Dialog
        className={"manage-app-form-attrs-dialog"}
        title={modalTitle}
        isOpen={true}
        body={
          <React.Fragment>
            <ThisTable
              tableColumns={this.columns}
              tableData={appFormAttributeList}
              pageSize={10}
              minRows={3}
              pagination={false}
              forDashboard={false}
              height={"auto"}
              //   classNameCustom={this.props.classNameCustom}
              handleSelectedClick={(event, rowInfo) => {
                this.setState({
                  openAddEditAttrForm: true,
                  selectedAttrIndex: rowInfo.index,
                  selectedFormData: appFormAttributeList[rowInfo.index],
                });
              }}
              onClickSelect
            />
            {/* {appFormAttributeList.map((attr, i) => (
              <div onClick={() => {}} key={i}>{`${attr.id},\t\t${attr.value},\t\t${attr.allowedForms}`}</div>
            ))} */}
            {openAddEditAttrForm && (
              <CustomForm
                mode="dialog"
                currState={formState}
                fieldsData={selectedFormData}
                formSchema={customForm_AppFormCustomAttrs}
                closeDialog={this.closeDialog}
                parentRef={{
                  addFormAttribute: this.addFormAttribute,
                  updateFormAttribute: this.updateFormAttribute,
                }}
              />
            )}
          </React.Fragment>
        }
        footer={
          <React.Fragment>
            <Button
              style={themeService(ButtonStyle.commonButton)}
              disabled={!updatedRequired}
              onClick={() => {
                updateFormAttributesCallback(appFormAttributeList);
                openCallback(false);
              }}
            >
              {languageService("Update")}
            </Button>
            <Button onClick={() => openCallback(false)} style={themeService(ButtonStyle.commonButton)}>
              {languageService("Cancel")}
            </Button>
          </React.Fragment>
        }
        closeDialog={() => openCallback(false)}
      />
    );
  }
}

export default AppFormCustomAttrs;
