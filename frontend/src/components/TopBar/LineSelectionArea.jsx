import React, { Component } from "react";
import { CRUDFunction } from "reduxCURD/container";
import { curdActions } from "reduxCURD/actions";
import { Link, Route } from "react-router-dom";
import { languageService } from "../../Language/language.service";
import { UncontrolledTooltip } from "reactstrap";

class LineSelectionAreaTopBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuStyle: this.props.hideToolTip
        ? {
            fontSize: "small",
            fontWeight: "600",
            maxWidth: "150px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "inline-block",
            whiteSpace: "nowrap",
            verticalAlign: "middle",
          }
        : {
            fontSize: "small",
            fontWeight: "600",
          },
    };
  }

  render() {
    //console.log("::", this.props.hideToolTip);
    return (
      <div>
        <Link to={"/line"} className="linkStyleTable" style={this.state.menuStyle} id="line-id">
          {this.props.selectedLine.unitId
            ? this.props.selectedLine.unitId
            : languageService("Select Line")
            ? languageService("Select Line")
            : "Select Line"}
          {this.props.hideToolTip && (
            <UncontrolledTooltip placement="left" target="line-id">
              {this.props.selectedLine.unitId}
            </UncontrolledTooltip>
          )}
        </Link>
      </div>
    );
  }
}

let actionOptions = {
  create: false,
  update: false,
  read: false,
  delete: false,
  others: {},
};

let variableList = {
  lineSelectionReducer: {
    selectedLine: {},
  },
};

let otherReducers = ["lineSelectionReducer"];

const LineSelectionAreaTopBarContainer = CRUDFunction(
  LineSelectionAreaTopBar,
  "lineSelectionDummy",
  actionOptions,
  variableList,
  otherReducers,
);

export default LineSelectionAreaTopBarContainer;
