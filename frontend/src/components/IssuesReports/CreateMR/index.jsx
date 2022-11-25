/* eslint eqeqeq: 0 */
import React from "react";
import _ from "lodash";
import { commonFields } from "./variables";
import FormFields from "../../../wigets/forms/formFields";
import { formFeildStyle } from "../../../wigets/forms/style/formFields";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { ModalStyles } from "../../Common/styles";
import { MyButton } from "../../Common/Forms/formsMiscItems";
import { checkFormIsValid, processFromFields } from "../../../utils/helpers";
import { languageService } from "../../../Language/language.service";
import { CommonModalStyle } from "style/basic/commonControls";
import { themeService } from "theme/service/activeTheme.service";
class PlanMaintenanceForm extends React.Component {
  state = {
    MRFields: _.cloneDeep(commonFields),
    titleMsg: "",
    limitMsg: "",
  };

  updateFrom = (newState) => this.setState({ ...newState });

  submitForm = () => {
    let { MRFields } = this.state;

    let formIsValid = checkFormIsValid(MRFields);

    let dataToSubmit = { ...processFromFields(MRFields) };

    if (formIsValid) {
      // if (parseFloat(MRFields.startMP.value) > parseFloat(MRFields.endMP.value)) {
      //   let MRFields1 = _.cloneDeep(MRFields);

      //   MRFields1.startMP.validationMessage = languageService("Start must be less than or equal to end");
      //   MRFields1.startMP.valid = false;
      //   this.setState({ MRFields: MRFields1 });
      // } else {
      dataToSubmit.startMP = this.props.issue.startMp;
      dataToSubmit.endMP = this.props.issue.endMp;
      if (this.props.issue.startMarker || this.props.issue.endMarker) {
        dataToSubmit.startMarker = this.props.issue.startMarker;
        dataToSubmit.endMarker = this.props.issue.endMarker;
      }

      this.setState({
        MRFields: _.cloneDeep(commonFields),
      });

      this.props.handleSubmitClick(dataToSubmit);
      //}
    } else {
      this.setFormValidation(MRFields, "MRFields");
    }
  };

  setFormValidation = (data, stateVarName) => {
    const validationMsg = languageService("Validation failed") + ": ";
    for (let key in data) {
      data[key].touched = true;
      if (!data[key].validationMessage.startsWith(validationMsg)) data[key].validationMessage = validationMsg + data[key].validationMessage;
    }

    this.setState({ [stateVarName]: data });
  };

  componentDidUpdate(prevProps) {
    if (prevProps.modal !== this.props.modal && this.props.modal) {
      if (this.props.issue) {
        let MRFs = _.cloneDeep(commonFields),
          titleMsg = "";
        // limitMsg = "";
        // let mpLimitStart = 0,
        //   mpLimitEnd = 999;

        // if (this.props.issue.startMp && this.props.issue.endMp) {
        //   MRFs.startMP.value = this.props.issue.startMp;
        //   MRFs.startMP.valid = true;
        //   MRFs.endMP.value = this.props.issue.endMp;
        //   MRFs.endMP.valid = true;

        //   //mpLimitStart = MRFs.startMP.value;
        //   //mpLimitEnd = MRFs.endMP.value;
        // }

        // if (this.props.issue.unit && this.props.issue.unit.start && this.props.issue.unit.end) {
        //   mpLimitStart = !isNaN(parseFloat(this.props.issue.unit.start)) ? parseFloat(this.props.issue.unit.start) : 0;
        //   mpLimitEnd = !isNaN(parseFloat(this.props.issue.unit.end)) ? parseFloat(this.props.issue.unit.end) : mpLimitStart;
        // }

        // // display the limits and apply validation range.
        // limitMsg = ": [" + mpLimitStart + " to " + mpLimitEnd + "] ";
        titleMsg = "Issue on " + this.props.issue.unit.unitId;
        // MRFs.startMP.labelText += limitMsg;
        // MRFs.endMP.labelText += limitMsg;

        // MRFs.startMP.validation.min = mpLimitStart;
        // MRFs.endMP.validation.min = mpLimitStart;

        // MRFs.startMP.validation.max = mpLimitEnd;
        // MRFs.endMP.validation.max = mpLimitEnd;

        // // if(this.props.issue.priority)
        // // {
        // //     MRFs.priority.value = this.props.issue.priority;
        // // }
        this.setState({ MRFields: MRFs, titleMsg: titleMsg }); //, limitMsg: limitMsg });
      }
    }

    if (this.state.MRFields.maintenanceType.config.options.length <= 0 && this.props.maintenanceTypes.length > 0) {
      let MRFields = _.cloneDeep(this.state.MRFields);

      MRFields.maintenanceType.config.options = this.props.maintenanceTypes.map((mt) => ({ val: mt, text: mt }));
      MRFields.maintenanceType.value = MRFields.maintenanceType.config.options[0].val;
      MRFields.maintenanceType.valid = true;

      this.updateFrom({ MRFields });
    }
  }

  render() {
    return (
      <div>
        <Modal
          contentClassName={themeService({ default: this.props.className, retro: "retro", electric: "electric" })}
          isOpen={this.props.modal}
          toggle={this.props.toggle}
        >
          <ModalHeader style={(ModalStyles.modalTitleStyle, themeService(CommonModalStyle.header))}>
            {languageService("Create Maintenance Request")}
            <br /> {this.state.titleMsg}
          </ModalHeader>
          <ModalBody style={(ModalStyles.footerButtonsContainer, themeService(CommonModalStyle.body))}>
            <div className={"commonform"}>
              <FormFields MRFields={this.state.MRFields} fieldTitle={"MRFields"} change={this.updateFrom} />
              <label style={themeService(formFeildStyle.lblStyle)}>{" Start:"}</label>{" "}
              <div style={{ ...themeService(formFeildStyle.feildStyle), fontSize: "12px" }}>
                {this.props.issue.startMarker ? this.props.issue.startMarker : this.props.issue.startMp}
              </div>
              <label style={themeService(formFeildStyle.lblStyle)}>{" End:"}</label>
              <div style={{ ...themeService(formFeildStyle.feildStyle), fontSize: "12px" }}>
                {this.props.issue.endMarker ? this.props.issue.endMarker : this.props.issue.endMp}
              </div>
            </div>
          </ModalBody>

          <ModalFooter style={(ModalStyles.footerButtonsContainer, themeService(CommonModalStyle.body))}>
            <MyButton type="submit" onClick={this.submitForm}>
              {languageService("Save")}
            </MyButton>
            <MyButton type="submit" onClick={this.props.toggle}>
              {languageService("Cancel")}
            </MyButton>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default PlanMaintenanceForm;
