import React, { Component, Fragment } from "react";
import EquipmentTree from "../Common/EquipmentTree";
import { customForm_CMAAsset_EquipmentForm } from "./schemas/customForm_CMAAsset_EquipmentForm";
import CustomForm from "../../libraries/form";
import { updateShortSchema } from "../../libraries/form/schemaInterpreter";
import { GetEquipmentTypeOptions, GetEquipmentTypeFormFields, GetRelayTypeOptions, GetEquipmentTypeIconsObject } from "./equipmentTypes";
import _ from "lodash";
import ConfirmationDialog, { confirmationDialogWarningMessage } from "../../libraries/ConfirmationDialog";
import ToggleButton from "../../libraries/ToggleButton";
import { languageService } from "../../Language/language.service";
import { Button } from "reactstrap";
import Dialog from "../../libraries/Dialog";

import { themeService } from "theme/service/activeTheme.service";
import { ButtonStyle, CommonModalStyle } from "style/basic/commonControls";
const uuid = require("uuid");
const EquipmentViewEditToggleButtonValues = ["View", "Edit"];
const [ViewEquipment, EditEquipment] = EquipmentViewEditToggleButtonValues;

class AssetEquipmentTreeView extends Component {
  constructor(props) {
    super(props);

    let assetType = props.selectedAsset.assetType;
    let { equipmentTypes } = props;
    let equipmentFormSchema = updateShortSchema(_.cloneDeep(customForm_CMAAsset_EquipmentForm), {
      equipmentType: {
        selectOptions: assetType === "Relays" ? GetRelayTypeOptions(equipmentTypes) : GetEquipmentTypeOptions(equipmentTypes),
      },
    });
    this.state = {
      selectedAsset: _.cloneDeep(props.selectedAsset),
      assetType: assetType,
      equipmentDepth: assetType === "Relays" ? 1 : null,
      modalTitle: assetType === "Relays" ? "Manage Relays" : "Manage Equipments",
      openAddEditEquipmentForm: false,
      openAddEditEquipmentFormData: {},
      equipmentFormSchema: equipmentFormSchema,
      equipmentFormState: "create",
      editMode: false,
      equipmentEditPath: [],
      confirmationDialog: null,
      updatedRequired: false,
      filesToUpload: [],
      equipmentTypes: equipmentTypes,
      equipmentTypeIcons: GetEquipmentTypeIconsObject(equipmentTypes),
    };

    this.closeDialog = this.closeDialog.bind(this);
    this.handleEquipmentActionCallback = this.handleEquipmentActionCallback.bind(this);
    this.updateEquipment = this.updateEquipment.bind(this);
    this.addEquipment = this.addEquipment.bind(this);
    this.removeEquipmentData = this.removeEquipmentData.bind(this);
    this.getTargetEquipmentArray = this.getTargetEquipmentArray.bind(this);
    this.compileEquipment = this.compileEquipment.bind(this);
    this.openConfirmationDialog = this.openConfirmationDialog.bind(this);
    this.closeConfirmationDialog = this.closeConfirmationDialog.bind(this);
  }
  componentDidMount() {}
  closeDialog() {
    this.setState({ openAddEditEquipmentForm: false });
  }
  removeEquipmentData(eq, path) {
    if (path.length === 0) {
      return {};
    }
    let index = path[0];
    let equipment = eq.equipments[index];
    if (path.length > 1) {
      let nextTreePath = [...path];
      nextTreePath.splice(0, 1);
      equipment = { ...this.removeEquipmentData(equipment, nextTreePath) };
    } else {
      // leaf node to delete
      eq.equipments.splice(index, 1);
    }
    return eq;
  }
  getEquipmentData(eq, path) {
    if (path.length === 0) {
      return {};
    }
    let index = path[0];
    let equipment = eq.equipments[index];
    if (path.length > 1) {
      let nextTreePath = [...path];
      nextTreePath.splice(0, 1);
      return this.getEquipmentData(equipment, nextTreePath);
    } else {
      let data = { ...equipment };
      data.attributes &&
        (data = {
          ...data,
          ...data.attributes.reduce((a, v) => {
            let value = v.value;
            if (v["url-rel"]) {
              // for file
              value = {
                name: v.value,
                "url-rel": v["url-rel"],
              };
            } else if (v.url) {
              // for file
              value = {
                name: v.value,
                url: v.url,
              };
            }
            return { ...a, [`attributes.${v.key}`]: value };
          }, {}),
        });
      delete data["attributes"];
      delete data["equipments"];
      return data;
    }
  }
  closeConfirmationDialog() {
    this.setState({
      confirmationDialog: null,
    });
  }
  handleEquipmentActionCallback(action, path) {
    let { selectedAsset } = this.state;
    let data = {};
    switch (action) {
      case "create":
        {
          this.setState({
            openAddEditEquipmentForm: true,
            equipmentFormState: action,
            equipmentEditPath: path,
            openAddEditEquipmentFormData: data,
          });
        }
        break;
      case "edit":
        {
          data = this.getEquipmentData(selectedAsset, path);
          this.setState({
            openAddEditEquipmentForm: true,
            equipmentFormState: action,
            equipmentEditPath: path,
            openAddEditEquipmentFormData: data,
          });
        }
        break;
      case "delete":
        {
          let tempPath = [...path];
          let lastIndex = tempPath.pop();
          let targetEquipments = this.getTargetEquipmentArray(selectedAsset.equipments, tempPath);
          this.openConfirmationDialog(
            `Confirm Delete: '${targetEquipments[lastIndex].name}'`,
            `Are you sure you want to delete?`,
            confirmationDialogWarningMessage(
              `Note: All children equipment under '${targetEquipments[lastIndex].name}' will also be deleted!`,
            ),
            "confirm-delete",
            this.handleEquipmentActionCallback,
            path,
          );
        }
        break;
      case "confirm-delete":
        {
          let updatedAsset = this.removeEquipmentData(selectedAsset, path);
          this.setState({
            selectedAsset: updatedAsset,
            updatedRequired: true,
          });
          this.closeConfirmationDialog();
        }
        break;
      default:
        break;
    }
  }
  getTargetEquipmentArray(eqs, path) {
    if (path.length === 0) {
      return eqs;
    } else {
      let [index] = path.splice(0, 1);
      return this.getTargetEquipmentArray(eqs[index].equipments, path);
    }
  }
  compileEquipment(fields) {
    let equipment = fields;
    let keys = Object.keys(fields);
    let [attrKeys, otherKeys] = keys.reduce(
      (result, key) => {
        result[key.startsWith("attributes.") ? 0 : 1].push(key); // Determine and push to small/large arr
        return result;
      },
      [[], []],
    );
    let attributes = attrKeys.map((attr) => {
      let item = { key: attr.replace("attributes.", ""), value: equipment[attr] };
      if (equipment[attr]["url-rel"]) {
        // for file
        item.value = equipment[attr].name;
        item["url-rel"] = equipment[attr]["url-rel"];
      } else if (equipment[attr]["url"]) {
        // for file
        item.value = equipment[attr].name;
        item.url = equipment[attr].url;
      }
      return item;
    });
    equipment = { ..._.pick(equipment, otherKeys), attributes: attributes };
    return equipment;
  }
  addEquipment(filledForm) {
    let equipment = this.compileEquipment(filledForm.fields);
    equipment.equipments = [];
    equipment.id = uuid.v4();
    let { selectedAsset, equipmentEditPath } = this.state;
    let updatedAsset = { ...selectedAsset };
    if (!updatedAsset.equipments) {
      // add first equipment
      updatedAsset.equipments = [equipment];
    } else {
      // add nested equipment
      let targetEquipments = this.getTargetEquipmentArray(updatedAsset.equipments, equipmentEditPath);
      targetEquipments.push(equipment);
    }

    this.setState({
      selectedAsset: updatedAsset,
      filesToUpload: [...this.state.filesToUpload, ...filledForm.files],
      updatedRequired: true,
    });

    this.closeDialog();
  }
  updateEquipment(filledForm) {
    let equipment = this.compileEquipment(filledForm.fields);
    let { selectedAsset, equipmentEditPath } = this.state;
    let updatedAsset = { ...selectedAsset };
    let lastIndex = equipmentEditPath.pop();

    // updated nested equipment
    let targetEquipments = this.getTargetEquipmentArray(updatedAsset.equipments, equipmentEditPath);
    let nestedEquipments = targetEquipments[lastIndex].equipments ? targetEquipments[lastIndex].equipments : [];
    equipment.id = targetEquipments[lastIndex].id ? targetEquipments[lastIndex].id : uuid.v4(); // found missing id, assign new one
    targetEquipments[lastIndex] = { ...equipment, equipments: nestedEquipments };

    this.setState({
      selectedAsset: updatedAsset,
      filesToUpload: [...this.state.filesToUpload, ...filledForm.files],
      updatedRequired: true,
    });

    this.closeDialog();
  }

