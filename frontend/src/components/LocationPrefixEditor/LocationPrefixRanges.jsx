import React, { Component } from "react";
import AddNewInputField from "../LocationSetup/AddNewInputField";
import { AddNewField } from "../LocationSetup/LocationList";
import Icon from "react-icons-kit";
import { floppyDisk } from "react-icons-kit/icomoon/floppyDisk";
import { themeService } from "../../theme/service/activeTheme.service";
import { locationListStyle } from "../LocationSetup/LocationListStyle";
import { cross } from "react-icons-kit/icomoon/cross";
import { guid } from "../../utils/UUID";
import { pencil } from "react-icons-kit/icomoon/pencil";
const newField = { prefix: "", start: "", end: "" };
export default class LocationPrefixRanges extends Component {
  constructor(props) {
    super(props);

    this.state = { addNew: false, newField: null };
    this.handleAddNewLocation = this.handleAddNewLocation.bind(this);
    this.handleSaveField = this.handleSaveField.bind(this);
    this.handleRowSave = this.handleRowSave.bind(this);
    this.handleEditField = this.handleEditField.bind(this);
  }

  handleAddNewLocation(val) {
    if (val !== false) {
      this.setState({
        addNew: true,
        newField: { ...newField, id: guid() },
      });
    } else {
      this.setState({ addNew: false, newField: null });
    }
  }

  handleSaveField(value, key, itemId) {
    if (itemId) {
      if (this.state.selectedField && itemId === this.state.selectedField.id) {
        this.setState({
          selectedField: { ...this.state.selectedField, ...{ [key]: value } },
        });
      }
    } else {
      this.setState({
        newField: { ...this.state.newField, ...{ [key]: value } },
      });
    }
  }
  handleEditField(fieldObj, remove) {
    if (remove) this.props.handleSelectedRange(fieldObj, false, remove);
    else {
      this.setState({ selectedField: fieldObj });
    }
  }
  handleRowSave(cancel, remove) {
    if (!cancel) {
      if (this.state.selectedField) {
        this.props.handleSelectedRange(this.state.selectedField);
      } else {
        this.props.handleSelectedRange(this.state.newField, true);
      }
    }
    this.setState({
      newField: null,
      selectedField: null,
      addNew: false,
    });
  }
  render() {
    let listData =
      this.props.list &&
      this.props.list.opt2.map((item) => {
        let editMode = this.state.selectedField && this.state.selectedField.id === item.id;
        return (
          <tr key={item.id}>
            {!editMode && (
              <React.Fragment>
                <td>{item.prefix}</td>
                <td>{item.start}</td>
                <td>{item.end}</td>
                <td style={{ textAlign: "center" }}>
                  {!this.state.addNew && (
                    <React.Fragment>
                      <span
                        style={{
                          ...themeService(locationListStyle.saveInputIcon),
                          ...{ color: "#840f0f" },
                        }}
                        onClick={(e) => {
                          this.handleEditField(item, true);
                        }}
                      >
                        <Icon icon={cross} size="15" style={{ verticalAlign: "middle" }} />
                      </span>
                      <span
                        style={{
                          ...themeService(locationListStyle.saveInputIcon),
                          ...{ color: "var(--second)" },
                        }}
                        onClick={(e) => {
                          this.handleEditField(item);
                        }}
                      >
                        <Icon icon={pencil} size="15" style={{ verticalAlign: "middle" }} />
                      </span>
                    </React.Fragment>
                  )}
                </td>
              </React.Fragment>
            )}
            {editMode && <EditSelectedField handleRowSave={this.handleRowSave} handleSaveField={this.handleSaveField} item={item} />}
          </tr>
        );
      });

    return (
      <div>
        {this.props.selectedLocation && (
          <table className="table ">
            <thead className="thead-dark">
              <tr>
                <th>Prefix</th>
                <th>Start MP</th>
                <th>End MP</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {listData}
              <AddNewRowArea
                selectedLocation={this.props.selectedLocation}
                handleAddNewLocation={this.handleAddNewLocation}
                addNew={this.state.addNew}
                newField={this.state.newField}
                handleSaveField={this.handleSaveField}
                handleRowSave={this.handleRowSave}
                selectedField={this.state.selectedField}
              />
            </tbody>
          </table>
        )}
      </div>
    );
  }
}

