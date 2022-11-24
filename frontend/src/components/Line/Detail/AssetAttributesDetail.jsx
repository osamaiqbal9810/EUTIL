import React, { Component } from "react";
import { Row, Col } from "reactstrap";

class AssetAttributesDetail extends Component {
  constructor(props) {
    super(props);
    this.style = {
      lableStyle: {
        color: "rgba(64, 118, 179)",
        fontSize: "14px",
      },
      FieldStyle: {
        color: "rgba(64, 118, 179)",
        fontSize: "14px",
      },
      FieldContainerStyle: {
        padding: "5px 15px ",
        margin: "10px 0px",
        borderTop: "1px solid #e7e7e7",
        borderLeft: "1px solid #e7e7e7",
        borderRight: "1px solid #e7e7e7",
        borderBottom: "1px solid #e7e7e7",
        borderRadius: "3px",
      },
      FieldContainerLastStyle: {
        padding: "5px 15px ",
        borderBottom: "1px solid #e7e7e7",
        borderTop: "1px solid #e7e7e7",
        borderLeft: "1px solid #e7e7e7",
        borderRight: "1px solid #e7e7e7",
        borderRadius: "3px",
      },
    };
  }

  render() {
    let dynamicFields = null;
    if (this.props.assetAttributes) {
      let assetAtrKeys = Object.keys(this.props.assetAttributes);
      dynamicFields = assetAtrKeys.map((assetPropKey, index) => {
        return (
          <Row style={this.style.FieldContainerStyle}>
            <Col md={4} style={this.style.lableStyle}>
              {assetPropKey} :
            </Col>
            <Col md={8} style={this.style.FieldStyle}>
              {this.props.assetAttributes[assetPropKey]}
            </Col>
          </Row>
        );
      });
    }
    return <div>{dynamicFields} </div>;
  }
}

export default AssetAttributesDetail;