  openConfirmationDialog(title, message, displayAddInfo, action, confirmCallback, additionalInfo) {
    this.setState({
      confirmationDialog: (
        <ConfirmationDialog
          title={title}
          body={
            <Fragment>
              <div>{`${message}`}</div>
              {displayAddInfo}
            </Fragment>
          }
          action={action}
          cancelCallback={this.closeConfirmationDialog}
          confirmationCallback={confirmCallback}
          additionalInfo={additionalInfo}
        />
      ),
    });
  }

  render() {
    let {
      selectedAsset,
      openAddEditEquipmentForm,
      equipmentFormState,
      openAddEditEquipmentFormData,
      editMode,
      confirmationDialog,
      equipmentFormSchema,
      filesToUpload,
      equipmentTypes,
      updatedRequired,
      equipmentDepth,
      modalTitle,
      equipmentTypeIcons,
    } = this.state;

    let filesToUploadGuids = filesToUpload.map((file) => file["url-rel"]);
    return (
      <Dialog
        className={"manage-equipments-dialog"}
        title={languageService(modalTitle)}
        isOpen={true}
        body={
          <React.Fragment>
            <ToggleButton
              options={EquipmentViewEditToggleButtonValues}
              value={editMode ? EditEquipment : ViewEquipment}
              onSelected={() => this.setState({ editMode: !editMode })}
            />
            <EquipmentTree
              asset={selectedAsset}
              editEquipmentCallback={this.handleEquipmentActionCallback}
              editMode={editMode}
              filesToUpload={filesToUploadGuids}
              downloadFile={this.props.downloadFile}
              allowedDepth={equipmentDepth}
              equipmentTypeIcons={equipmentTypeIcons}
            />
            {openAddEditEquipmentForm && (
              <CustomForm
                mode="dialog"
                currState={equipmentFormState}
                fieldsData={openAddEditEquipmentFormData}
                formSchema={equipmentFormSchema}
                closeDialog={this.closeDialog}
                parentRef={{
                  updateEquipment: this.updateEquipment,
                  addEquipment: this.addEquipment,
                  GetEquipmentTypeFormFields: (type) => GetEquipmentTypeFormFields(equipmentTypes, type),
                }}
              />
            )}
            {confirmationDialog}
          </React.Fragment>
        }
        footer={
          <React.Fragment>
            <Button
              style={themeService(ButtonStyle.commonButton)}
              disabled={!updatedRequired}
              onClick={() => {
                this.props.updateEquipmentData(selectedAsset.equipments, filesToUpload);
                this.props.openEquipmentView(false);
              }}
            >
              {languageService("Update")}
            </Button>
            <Button onClick={() => this.props.openEquipmentView(false)} style={themeService(ButtonStyle.commonButton)}>
              {languageService("Cancel")}
            </Button>
          </React.Fragment>
        }
        closeDialog={() => this.props.openEquipmentView(false)}
      />
    );
  }
}

export default AssetEquipmentTreeView;
