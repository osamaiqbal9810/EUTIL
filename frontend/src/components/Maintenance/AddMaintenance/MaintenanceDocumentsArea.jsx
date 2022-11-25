import React, { Component } from "react";
import { Row, Col, Button, Tooltip } from "reactstrap";
import { serverEndpoint } from "utils/serverEndpoint";
import SvgIcon from "react-icons-kit";
import { plus } from "react-icons-kit/icomoon/plus";
import * as extensionImage from "../../../images/FileTypes";
import { processFileExtension } from "../../Common/helperFunctions";
import { getServerEndpoint } from "../../../utils/serverEndpoint";
import { languageService } from "../../../Language/language.service";
import { themeService } from "theme/service/activeTheme.service";
import { basicColors, retroColors, electricColors } from "../../../style/basic/basicColors";
class MaintenanceDocumentsArea extends Component {
  render() {
    let documentList = this.props.documentList.reduce(
      (list, doc) => {
        if (list.row1.length > 2 && list.row2.length < list.row1.length) {
          list.row2.push(doc);
        } else {
          list.row1.push(doc);
        }

        return list;
      },
      { row1: [], row2: [] },
    );

    const showDocuments = (documents) =>
      documents.map((doc, index) => {
        if (doc) {
          return (
            <div style={{ display: "inline-block", margin: "0 3% 0 0", cursor: "pointer", fontSize: "12px" }} key={doc + index}>
              <DocumentComp index={index} docName={doc} borderStyle={"1px solid var(--first)"} width={"100%"} />
            </div>
          );
        }
      });

    return (
      <Row>
        <Col md={12}>
          <h5
            style={themeService({
              default: { padding: "10px 0px", font: "18px sans-serif", color: "var(--first)" },
              retro: {
                padding: "10px 0px",
                font: "18px sans-serif",
                color: retroColors.second,
              },
              electric: {
                padding: "10px 0px",
                font: "18px sans-serif",
                color: electricColors.second,
              },
            })}
          >
            {" "}
            {languageService("Documents")}
          </h5>
        </Col>
        <Col md={10}>
          <div
            className="scrollbarHor"
            style={themeService({
              default: {
                overflow: "auto",
                whiteSpace: "nowrap",
                border: "1px solid rgb(13, 117, 119)",
                height: "115px",
                paddingLeft: "30px",
              },
              retro: {
                overflow: "auto",
                whiteSpace: "nowrap",
                border: "1px solid" + retroColors.fourth,
                height: "115px",
                paddingLeft: "30px",
                background: retroColors.fifth,
              },
              electric: {
                overflow: "auto",
                whiteSpace: "nowrap",
                border: "1px solid" + electricColors.fourth,
                height: "115px",
                paddingLeft: "30px",
                background: electricColors.fifth,
              },
            })}
          >
            {documentList && showDocuments(documentList.row1)}
            <br />
            {documentList && showDocuments(documentList.row2)}
          </div>
        </Col>
        <Col md={2} style={{ padding: "0px" }}>
          <div
            style={themeService({
              default: { padding: "25px 0px", margin: "auto", width: "50%", color: "var(--first)" },
              retro: { padding: "25px 0px", margin: "auto", width: "50%", color: retroColors.second },
              electric: { padding: "25px 0px", margin: "auto", width: "50%", color: electricColors.second },
            })}
          >
            <span style={{ cursor: "pointer" }}>
              <SvgIcon onClick={this.props.addDocument} icon={plus} size={20} />
            </span>
          </div>
        </Col>
      </Row>
    );
  }
}

export default MaintenanceDocumentsArea;

class DocumentComp extends Component {
  state = {
    tooltip: null,
  };

  toggleTooltip = (tooltip) => {
    if (this.state.tooltip) {
      this.setState({ tooltip: null });
    } else {
      this.setState({ tooltip });
    }
  };

  render() {
    let [documentName, extension] = this.props.docName.split(".");

    extension = processFileExtension(extension);
    let url = getServerEndpoint() + "assetDocuments/" + this.props.docName;
    return (
      <a
        id={`doc_${this.props.index + 1}`}
        style={{
          padding: "0px 2px",
          display: "inline-block",
          verticalAlign: "top",
        }}
        href={url}
        target={"_blank"}
      >
        <img
          src={extensionImage[extension]}
          style={{ display: "block", marginLeft: "auto", marginRight: "auto", width: "44px", padding: "5px" }}
          alt={extension}
        />

        <Tooltip
          isOpen={this.state.tooltip !== null && this.state.tooltip === this.props.index + 1}
          target={`doc_${this.props.index + 1}`}
          toggle={() => this.toggleTooltip(this.props.index + 1)}
        >
          {languageService(documentName)}
        </Tooltip>
      </a>
    );
  }
}
