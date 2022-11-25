import React, { Component } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import { ModalStyles } from "components/Common/styles.js";
import "components/Common/commonform.css";
import { languageService } from "../../Language/language.service";
import { ButtonStyle, CommonModalStyle } from "style/basic/commonControls";
import { themeService } from "theme/service/activeTheme.service";
import moment from "moment";
import EstimateListEditable from "../Maintenance/AddMaintenance/EstimateListEditable";

const MyButton = (props) => (
  <button className="setPasswordButton" {...props}>
    {props.children}
  </button>
);

class EstimateModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      estimateHistoryRecord: [],
      estimate: [],
    };

    this.backup = new Map();

    this.updateEstimate = this.updateEstimate.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.setEstimate = this.setEstimate.bind(this);
    this.handleExpandEstimateClick = this.handleExpandEstimateClick.bind(this);
    this.handleContractEstimateClick = this.handleContractEstimateClick.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.modal !== prevProps.modal && this.props.modal) {
      this.setEstimate();
    }
  }

  setEstimate() {
    let estimates = [];
    let mRequests = this.getMaintenanceRequestsForIds(this.props.editItem.maintenanceRequests, this.props.maintenances);
    mRequests.forEach((mr) => {
      const estmts = mr.estimate.reduce((estmts, est) => {
        const unitType = this.findUnitType(est, this.props.applicationlookupss);
        const costHours = this.calculateCostBase(est, unitType);

        est.costHours = costHours;
        est.unitType = unitType;
        est.mr_no = mr.mrNumber;

        let isFoundEstimateIndex = estimates.findIndex((est2) => est2.resource === est.resource);
        let isFoundEstimateInnerIndex = estmts.findIndex((est2) => est2.resource === est.resource);

        if (isFoundEstimateIndex !== -1) {
          if (estimates[isFoundEstimateIndex].mergedEstimate && estimates[isFoundEstimateIndex].mergedEstimate.length) {
            estimates[isFoundEstimateIndex].mergedEstimate = [...estimates[isFoundEstimateIndex].mergedEstimate, est];
          } else {
            estimates[isFoundEstimateIndex] = {
              mr_no: est.mr_no,
              resource: est.resource,
              unitType,
              mergedEstimate: [estimates[isFoundEstimateIndex], est],
            };
          }

          if (!estimates[isFoundEstimateIndex].mr_no.includes(mr.mrNumber))
            estimates[isFoundEstimateIndex].mr_no = `${estimates[isFoundEstimateIndex].mr_no}, ${mr.mrNumber}`;
        } else if (isFoundEstimateInnerIndex !== -1) {
          if (estmts[isFoundEstimateInnerIndex].mergedEstimate && estmts[isFoundEstimateInnerIndex].mergedEstimate.length) {
            estmts[isFoundEstimateInnerIndex].mergedEstimate = [...estmts[isFoundEstimateInnerIndex].mergedEstimate, est];
          } else {
            estmts[isFoundEstimateInnerIndex] = {
              mr_no: mr.mrNumber,
              resource: est.resource,
              unitType,
              mergedEstimate: [estmts[isFoundEstimateInnerIndex], est],
            };
          }

          if (!estmts[isFoundEstimateInnerIndex].mr_no.includes(mr.mrNumber))
            estmts[isFoundEstimateInnerIndex].mr_no = `${estmts[isFoundEstimateInnerIndex].mr_no}, ${mr.mrNumber}`;
        } else {
          estmts.push({ ...est, mr_no: mr.mrNumber, costHours, unitType });
        }

        return estmts;
      }, []);
      estimates = [...estimates, ...estmts];
    });

    estimates = this.sumMergedEstimate(estimates);
    this.setState({ estimate: estimates });
  }

  sumMergedEstimate(estimates) {
    return estimates.map((est) => {
      if (est.mergedEstimate) {
        est.costHours = 0;
        est.count = 0;
        est.mergedEstimate.forEach((mEst) => {
          est.costHours += mEst.costHours;
          est.count = parseInt(est.count) + parseInt(mEst.count);
        });
      }

      return est;
    });
  }

  findUnitType(est, lists) {
    let unitType = "hour";
    let list = lists.find((l) => l.description === est.resource);

    // debugger;
    if (list && list.listName === "materialTypes") unitType = "unit";

    return unitType;
  }

  calculateCostBase(est, unitType) {
    let costHours = 1;
    if (unitType !== "unit") {
      let startTime = moment(est.time, ["hA"]).format("HH");
      const endTime = moment(est.endTime, ["hA"]).format("HH");
      costHours = endTime - startTime;
      if (costHours < 0) {
        let counter = 10;
        costHours = 0;
        while (parseInt(startTime) !== parseInt(endTime) || counter <= 0) {
          costHours++;
          if (parseInt(startTime) === 17) {
            startTime = 6;
          }
          startTime++;
          counter--;
        }
      }
    }

    costHours = costHours * est.count;
    return costHours;
  }

  getMaintenanceRequestsForIds(mrIds, maintenances) {
    let mrs = [];
    for (let mrid of mrIds) {
      if (mrid) {
        let mr = maintenances.find((m) => {
          return m.mrNumber === mrid;
        });
        if (mr) {
          mrs.push({
            selected: false,
            _id: mr._id,
            mrNumber: mr.mrNumber,
            maintenanceType: mr.maintenanceType,
            locationId: mr.lineId,
            estimate: mr.estimate,
          });
        }
      }
    }
    return mrs;
  }

  updateEstimate(updatedState) {
    this.setState(updatedState);
  }

  submitForm() {
    let estimate = this.state.estimate;
    let estimateHistoryRecord = this.state.estimateHistoryRecord;

    this.props.handleSubmitForm({ ...this.props.editItem, estimate, estimateHistoryRecord }, true);
  }

  handleExpandEstimateClick(d) {
    let { estimate } = this.state;
    let findIndex = estimate.findIndex((est) => est.resource === d.resource);
    estimate.splice(findIndex + 1, 0, ...d.mergedEstimate);
    estimate[findIndex].expanded = true;
    this.setState({ estimate });
  }

  handleContractEstimateClick(d) {
    let { estimate } = this.state;
    let findIndex = estimate.findIndex((est) => est.resource === d.resource);
    estimate[findIndex].expanded = false;
    estimate.splice(findIndex + 1, estimate[findIndex].mergedEstimate.length);
    this.setState({ estimate });
  }

  render() {
    return (
      <Modal
        contentClassName={themeService({ default: this.props.className, retro: "retro", electric: "electric" })}
        isOpen={this.props.modal}
        toggle={this.props.toggle}
        style={{ maxWidth: "98vw" }}
      >
        <ModalHeader style={(ModalStyles.modalTitleStyle, themeService(CommonModalStyle.header))}>
          {this.props.modalMode === "add" ? languageService("Estimates") : languageService("Estimates")}
        </ModalHeader>

        <ModalBody style={themeService(CommonModalStyle.body)}>
          <EstimateListEditable
            title={"Capital Plan Estimate"}
            disableActions={true}
            workOrder={true}
            customColumns={[
              { id: "mr_no", header: languageService("MR#"), type: "text", field: "mr_no", editable: false },
              {
                id: "costHours",
                header: languageService("Cost Base"),
                type: "text",
                field: "costHours",
                accessor: (d) => {
                  return `${d.costHours} ${d.unitType}`;
                },
                editable: false,
              },
            ]}
            estimate={this.state.estimate}
            estimateHistoryRecord={this.state.estimateHistoryRecord}
            updateEstimate={this.updateEstimate}
            getMaintenance={() => {}}
            maintenanceActionType={""}
            maintenance={this.props.editItem}
            getApplicationlookupss={this.props.getApplicationlookupss}
            applicationlookupss={this.props.applicationlookupss}
            applicationlookupsActionType={this.props.applicationlookupsActionType}
            disableEdit={true}
            handleExpandClick={this.handleExpandEstimateClick}
            handleContractClick={this.handleContractEstimateClick}
          />
        </ModalBody>

        <ModalFooter style={(ModalStyles.footerButtonsContainer, themeService(CommonModalStyle.footer))}>
          {/*<MyButton style={themeService(ButtonStyle.commonButton)} onClick={this.submitForm} type="submit">*/}
          {/*    {languageService("Update")}*/}
          {/*</MyButton>*/}

          <MyButton type="button" onClick={this.props.toggle} style={themeService(ButtonStyle.commonButton)}>
            {languageService("Close")}
          </MyButton>
        </ModalFooter>
      </Modal>
    );
  }
}

export default EstimateModal;
