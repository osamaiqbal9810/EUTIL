import React, { Component } from "react";
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { ModalStyles } from "components/Common/styles.js";
import { languageService } from "../../Language/language.service";
import _ from "lodash";
import EditableTable from "components/Common/EditableTable";
import { CommonModalStyle, ButtonStyle } from "style/basic/commonControls";
import { themeService } from "theme/service/activeTheme.service";
import { basicColors, retroColors, electricColors } from "style/basic/basicColors";
import { Link } from "react-router-dom";
function format2Digits(num) {
  return num && !isNaN(parseFloat(num)) ? parseFloat(num).toFixed(2) : num ? num : "0.00";
}
const MRTableCols = [
  { id: "check", header: languageService("Select"), type: "bool", field: "selected", minWidth: 40, editable: true },
  {
    id: "MRNO",
    header: languageService("MR No"),
    field: "mrNumber",
    editable: false,
    accessor: (d) => {
      return <Link to={`/maintenancebacklogs/${d._id}`}>{d.mrNumber}</Link>;
    },
  },
  {
    id: "Start",
    header: languageService("Start"),
    field: "start",
    accessor: (d) => {
      return (d.startPrefix ? d.startPrefix : "") + d.start;
    },
    editable: false,
    minWidth: 50,
  },
  {
    id: "End",
    header: languageService("End"),
    field: "end",
    accessor: (d) => {
      return (d.endPrefix ? d.endPrefix : "") + d.end;
    },
    editable: false,
    minWidth: 50,
  },

  { id: "Type", header: languageService("Type"), field: "maintenanceType", editable: false, minWidth: 50 },
];

const MyButton = (props) => (
  <button className="setPasswordButton" {...props}>
    {props.children}
  </button>
);
class SelectMRs extends Component {
  constructor(props) {
    super(props);
    this.state = { maintenanceRequests: [] };

    this.handleMRTableChange = this.handleMRTableChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }
  componentDidMount() {
    this.setState({ maintenanceRequests: this.props.maintenanceRequests });
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.maintenanceRequests.length !== this.props.maintenanceRequests.length) {
      console.log(this.props.maintenanceRequests);
      let allmrs = this.props.maintenanceRequests.forEach((mr) => {});
      this.setState({ maintenanceRequests: this.props.maintenanceRequests });
    }
  }

  handleMRTableChange(name, value, obj) {
    let mrs = _.cloneDeep(this.state.maintenanceRequests);
    //console.log("MR table change", name, "=", value, "in", obj, 'check in', mrs);
    for (let mr of mrs) {
      if (mr.mrNumber === obj.mrNumber) {
        //      console.log('setting', name, 'to', mr[name]);
        mr[name] = !mr[name];
        this.setState({ maintenanceRequests: mrs });
        return;
      }
    }
  }
  submitForm() {
    let selectedMrs = [];
    for (let mr of this.state.maintenanceRequests) {
      if (mr.selected)
        selectedMrs.push({
          mrNumber: mr.mrNumber,
          start: mr.start,
          end: mr.end,
          maintenanceType: mr.maintenanceType,
          estimate: mr.estimate,
          startPrefix: mr.startPrefix,
          endPrefix: mr.endPrefix,
        });
    }

    this.props.submitForm(selectedMrs);
    this.props.toggle();
  }
  render() {
    return (
      <Modal
        isOpen={this.props.modal}
        toggle={this.props.toggle}
        contentClassName={themeService({ default: this.props.className, retro: "retro", electric: "electric" })}
      >
        <ModalHeader style={(ModalStyles.modalTitleStyle, themeService(CommonModalStyle.header))}>
          {languageService("Work Order")} {languageService("Request")} (s): {this.props.title}
        </ModalHeader>

        <ModalBody style={(ModalStyles.footerButtonsContainer, themeService(CommonModalStyle.footer))}>
          <EditableTable
            columns={MRTableCols}
            data={this.state.maintenanceRequests}
            handleActionClick={(a) => {}}
            onChange={this.handleMRTableChange}
            options={{}}
          />
        </ModalBody>

        <ModalFooter style={(ModalStyles.footerButtonsContainer, themeService(CommonModalStyle.footer))}>
          <MyButton style={themeService(ButtonStyle.commonButton)} type="submit" onClick={this.submitForm}>
            {languageService("Ok")}
          </MyButton>

          <MyButton style={themeService(ButtonStyle.commonButton)} type="button" onClick={this.props.toggle}>
            {languageService("Cancel")}
          </MyButton>
        </ModalFooter>
      </Modal>
    );
  }
}

export default SelectMRs;
