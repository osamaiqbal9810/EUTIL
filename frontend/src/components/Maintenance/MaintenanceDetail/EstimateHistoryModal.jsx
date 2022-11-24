import React, { Component } from "react";
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Label } from "components/Common/Forms/formsMiscItems";
import { ModalStyles } from "components/Common/styles.js";
import _ from "lodash";
import "components/Common/commonform.css";
import { languageService } from "../../../Language/language.service";
import EditableTable from "components/Common/EditableTable";
import VerticalTabs from "components/Common/VerticalTabs/VerticalTabs";
import moment from "moment";
import EstimateHistoryData from "./EstimateHistroyData";
const EHColumns = [
  { id: "ts", header: languageService("Time Stamp"), type: "text", field: "timestamp", editable: false, minWidth: 50 },
  { id: "usr", header: languageService("User") , type: "text", field: "user", editable: false, minWidth: 50 },
  { id: "act", header: languageService("Action") , type: "text", field: "action", editable: false, minWidth: 50 },
  { id: "itm", header: languageService("Item") , type: "text", field: "item", editable: false, minWidth: 50 },
  { id: "old", header: languageService("Old data"), type: "text", field: "oldData", editable: false, minWidth: 100 },
  { id: "new", header: languageService("New data"), type: "text", field: "newData", editable: false, minWidth: 100 },
];

// const MRTableCols = [
//   { id: "Select", header: languageService("Select"), type: "bool", field: "selected", editable: false, minWidth: 20 },
//   { id: "MRNO", header: languageService("MR No."), field: "mrNumber", editable: false },
//   { id: "Start", header: languageService("Start"), field: "start", editable: false, minWidth: 50, formatter: format2Digits },
//   { id: "End", header: languageService("End"), field: "end", editable: false, minWidth: 50, formatter: format2Digits },
//   { id: "Type", header: languageService("Type"), field: "maintenanceType", editable: false, minWidth: 50 },
// ];

// const MyButton = props => (
//   <button className="setPasswordButton" {...props}>
//     {props.children}
//   </button>
// );

class EstimateHistoryModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      estimateHistory: [],
      estimateTabs: [],
      estimateDataToShow: null,
    };
    this.onDateClick = this.onDateClick.bind(this);
  }
  componentDidUpdate(prevProps) {
    if (this.props.estimateHistory && prevProps.estimateHistory && this.state.estimateHistory.length != this.props.estimateHistory.length) {
      let estimateHistory = [];
      let estimateTabs = [];
      for (let eh of this.props.estimateHistory) {
        let eh1 = _.cloneDeep(eh);

        estimateHistory.push(eh1);
        estimateTabs.push({
          value: moment(eh1.timestamp).format("DD-MM-YYYY HH:MM:SS") + " - " + languageService(eh1.action),
          key: eh1.timestamp,
        });
      }
      this.setState({ estimateHistory: estimateHistory, estimateTabs: estimateTabs });
    }
  }
  onDateClick(dateTab) {
    let estimate = _.find(this.state.estimateHistory, { timestamp: dateTab.key });

    this.setState({
      estimateDataToShow: estimate,
    });
  }
  render() {
    return (
      <Row>
        <Col md="2">
          <div
            style={{
              // background: "#efefef",
              // padding: "15px",
              //    height: "70vh",
              // boxShadow: " rgb(207, 207, 207) 3px 3px 5px",
              border: "1px solid #d8d8d8",
            }}
          >
            <VerticalTabs data={this.state.estimateTabs} onTabClick={this.onDateClick} />
          </div>
        </Col>
        <Col md="10">
          <EstimateHistoryData estimateData={this.state.estimateDataToShow} />
        </Col>
      </Row>
    );
  }
}

export default EstimateHistoryModal;
