import React, { Component, useState } from "react";
import { Row, Col, Tooltip } from "reactstrap";
import { locationListStyle } from "./LocationListStyle";
import { plus } from "react-icons-kit/icomoon/plus";

import SvgIcon from "react-icons-kit";
import { themeService } from "../../theme/service/activeTheme.service";
import AddNewInputField from "./AddNewInputField";
import { basicColors, retroColors, electricColors } from "style/basic/basicColors";
import CustomCheckbox from "../Common/CustomCheckbox";
import { pencil } from "react-icons-kit/icomoon/pencil";
import { cross } from "react-icons-kit/icomoon/cross";
import ConfirmationDialog from "../Common/ConfirmationDialog";
import { languageService } from "../../Language/language.service";
import { gear } from "react-icons-kit/fa/gear";
export default class LocationList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newInputField: false,
      editInputField: false,
      selectedATypeToChange: null,
      assetTypeCheckValue: this.props.locationTypeAllowedVal,
      tooltip: {},
    };
    this.handleAddNewLocation = this.handleAddNewLocation.bind(this);
    this.handleEditField = this.handleEditField.bind(this);
    this.handleSaveEdit = this.handleSaveEdit.bind(this);
    this.handleConfirmATypeChange = this.handleConfirmATypeChange.bind(this);
    this.handleATypeChangeClick = this.handleATypeChangeClick.bind(this);
  }

  handleAddNewLocation(input) {
    this.setState({
      newInputField: input,
    });
  }
  handleEditField(input) {
    this.setState({
      editInputField: input,
    });
  }
  handleSaveEdit(val) {
    if (val) {
      this.props.handleUpdateLocationTypeName(val, this.props.locationType);
      this.handleEditField(false);
    }
  }

  handleConfirmATypeChange = (response) => {
    let assetTypeCheckValue = this.state.assetTypeCheckValue;
    if (response && this.state.selectedATypeToChange) {
      assetTypeCheckValue = this.state.selectedATypeToChange.checkVal;
      this.props.handleLocationTypeCheckBox(this.state.selectedATypeToChange.checkVal, this.state.selectedATypeToChange.locationType);
    } else if (!response && this.state.selectedATypeToChange) {
      assetTypeCheckValue = !this.state.selectedATypeToChange.checkVal;
    }
    this.setState({
      assetTypeCheckValue: assetTypeCheckValue,
      selectedATypeToChange: null,
      enableDisableATypeModal: !this.state.enableDisableATypeModal,
    });
  };

  handleATypeChangeClick(checkVal, locationType) {
    this.setState({
      enableDisableATypeModal: !this.state.enableDisableATypeModal,
      selectedATypeToChange: { checkVal: checkVal, locationType: locationType },
      assetTypeCheckValue: checkVal,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.locationTypeAllowedVal !== prevProps.locationTypeAllowedVal) {
      this.setState({
        assetTypeCheckValue: this.props.locationTypeAllowedVal,
      });
    }
  }

  render() {
    let locationAssets =
      this.props.locationAssets &&
      this.props.locationAssets.map((loc, i) => {
        return (
          <LocationField
            locAsset={loc}
            key={loc._id}
            index={i}
            handleClick={this.props.handleLocationClick}
            locationType={this.props.locationType}
            handleSaveLocation={this.props.handleUpdateLocation}
            handleDeleteLocation={this.props.handleDeleteLocation}
            handleToggleLocationSettingModal={this.props.handleToggleLocationSettingModal}
          />
        );
      });
    return (
      <React.Fragment>
        <ConfirmationDialog
          modal={this.state.enableDisableATypeModal}
          toggle={() => this.setState({ enableDisableATypeModal: !this.state.enableDisableATypeModal })}
          handleResponse={this.handleConfirmATypeChange}
          confirmationMessage={
            <div>
              <div>{languageService("Are you sure you want to perform this action")} </div>
              <div style={{ color: "red" }}>
                <strong>{languageService("Note")}: </strong>
                {languageService("This would cause changes in assets and will impact inspection/maintenance planning")}
              </div>
            </div>
          }
          headerText={languageService("Confirmation")}
        />
        <LocationTypeField
          locationType={this.props.locationType}
          locationTypeAllowedVal={this.state.assetTypeCheckValue}
          handleLocationTypeCheckBox={this.handleATypeChangeClick}
          disableCheckbox={this.props.disableCheckbox}
          handleEditField={this.handleEditField}
          editInputField={this.state.editInputField}
          handleSaveEdit={this.handleSaveEdit}
        />
        <div style={themeService(locationListStyle.mainContainer)}>
          {locationAssets}
          {this.state.newInputField && (
            <AddNewInputField
              handleAddNewLocation={this.handleAddNewLocation}
              handleSaveField={(val) => {
                if (val) {
                  this.props.handleSaveField(val, this.props.locationType);
                  this.handleAddNewLocation(false);
                }
              }}
            />
          )}
          {!this.state.newInputField && this.props.addNewFieldAllowed && (
            <AddNewField locationType={this.props.locationType} handleAddNewLocation={this.handleAddNewLocation} />
          )}
        </div>
      </React.Fragment>
    );
  }
}