const AddNewRowArea = (props) => {
  let plusSign =
    !props.addNew && !props.selectedField ? (
      <td colSpan="4">
        <AddNewField
          locationType={{ _id: props.selectedLocation && props.selectedLocation._id }}
          handleAddNewLocation={props.handleAddNewLocation}
        />
      </td>
    ) : null;
  let otherTds = !props.selectedField && !plusSign && (
    <React.Fragment>
      <td>
        <input
          style={themeService(locationListStyle.addNewInputField)}
          onChange={(e) => {
            props.handleSaveField(e.target.value, "prefix");
          }}
          placeholder="name"
        />
      </td>
      <td>
        <input
          style={themeService(locationListStyle.addNewInputField)}
          onChange={(e) => {
            props.handleSaveField(e.target.value, "start");
          }}
          placeholder="name"
          type="number"
        />
      </td>
      <td>
        <input
          style={themeService(locationListStyle.addNewInputField)}
          onChange={(e) => {
            props.handleSaveField(e.target.value, "end");
          }}
          placeholder="name"
          type="number"
        />
      </td>
    </React.Fragment>
  );

  let save = props.newField && (
    <td>
      <span
        style={{
          ...themeService(locationListStyle.saveInputIcon),
          ...{ color: "#840f0f" },
        }}
        onClick={(e) => {
          props.handleRowSave(true);
        }}
      >
        <Icon icon={cross} size="15" style={{ verticalAlign: "middle" }} />
      </span>
      <span
        style={{
          ...themeService(locationListStyle.saveInputIcon),
          ...{ color: "var(--first)" },
        }}
        onClick={(e) => {
          props.handleRowSave();
        }}
      >
        <Icon icon={floppyDisk} size="15" style={{ verticalAlign: "middle" }} />
      </span>
    </td>
  );
  return (
    <tr>
      {plusSign}
      <React.Fragment>
        {otherTds}
        {save}
      </React.Fragment>
    </tr>
  );
};

const EditSelectedField = (props) => {
  return (
    <React.Fragment>
      <td>
        <input
          style={themeService(locationListStyle.addNewInputField)}
          onChange={(e) => {
            props.handleSaveField(e.target.value, "prefix", props.item.id);
          }}
          defaultValue={props.item.prefix}
        />
      </td>
      <td>
        <input
          style={themeService(locationListStyle.addNewInputField)}
          onChange={(e) => {
            props.handleSaveField(e.target.value, "start", props.item.id);
          }}
          defaultValue={props.item.start}
          type="number"
        />
      </td>
      <td>
        <input
          style={themeService(locationListStyle.addNewInputField)}
          onChange={(e) => {
            props.handleSaveField(e.target.value, "end", props.item.id);
          }}
          defaultValue={props.item.end}
          type="number"
        />
      </td>
      <td>
        <span
          style={{
            ...themeService(locationListStyle.saveInputIcon),
            ...{ color: "#840f0f" },
          }}
          onClick={(e) => {
            props.handleRowSave(true);
          }}
        >
          <Icon icon={cross} size="15" style={{ verticalAlign: "middle" }} />
        </span>
        <span
          style={{
            ...themeService(locationListStyle.saveInputIcon),
            ...{ color: "var(--first)" },
          }}
          onClick={(e) => {
            props.handleRowSave(false);
          }}
        >
          <Icon icon={floppyDisk} size="15" style={{ verticalAlign: "middle" }} />
        </span>
      </td>
    </React.Fragment>
  );
};
