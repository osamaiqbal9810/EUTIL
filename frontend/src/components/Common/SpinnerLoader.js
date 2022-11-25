import React, { Component } from "react";
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import PropagateLoader from "react-spinners/PropagateLoader";
import { sidebarWidth, topBarHeight } from "components/Common/Variables/CommonVariables";
import { themeService } from "../../theme/service/activeTheme.service";
import { basicColors, retroColors, electricColors } from "../../style/basic/basicColors";
class SpinnerLoader extends Component {
  render() {
    let spinnerObj = (
      <div
        style={{
          position: "fixed",
          zIndex: "999",
          overflow: "visible",
          background: "#0000002e",
          top: topBarHeight,
          left: sidebarWidth,
          bottom: 0,
          right: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            height: "100px",
            width: "100px",
            left: "50%",
            marginLeft: "-50px",
            top: "50%",
            marginTop: "-50px",
          }}
        >
          <PropagateLoader
            loading={this.props.spinnerLoading}
            color={themeService({ default: basicColors.first, retro: retroColors.first, electric: electricColors.first })}
            sizeUnit={"px"}
            size={10}
          />
        </div>
      </div>
    );
    return <div>{this.props.spinnerLoading && spinnerObj}</div>;
  }
}

export default SpinnerLoader;
