import React, { Component } from "react";

class CheckRowElements extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let rowMap = this.props.data.map((row, index) => {
      return (
        <DataRow
          key={row[this.props.keyPropInObj]}
          text={row[this.props.textPropInObj]}
          handleClick={e => {
            this.props.onRowClick(row);
          }}
          value={row.showDataOf}
        />
      );
    });

    return <div>{rowMap} </div>;
  }
}

class DataRow extends Component {
  render() {
    return (
      <div style={{ padding: "5px 25px" }}>
        <input
          style={{ marginTop: "5px" }}
          onChange={this.props.handleClick}
          type="checkbox"
          name={this.props.text}
          checked={this.props.value}
        />
        <label style={{ fontSize: "14px", verticalAlign: "top", color: " rgba(64, 118, 179)" }}>{this.props.text} </label>
      </div>
    );
  }
}

export default CheckRowElements;
