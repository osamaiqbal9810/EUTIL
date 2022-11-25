import React, { Component } from "react";
import { EditField } from "../../LocationSetup/LocationList";

class EditAndSaveItemField extends Component {
  constructor(props) {
    super(props);
    this.onTextEdit = this.onTextEdit.bind(this);
    this.state = {
      text: this.props.text,
      editMode: false,
    };
  }

  onTextEdit() {
    this.setState({
      editMode: true,
    });
  }
  onTextChange(e) {
    this.setState({ text: e.target.value });
  }
  onSave() {
    this.props.onTextUpdate(this.state.text);
  }

  render() {
    return (
      <div>
        {!this.state.editMode && (
          <React.Fraqmen>
            {this.state.text}
            {this.props.showEditField && <EditField handleEditField={this.onTextEdit} />}
          </React.Fraqmen>
        )}
      </div>
    );
  }
}

export default EditAndSaveItemField;
