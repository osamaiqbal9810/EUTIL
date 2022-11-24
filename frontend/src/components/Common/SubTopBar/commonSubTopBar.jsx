import React, { Component } from "react";
import { Col, Row } from "reactstrap";
import { Link } from "react-router-dom";
import { ic_arrow_back } from "react-icons-kit/md/ic_arrow_back";
import SvgIcon from "react-icons-kit";
import { themeService } from "../../../theme/service/activeTheme.service";
import { commonStyles } from "../../../theme/commonStyles";
class SubTopBarHeading extends Component {
  render() {
    return (
      <Row style={themeService(commonStyles.pageBorderRowStyle)}>
        <Col md="6" style={{ paddingLeft: "0px" }}>
          <div style={themeService(this.props.detailHeading ? commonStyles.pageTitleDetailStyle : commonStyles.pageTitleStyle)}>
            {this.props.backButton && (
              <Link to={this.props.backPathName ? this.props.backPathName : "/"} className="linkStyleTable">
                <SvgIcon
                  size={25}
                  icon={ic_arrow_back}
                  style={{ marginRight: "5px", marginLeft: "5px", verticalAlign: "middle", cursor: "pointer" }}
                />
              </Link>
            )}
            {this.props.headingVal}
          </div>
        </Col>
      </Row>
    );
  }
}

export default SubTopBarHeading;
