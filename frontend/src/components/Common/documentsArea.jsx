import React, { Component } from "react";
import { Row, Col, Button, Tooltip } from "reactstrap";
import SvgIcon from "react-icons-kit";
import { plus } from "react-icons-kit/icomoon/plus";
import * as extensionImage from "../../images/FileTypes";
import { processFileExtension } from "../Common/helperFunctions";
import { getServerEndpoint } from "utils/serverEndpoint";
import { languageService } from "../../Language/language.service";
import { themeService } from "../../theme/service/activeTheme.service";
import { basicColors, retroColors, electricColors } from "../../style/basic/basicColors";

class DocumentsArea extends Component {
  onClick(index) {
    if (this.props.allowClickDownload) {
      // start document download
      let doc = this.props.documentList[index];
      let url = getServerEndpoint() + this.props.path + "/" + doc;
      //   console.log("documentArea: openning ", url);

      // // window.open(url, 'download');
      // let download = browser.downloads.download({url: url, filename: doc, conflictAction:'uniquify'});
      // download.then(()=>{console.log('complete')}, ()=>{console.log('failed ')})
    }
  }

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
          let url = getServerEndpoint() + this.props.path + "/" + doc;
          return (
            <div style={{ display: "inline-block", margin: "0 3% 0 0", cursor: "pointer", fontSize: "12px" }} key={doc + index}>
              <a href={url} download={doc} target={"_blank"}>
                <DocumentComp
                  index={index}
                  docName={doc}
                  borderStyle={themeService({
                    default: "1px solid" + basicColors.first,
                    retro: "0px solid " + retroColors.second,
                    electric: "0px solid " + electricColors.second,
                  })}
                  width={"100%"}
                />
              </a>
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
              retro: { padding: "10px 0px", font: "18px sans-serif", color: retroColors.second },
              electric: { padding: "10px 0px", font: "18px sans-serif", color: electricColors.second },
            })}
          >
            {" "}
            {languageService("Documents")}
          </h5>
        </Col>
        <Col md={10}>
          <div className="scrollbarHor" style={{ overflow: "auto", whiteSpace: "nowrap", padding: "10px 0px 5px 0px" }}>
            {documentList && showDocuments(documentList.row1)}
            <br />
            {documentList && showDocuments(documentList.row2)}
          </div>
        </Col>
        {this.props.acctionBtn && (
          <Col md={2} style={{ padding: "0px" }}>
            <div
              style={themeService({
                default: { padding: "15px 0px", margin: "auto", width: "50%", color: "var(--first)", cursor: "pointer" },
                retro: { padding: "15px 0px", margin: "auto", width: "50%", color: retroColors.second, cursor: "pointer" },

                electric: { padding: "15px 0px", margin: "auto", width: "50%", color: electricColors.second, cursor: "pointer" },
              })}
            >
              <SvgIcon onClick={this.props.addDocument} icon={plus} size={20} />
            </div>
          </Col>
        )}
      </Row>
    );
  }
}

export default DocumentsArea;

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

    return (
      <div
        id={`doc_${this.props.index + 1}`}
        style={{ padding: "5px 5px", border: this.props.borderStyle ? this.props.borderStyle : "3px solid var(--first)" }}
      >
        <img
          src={extensionImage[extension]}
          style={{ display: "block", marginLeft: "auto", marginRight: "auto", width: "40px" }}
          alt={extension}
          onClick={this.props.onClick}
        />

        {/* <Tooltip style={{marginRight:'40px'}}
                    isOpen={this.state.tooltip !== null && this.state.tooltip === this.props.index + 1}
                    target={`doc_${this.props.index + 1}`}
                    toggle={() => this.toggleTooltip(this.props.index + 1)}
                    placement={"top"}
                    onClick={this.props.onClick}
                >
                    {documentName}
                </Tooltip> */}
        {/*<div>*/}
        {/*{documentName}*/}
        {/*</div>*/}
      </div>
    );
  }
}
