/* eslint eqeqeq: 0 */
import React, { Component } from "react";
import { ModalStyles } from "components/Common/styles.js";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Control, LocalForm, Errors } from "react-redux-form";
import { languageService } from "../../../Language/language.service";
import DayPicker from "react-day-picker";
import "./planform.css";
import moment from "moment";
import _ from "lodash";
import { themeService } from "../../../theme/service/activeTheme.service";
import "./planform.css";
const Label = (props) => <label>{props.children}</label>;
const Field = (props) => <div className="field">{props.children}</div>;

const Required = () => <span className="required-fld">*</span>;
const MyButton = (props) => (
  <button className="setPasswordButton" {...props}>
    {props.children}
  </button>
);

class JourneyPlanAdd extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedDay: null,
      selectedJourneyPlan: null,
      modalState: "None",
      showDatePicker: false,
      showDuplicatePlanText: false,
      showEmptyUserWarn: false,
      showEmptyTitleWarn: false,
      showEmptyDateWarn: false,
      plan: {
        title: "",
        user: "",
        date: "",
        inspection_type: "",
        inspection_freq: "",
        inspection_date: "",
        forms: []
      },
    };
    this.handleDayClick = this.handleDayClick.bind(this);
    this.handleCalanderShow = this.handleCalanderShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    // this.handleChangeMultiSelect = this.handleChangeMultiSelect.bind(this)

    // this.unitOptions = [{ value: '123', label: 'Unit 201' }, { value: '234', label: 'Unit 20' }, { value: '345', label: 'Unit 50' }]
    // this.multiSelectStyle = {
    //   control: styles => ({ ...styles, backgroundColor: 'white', height: '15px' }),
    //   option: (base, state) => ({
    //     ...base,
    //     color: '"var(--first)"',
    //     fontSize: '12px'
    //   })
    // }

  }

  handleCalanderShow() {
    this.setState({
      showDatePicker: !this.state.showDatePicker,
    });
  }

  handleClose() {
    this.setState({
      modalState: "None",
      selectedDay: null,
      plan: {
        title: "",
        date: "",
        user: "",
        inspection_type: "",
        inspection_freq: "",
        inspection_date: "",
        forms: []
      },
      showDuplicatePlanText: false,
    });
    this.props.toggle("None", null);
  }

  handleDayClick(day, { selected }) {
    const { plan } = this.state;
    let copyPlan = { ...plan };
    let dateUTC000 = new Date(day);
    let momentDate = moment(new Date(day)).format("YYYY-MM-DD");
    let momentToday = moment(new Date()).format("YYYY-MM-DD");
    let checkAfterToday = moment(momentDate).isSameOrAfter(moment(momentToday));
    if (checkAfterToday) {
      dateUTC000.setUTCHours(0, 0, 0, 0);
      copyPlan.date = dateUTC000;

      this.setState({
        selectedDay: selected ? undefined : day,
        showDatePicker: !this.state.showDatePicker,
        plan: copyPlan,
        showEmptyDateWarn: false,
        showDuplicatePlanText: false,
      });
    }
  }

  handleChange(plan) {
    let userObj = { id: "", name: "", email: "" };
    let result = _.find(this.props.userList, { _id: plan.user });
    if (result) {
      userObj.id = result._id;
      userObj.name = result.name;
      userObj.email = result.email;
    }
    let checkEmptyTitle = this.state.showEmptyTitleWarn;
    let checkEmptyUser = this.state.showEmptyUserWarn;
    if (checkEmptyTitle || checkEmptyUser) {
      if (plan.user !== "") {
        checkEmptyUser = false;
      }
      if (plan.title !== "") {
        checkEmptyTitle = false;
      }
    }
    this.setState({
      plan: {
        title: plan.title,
        user: userObj,
        date: this.state.plan.date,
        inspection_type: this.state.inspection_type
      },
      showEmptyTitleWarn: checkEmptyTitle,
      showEmptyUserWarn: checkEmptyUser,
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.modalState == "Add" && nextProps.modalState !== prevState.modalState) {
      return {
        plan: {
          title: "",
          date: "",
          user: "",
          inspection_type: ""
        },
        selectedDay: null,
        showDatePicker: false,
        showDuplicatePlanText: false,
        showEmptyUserWarn: false,
        showEmptyTitleWarn: false,
        showEmptyDateWarn: false,
        modalState: nextProps.modalState,
      };
    } else if (nextProps.modalState == "Edit" && nextProps.modalState !== prevState.modalState) {
      return {
        selectedJourneyPlan: nextProps.selectedJourneyPlan,
        plan: {
          title: nextProps.selectedJourneyPlan.title,
          date: nextProps.selectedJourneyPlan.date,
          user: nextProps.selectedJourneyPlan.user.id
        },
        showDatePicker: false,
        selectedDay: nextProps.selectedJourneyPlan.date,
        showDuplicatePlanText: false,
        showEmptyUserWarn: false,
        showEmptyTitleWarn: false,
        showEmptyDateWarn: false,
        modalState: nextProps.modalState,
      };
    } else if (nextProps.modalState == "View" && nextProps.modalState !== prevState.modalState) {
      let freqMap = {
        NA: 0,
        one_Year: 1,
        three_Years: 3,
        five_Years: 5
      }
      let templateId = nextProps.selectedJourneyPlan.workplanTemplateId;
      let workPlanTemplate = nextProps.workPlanTemplates ? nextProps.workPlanTemplates.find(({ _id }) => _id == templateId) : null;
      return {
        selectedJourneyPlan: nextProps.selectedJourneyPlan,
        workPlanTemplate: workPlanTemplate ? workPlanTemplate : null,
        plan: {
          title: nextProps.selectedJourneyPlan.title,
          date: nextProps.selectedJourneyPlan.date,
          user: nextProps.selectedJourneyPlan.user.id,
          inspection_type: workPlanTemplate.inspection_type,
          inspection_freq: freqMap[workPlanTemplate.inspection_freq],
          forms: workPlanTemplate.inspectionFormInfo
        },
        showDatePicker: false,
        selectedDay: nextProps.selectedJourneyPlan.date,
        showDuplicatePlanText: false,
        showEmptyUserWarn: false,
        showEmptyTitleWarn: false,
        showEmptyDateWarn: false,
        modalState: nextProps.modalState,
      };
    }
    else if (nextProps.modalState !== "Add" && nextProps.modalState !== "Edit" && nextProps.modalState !== prevState.modalState) {
      return {
        modalState: "None",
      };
    } else {
      return null;
    }
  }

  // handleChangeMultiSelect(selectedUnits) {
  //   this.setState({
  //     plan: {
  //       title: this.state.plan.title,
  //       user: this.state.plan.user,
  //       date: this.state.plan.date,
  //       units: selectedUnits
  //     }
  //   })
  // }

  handleUpdate(form) { }
  handleSubmit(plan) {

    //console.log('state plan : ')
    //console.log(this.state.plan)

    let checkingTitleValidation = this.state.plan.title !== "" ? true : false;
    let checkingDateValidation = this.state.plan.date !== "" ? true : false;
    let checkingUserValidation = false;
    if (this.state.plan.user && this.state.plan.user !== "") {
      if (this.state.plan.user.name !== "") {
        checkingUserValidation = true;
      }
    }

    if (checkingTitleValidation && checkingDateValidation && checkingUserValidation) {
      let subDivResultUser = _.find(this.props.userList, {
        _id: this.state.plan.user.id,
      });
      if (this.state.modalState == "Add") {
        let result = _.find(this.props.journeyPlans, (plan) => {
          let planDate = moment(plan.date).format("ll");
          let newPlanDate = moment(this.state.selectedDay).format("ll");

          let newPlanUser = this.state.plan.user;
          let planDateCheck = moment(planDate).isSame(moment(newPlanDate));
          if (planDateCheck) {
            //console.log('Checked')
          }
          return plan.user.id == newPlanUser.id && planDateCheck;
        });
        //console.log(result)
        if (!result) {
          this.setState({
            modalState: "None",
            plan: {
              title: "",
              date: "",
              user: "",
            },
            showDuplicatePlanText: false,
            selectedDay: null,
            showDatePicker: false,
          });
          let statePlan = this.state.plan;
          let copyPlan = { ...statePlan };

          if (subDivResultUser) {
            copyPlan.subdivision = subDivResultUser.subdivision;
          }
          this.props.handleAddSubmit(copyPlan);
          this.props.toggle("None", null);
        } else {
          this.setState({
            showDuplicatePlanText: true,
          });
        }
      }
      if (this.state.modalState == "Edit") {
        let userObj = { id: "", name: "" };
        let result = _.find(this.props.userList, { _id: plan.user });
        if (result) {
          userObj.id = result._id;
          userObj.name = result.name;
          userObj.email = result.email;
        }

        let duplicateResult = _.find(this.props.journeyPlans, (plan) => {
          let planDate = moment(plan.date).format("ll");
          let newPlanDate = moment(this.state.selectedDay).format("ll");
          let selectedPlanDate = moment(this.state.selectedJourneyPlan.date).format("ll");
          let newPlanUser = userObj;
          let planDateCheck = moment(planDate).isSame(moment(newPlanDate));
          if (moment(newPlanDate).isSame(moment(selectedPlanDate))) {
            planDateCheck = false;
          }
          return plan.user.id == newPlanUser.id && planDateCheck;
        });
        if (!duplicateResult) {
          const currPlan = this.state.plan;

          let copySelectedPlan = _.cloneDeep(this.state.selectedJourneyPlan);
          copySelectedPlan.title = this.state.plan.title;
          copySelectedPlan.user = userObj;
          copySelectedPlan.date = this.state.plan.date;
          if (subDivResultUser) {
            copySelectedPlan.subdivision = subDivResultUser.subdivision;
          }
          this.setState({
            modalState: "None",
            plan: {
              title: "",
              date: "",
              user: "",
            },
            showDuplicatePlanText: false,
            selectedDay: null,
            showDatePicker: false,
          });
          this.props.handleEditSubmit(copySelectedPlan);
          this.props.toggle("None", null);
        } else {
          this.setState({
            showDuplicatePlanText: true,
          });
        }
      }
    } else {
      this.setState({
        showEmptyUserWarn: !checkingUserValidation,
        showEmptyTitleWarn: !checkingTitleValidation,
        showEmptyDateWarn: !checkingDateValidation,
      });
    }
  }

  render() {
    let options = null;
    if (this.props.userList || (this.state.modalState == "View" && this.state.selectedJourneyPlan)) {
      options = this.props.userList.map((user, index) => {
        return (
          <option value={user._id} key={user._id} selected={this.state.modalState == "View" ? this.state.selectedJourneyPlan.user._id == user._id ? true : false : false}>
            {user.name}
          </option>
        );
      });
    }
    let editFormFields = null;
    let viewFormFields = null;
    let addFormFields = null;
    if (this.state.selectedJourneyPlan && this.state.workPlanTemplate && this.state.modalState == "View") {
      let jDate = moment(this.state.selectedJourneyPlan.date).format("YYYY-MM-DD");
      let today = moment().format("YYYY-MM-DD");
      let planDatePassed = moment(jDate).isSameOrBefore(moment(today));
      let planDateToday = moment(jDate).isSame(moment(today));
      //console.log(planDatePassed)

      viewFormFields = (
        <ModalBody style={{maxHeight:'560px', overflowY:'auto' }}>
          <Field>
            <Label className="textColorJorneyPlanAdd">
              Title :<Required />
            </Label>
            <Control.text model="plan.title" placeholder="Plan Title" disabled={true} className="textColorJorneyPlanAdd" />
            <Errors
              model="plan.title"
              wrapper={this.errorWrapper}
              component={this.errorComponent}
              show={this.errorShow}
              messages={{
                required: "Please provide Plan Title.",
              }}
            />
          </Field>
          {this.state.showEmptyTitleWarn && (
            <div
              style={{
                display: " block",
                color: "firebrick",
                fontSize: "12px",
              }}
            >
              Please Enter Title
            </div>
          )}
          <Field>
            <Label className="textColorJorneyPlanAdd">
              User :<Required />
            </Label>
            <Control.select model="plan.user" disabled={true} className="textColorJorneyPlanAdd">
              <option className="textColorJorneyPlanAdd"> </option>
              {options}
            </Control.select>
          </Field>
          {this.state.showEmptyUserWarn && (
            <div
              style={{
                display: " block",
                color: "firebrick",
                fontSize: "12px",
              }}
            >
              Please Select User
            </div>
          )}
          <Field model="plan.date">
            <label className="fullWidth textColorJorneyPlanAdd">
              Date :<Required />
            </label>
            <div>
              <div className="dateControlField textColorJorneyPlanAdd" onClick={this.handleCalanderShow}>
                {" "}
                {this.state.selectedDay ? moment(this.state.selectedDay).format("LL") : "Select A Date"}{" "}
              </div>
            </div>
          </Field>

          <Field>
            <Label className="textColorJorneyPlanAdd">
              Inspection Type :<Required />
            </Label>
            <Control.text model="plan.inspection_type" placeholder="Inspection Type" disabled={true} className="textColorJorneyPlanAdd"/>
            <Errors
              model="plan.inspection_type"
              wrapper={this.errorWrapper}
              component={this.errorComponent}
              show={this.errorShow}
              messages={{
                required: "Please provide Inspection Type.",
              }}
            />
          </Field>

          <Field>
            <Label className="textColorJorneyPlanAdd">
              Inspection Frequency :<Required />
            </Label>
            <Control.text model="plan.inspection_freq" placeholder="Inspection Frequency" disabled={true} className="textColorJorneyPlanAdd"/>
            <Errors
              model="plan.inspection_freq"
              wrapper={this.errorWrapper}
              component={this.errorComponent}
              show={this.errorShow}
              messages={{
                required: "Please provide Inspection Type.",
              }}
            />
          </Field>
          <Label className="textColorJorneyPlanAdd">
            Assets:<Required />
          </Label>
          <br></br>
          <table className="table" >
          <thead>
          <tr>
              <th scope="col">Asset Name</th>
              <th scope="col">Asset Type</th>
            </tr>
          </thead>
            {
              this.state.plan.forms.map((form, ind) => {
                return (
                  <tr style={{borderBottom:"1px solid gray"}} scope="row" key={ind}>
                    <td style={{color:"black"}}>{form.assetName}</td>
                    <td style={{color:"black"}}>{form.assetType}</td>
                  </tr>
                )
              })
            }
          </table>
          {this.state.showDuplicatePlanText && (
            <div
              style={{
                display: " block",
                color: "firebrick",
                fontSize: "12px",
              }}
            >
              The Plan on {moment(this.state.plan.date).format("LL")} for {this.state.plan.user.name} Already Exists.
            </div>
          )}
        </ModalBody>
      );
    }
    if (this.state.selectedJourneyPlan && this.state.modalState == "Edit") {
      let jDate = moment(this.state.selectedJourneyPlan.date).format("YYYY-MM-DD");
      let today = moment().format("YYYY-MM-DD");
      let planDatePassed = moment(jDate).isSameOrBefore(moment(today));
      let planDateToday = moment(jDate).isSame(moment(today));
      //console.log(planDatePassed)

      editFormFields = (
        <ModalBody>
          <Field>
            <Label>
              Title :<Required />
            </Label>
            <Control.text model="plan.title" placeholder="Plan Title" />
            <Errors
              model="plan.title"
              wrapper={this.errorWrapper}
              component={this.errorComponent}
              show={this.errorShow}
              messages={{
                required: "Please provide Plan Title.",
              }}
            />
          </Field>
          {this.state.showEmptyTitleWarn && (
            <div
              style={{
                display: " block",
                color: "firebrick",
                fontSize: "12px",
              }}
            >
              Please Enter Title
            </div>
          )}
          <Field>
            <Label>
              User :<Required />
            </Label>
            <Control.select model="plan.user">
              <option> </option>
              {options}
            </Control.select>
          </Field>
          {this.state.showEmptyUserWarn && (
            <div
              style={{
                display: " block",
                color: "firebrick",
                fontSize: "12px",
              }}
            >
              Please Select User
            </div>
          )}
          <Field model="plan.date">
            <label className="fullWidth">
              Date :<Required />
            </label>
            <div>
              <div className="dateControlField" onClick={this.handleCalanderShow}>
                {" "}
                {this.state.selectedDay ? moment(this.state.selectedDay).format("LL") : "Select A Date"}{" "}
              </div>
              {this.state.showDatePicker && (
                <DayPicker
                  onDayClick={this.handleDayClick}
                  disabledDays={[
                    {
                      before: new Date(),
                    },
                  ]}
                />
              )}
            </div>
          </Field>

          {this.state.showDuplicatePlanText && (
            <div
              style={{
                display: " block",
                color: "firebrick",
                fontSize: "12px",
              }}
            >
              The Plan on {moment(this.state.plan.date).format("LL")} for {this.state.plan.user.name} Already Exists.
            </div>
          )}
        </ModalBody>
      );
    }
    if (this.state.modalState == "Add") {
      addFormFields = (
        <ModalBody>
          <Field>
            <Label>
              Title :<Required />
            </Label>
            <Control.text model="plan.title" placeholder="Plan Title" />
            <Errors
              model="plan.title"
              wrapper={this.errorWrapper}
              component={this.errorComponent}
              show={this.errorShow}
              messages={{
                required: "Please provide Plan Title.",
              }}
            />
          </Field>
          {this.state.showEmptyTitleWarn && (
            <div
              style={{
                display: " block",
                color: "firebrick",
                fontSize: "12px",
              }}
            >
              Please Enter Title
            </div>
          )}
          <Field>
            <Label>
              User :<Required />
            </Label>
            <Control.select model="plan.user">
              <option> </option>
              {options}
            </Control.select>
          </Field>
          {this.state.showEmptyUserWarn && (
            <div
              style={{
                display: " block",
                color: "firebrick",
                fontSize: "12px",
              }}
            >
              Please Select User
            </div>
          )}

          <Field model="plan.date">
            <label className="fullWidth">
              Date :<Required />
            </label>
            <div>
              <div className="dateControlField" onClick={this.handleCalanderShow}>
                {" "}
                {this.state.selectedDay ? moment(this.state.selectedDay).format("LL") : "Select A Date"}{" "}
              </div>
              {this.state.showDatePicker && (
                <DayPicker
                  onDayClick={this.handleDayClick}
                  disabledDays={[
                    {
                      before: new Date(),
                    },
                  ]}
                />
              )}
            </div>
          </Field>
          {this.state.showEmptyDateWarn && (
            <div
              style={{
                display: " block",
                color: "firebrick",
                fontSize: "12px",
              }}
            >
              Please Select Date
            </div>
          )}
          {this.state.showDuplicatePlanText && (
            <div
              style={{
                display: " block",
                color: "firebrick",
                fontSize: "12px",
              }}
            >
              The Plan on {moment(this.state.plan.date).format("LL")} for {this.state.plan.user.name} Already Exists.
            </div>
          )}
        </ModalBody>
      );
    }

    return (
      <Modal
        isOpen={this.props.modal}
        toggle={this.props.toggle}
        contentClassName={themeService({ default: this.props.className, retro: "retro", electric: "electric" })}
      >
        <LocalForm
          className="planform"
          model="plan"
          onUpdate={(form) => this.handleUpdate(form)}
          validators={this.planValidator}
          onChange={(values) => this.handleChange(values)}
          onSubmit={(values) => this.handleSubmit(values)}
          initialState={this.state.plan}
        >
          {this.state.modalState == "Add" && (
            <ModalHeader style={ModalStyles.modalTitleStyle}>{languageService("Add Inspection")}</ModalHeader>
          )}
          {this.state.modalState == "Edit" && (
            <ModalHeader style={ModalStyles.modalTitleStyle}>{languageService("Update Inspection")}</ModalHeader>
          )}

          {this.state.modalState == "View" && (
            <ModalHeader style={ModalStyles.modalTitleStyle}>{languageService("View Inspection")}</ModalHeader>
          )}
          {this.state.modalState == "Add" && addFormFields}
          {this.state.modalState == "Edit" && editFormFields}
          {this.state.modalState == "View" && viewFormFields}
          <ModalFooter style={ModalStyles.footerButtonsContainer}>
            {this.state.modalState == "Add" && <MyButton type="submit">{languageService("Add")}</MyButton>}
            {this.state.modalState == "Edit" && <MyButton type="submit">{languageService("Save")}</MyButton>}
            <MyButton type="button" onClick={this.handleClose} style={{ background:'#0096FF' }}>
              Close
            </MyButton>
          </ModalFooter>
        </LocalForm>
      </Modal>
    );
  }
}

export default JourneyPlanAdd;
