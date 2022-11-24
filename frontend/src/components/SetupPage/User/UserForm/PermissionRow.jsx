import React from "react";
import Radium from "radium";
import { CrossIcon, CheckIcon } from "images/imageIcons/index.js";
import { Tooltip, OverlayTrigger } from "reactstrap";
import { languageService } from "../../../../Language/language.service";
class PermissionRow extends React.Component {
  constructor(props) {
    super(props);
    //this.state = { selected: false };
  }

  permClickHandler(permission) {
    // this.setState({
    //     selected: !this.state.selected,
    // });

    this.props.handlePermClick(permission);
  }

  render() {
    const styles = getStyles1(this.props, this.state);
    const tooltip = (
      <Tooltip id="tooltip">
        {this.props.selected && <img src={CheckIcon} style={{ marginRight: "5px" }} width={15} height={15} alt="" />}
        {!this.props.selected && <img src={CrossIcon} style={{ marginRight: "5px" }} width={15} height={15} alt="x" />}
        <strong>{languageService(this.props.permission)}</strong> is {this.props.selected ? "Allowed!" : "Not Allowed!"}.
      </Tooltip>
    );
    return (
      <div>
        <OverlayTrigger placement="left" overlay={tooltip}>
          <div
            style={styles.permissionsRow}
            onClick={(e) => {
              this.permClickHandler(this.props.permission);
            }}
          >
            {this.props.permission}

            {this.props.selected && (
              <img src={CheckIcon} style={{ float: "right", marginRight: "5px" }} width={15} height={15} alt=" allowed" />
            )}
            {/*!this.props.selected && (
                    { <img src={CrossIcon} style={{ float: "right", marginRight: "5px" }} width={15} height={15} alt="not allowed" /> }
                )*/}
          </div>
        </OverlayTrigger>
      </div>
    );
  }
}

let getStyles1 = (props, state) => {
  let permissionRowStyle1 = {
    margin: "1em 0",
    //marginRight:"10px",
    position: "relative",
    display: "block",
    backgroundColor: "#f8f8f8",
    border: "1px solid #f0f0f0",
    borderRadius: "2em",
    padding: ".5em 1em .5em 5em",
    boxShadow: "0 1px 2px rgba(100, 100, 100, 0.5) inset, 0 0 10px rgba(100, 100, 100, 0.1) inset",
    cursor: "pointer",
    textShadow: "0 2px 2px #fff",
    font: "1em/1.4 'Open Sans Condensed', sans-serif",
    color: "#777",
    textDecoration: "line-through",
    ":hover": {
      backgroundColor: "#ead21a",
      color: "#000000",
    },
    ":active": {
      backgroundColor: "#ead21a",
      color: "#000000",
      textDecoration: "none",
    },
  };
  let permissionRowStyle = {
    borderBottom: "1px solid #EAD21A",
    color: "#4D4D4D",
    color: "rgb(77, 77, 77)",
    padding: "7px 20px 5px 7px",
    textDecoration: "line-through",
    margin: "0px 26px 0px 0px",

    ":hover": {
      backgroundColor: "#f9f1ba",
      color: "#000000",
    },
    ":active": {
      backgroundColor: "#ead21a",
      color: "#000000",
      textDecoration: "none",
    },
  };
  if (props.selected) {
    //permissionRowStyle.backgroundColor = "#f9f1ba"; //"#ead21a";
    permissionRowStyle.textDecoration = "none";
  }
  if (props.index == 0) {
    //permissionRowStyle.borderTop = "1px solid #c9c9c9";
  }
  return {
    permissionsRow: permissionRowStyle,
  };
};

let getStyles = (props, state) => {
  let permissionRowStyle = {
    padding: "8px 10px ",
    borderBottom: "1px solid #c9c9c9",
    width: "250px",
    cursor: "pointer",
    transitionDuration: "0.4s",
    textDecoration: "line-through",
    textDecorationColor: "#000",

    ":hover": {
      backgroundColor: "#ead21a",
      color: "#000000",
    },
    ":active": {
      backgroundColor: "#ead21a",
      color: "#000000",
      textDecoration: "none",
    },
  };
  if (props.selected) {
    permissionRowStyle.backgroundColor = "#f9f1ba"; //"#ead21a";
    permissionRowStyle.textDecoration = "none";
  }
  if (props.index == 0) {
    permissionRowStyle.borderTop = "1px solid #c9c9c9";
  }
  return {
    permissionsRow: permissionRowStyle,
  };
};

export default Radium(PermissionRow);