const LocationTypeField = (props) => {
  let style = { ...themeService(locationListStyle.fieldRowHeading) };
  props.editInputField && (style.padding = "0px");
  return (
    <div style={style}>
      {!props.editInputField && (
        <React.Fragment>
          <span>{languageService(props.locationType.assetType)}</span>
          <EditField handleEditField={props.handleEditField} />
          <CustomCheckbox
            containerStyle={{ float: "right" }}
            check={props.locationTypeAllowedVal}
            handleCheckChange={(checkVal) => {
              props.handleLocationTypeCheckBox && props.handleLocationTypeCheckBox(checkVal, props.locationType);
            }}
            disabled={props.disableCheckbox}
          />
        </React.Fragment>
      )}
      {props.editInputField && (
        <AddNewInputField
          handleAddNewLocation={props.handleEditField}
          handleSaveField={props.handleSaveEdit}
          color={"var(--second)"}
          value={props.locationType.assetType}
        />
      )}
    </div>
  );
};

export class AddNewField extends React.Component {
  state = {
    tooltip: false,
  };

  render() {
    return (
      <React.Fragment>
        <div
          style={themeService(locationListStyle.addNewField)}
          onClick={(e) => {
            this.props.handleAddNewLocation(true);
          }}
        >
          <SvgIcon
            id={"add_button_" + this.props.locationType._id}
            style={themeService(locationListStyle.addIconStyle)}
            icon={plus}
            size="15"
          />
        </div>
        <Tooltip
          isOpen={this.state.tooltip}
          target={`add_button_` + this.props.locationType._id}
          toggle={() => this.setState({ tooltip: !this.state.tooltip })}
        >
          {languageService("Add")}
        </Tooltip>
      </React.Fragment>
    );
  }
}

export class EditField extends React.Component {
  state = {
    tooltip: false,
  };

  render() {
    let color = this.props.color ? { color: this.props.color } : {};
    return (
      <React.Fragment>
        <span
          id={`edit-${this.props.index}`}
          style={{ ...themeService(locationListStyle.editIcon), ...{ float: "right", ...color } }}
          onClick={(e) => {
            this.props.handleEditField(true);
          }}
        >
          <SvgIcon style={{ verticalAlign: "middle" }} icon={pencil} size="15" />
        </span>
        <Tooltip
          isOpen={this.state.tooltip}
          target={`edit-${this.props.index}`}
          toggle={() => this.setState({ tooltip: !this.state.tooltip })}
        >
          {languageService("Edit")}
        </Tooltip>
      </React.Fragment>
    );
  }
}
export class LocationField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showInputField: false,
      tooltip: false,
      settingTooltip: false,
    };
    this.handleEditField = this.handleEditField.bind(this);
    this.handleSaveField = this.handleSaveField.bind(this);
  }

  handleEditField(input) {
    this.setState({
      showInputField: input,
    });
  }

  handleSaveField(val) {
    if (val) {
      this.props.handleSaveLocation(val, this.props.locAsset);
      this.handleEditField(false);
    }
  }

  render() {
    let style = { ...themeService(locationListStyle.fieldRowHeading) };
    if (this.state.showInputField) {
      style.padding = "0px";
    } else {
      style = { ...style, ...{ background: this.props.locAsset.selected ? "var(--first)" : "var(--fifth)" } };
    }
    return (
      <React.Fragment>
        {!this.state.showInputField && (
          <div
            style={style}
            onClick={(e) => {
              this.props.handleClick(this.props.locAsset, this.props.locationType);
            }}
          >
            <EditField
              handleEditField={this.handleEditField}
              index={this.props.locAsset._id}
              color={this.props.locAsset.selected ? "var(--second)" : "var(--first)"}
            />
            <span
              id={`check-${this.props.locAsset._id}`}
              onClick={(e) => {
                this.props.handleDeleteLocation(this.props.locAsset);
              }}
              style={{
                ...themeService(locationListStyle.saveInputIcon),
                ...{ color: "#840f0f", float: "right", padding: "0px 7px", height: "auto" },
              }}
            >
              <SvgIcon style={{ verticalAlign: "middle" }} icon={cross} size="15" />
            </span>
            {this.props.locationType.plannable && (
              <React.Fragment>
                <span
                  id={`setting-${this.props.locAsset._id}`}
                  onClick={(e) => {
                    this.props.handleToggleLocationSettingModal("Edit", this.props.locAsset);
                  }}
                  style={{
                    ...themeService(locationListStyle.saveInputIcon),
                    ...{
                      color: this.props.locAsset.selected ? "var(--second)" : "var(--first)",
                      float: "right",
                      padding: "0px 7px",
                      height: "auto",
                    },
                  }}
                >
                  <SvgIcon style={{ verticalAlign: "middle" }} icon={gear} size="15" />
                </span>
                <Tooltip
                  isOpen={this.state.settingTooltip}
                  target={`setting-${this.props.locAsset._id}`}
                  toggle={() => this.setState({ settingTooltip: !this.state.settingTooltip })}
                >
                  {languageService("Setting")}
                </Tooltip>
              </React.Fragment>
            )}
            <Tooltip
              isOpen={this.state.tooltip}
              target={`check-${this.props.locAsset._id}`}
              toggle={() => this.setState({ tooltip: !this.state.tooltip })}
            >
              {languageService("Delete")}
            </Tooltip>
            <span>{this.props.locAsset.unitId}</span>
          </div>
        )}

        {this.state.showInputField && (
          <AddNewInputField
            index={this.props.locAsset._id}
            handleAddNewLocation={this.handleEditField}
            handleSaveField={this.handleSaveField}
            value={this.props.locAsset.unitId}
          />
        )}
      </React.Fragment>
    );
  }
}

LocationList.defaultProps = {
  locationType: {},
};
