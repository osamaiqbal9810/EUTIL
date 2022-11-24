import React, { Component } from "react";
import { ModalStyles } from "components/Common/styles.js";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Control, LocalForm, Errors } from "react-redux-form";
import "components/Common/commonform.css";
import _ from "lodash";
import { ic_check_box_outline_blank } from "react-icons-kit/md/ic_check_box_outline_blank";
import { ic_check_box } from "react-icons-kit/md/ic_check_box";
import SvgIcon from "react-icons-kit";
import { languageService } from "Language/language.service";
const Label = (props) => <label> {props.children}</label>;
const Field = (props) => <div className="field">{props.children}</div>;

const Required = () => <span className="required-fld">*</span>;
const MyButton = (props) => (
  <button className="setPasswordButton" {...props}>
    {props.children}
  </button>
);

class CategoryAddEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalState: "None",
      newListName: false,
      category: {
        description: "",
        opt1: "",
        opt2: "",
        code: "",
        listName: "",
      },
      showCodeDuplciateMsg: false,
    };

    this.handleClose = this.handleClose.bind(this);
    this.handleCheckBoxClick = this.handleCheckBoxClick.bind(this);
  }

  handleClose() {
    this.setState({
      modalState: "None",
      newListName: false,
      category: {
        description: "",
        opt1: "",
        opt2: "",
        code: "",
        listName: "",
      },
      showCodeDuplciateMsg: false,
    });
    this.props.toggle("None", null);
  }

  handleChange(categoryChanged) {
    let copyCat = this.state.category;
    let cat = { ...copyCat };
    cat.description = categoryChanged.description;
    cat.opt1 = categoryChanged.opt1;
    cat.opt2 = categoryChanged.opt2;
    cat.code = categoryChanged.code;

    this.setState({
      category: cat,
      showCodeDuplciateMsg: false,
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.modalState == "Add" && nextProps.modalState !== prevState.modalState) {
      return {
        category: {
          description: "",
          opt1: "",
          opt2: "",
          code: "",
          listName: "",
        },
        showCodeDuplciateMsg: false,
        newListName: false,
        modalState: nextProps.modalState,
      };
    } else if (
      nextProps.modalState == "Edit" &&
      nextProps.modalState !== prevState.modalState &&
      nextProps.selectedCategoryField !== prevState.category
    ) {
      return {
        category: nextProps.selectedCategoryField,
        showCodeDuplciateMsg: false,
        newListName: false,
        modalState: nextProps.modalState,
      };
    } else {
      return null;
    }
  }

  handleUpdate(form) {}
  handleSubmit(category) {
    //console.log(category)
    //console.log('state category : ')
    //console.log(this.state.category)
    let checkExistingCode = false;
    let result = _.find(this.props.categoryList, { code: this.state.category.code });
    if (!result || result == this.props.selectedCategoryField) {
      if (this.state.modalState == "Add") {
        this.props.handleAddSubmit(category, this.state.newListName);
      }
      if (this.state.modalState == "Edit") {
        this.props.handleEditSubmit(this.state.category);
      }
      this.setState({
        modalState: "None",
        category: {
          description: "",
          opt1: "",
          opt2: "",
          code: "",
          listName: "",
        },
        showCodeDuplciateMsg: false,
      });
      this.props.toggle("None", null);
    } else {
      this.setState({
        showCodeDuplciateMsg: true,
      });
    }
  }

  handleCheckBoxClick() {
    this.setState({
      newListName: !this.state.newListName,
    });
  }

  render() {
    return (
      <Modal isOpen={this.props.modal} toggle={this.props.toggle} className={this.props.className}>
        <LocalForm
          className="commonform"
          model="category"
          onUpdate={(form) => this.handleUpdate(form)}
          onChange={(values) => this.handleChange(values)}
          onSubmit={(values) => this.handleSubmit(values)}
          initialState={this.state.category}
        >
          {this.state.modalState == "Add" && (
            <ModalHeader style={ModalStyles.modalTitleStyle}>{languageService("Add Category List")}</ModalHeader>
          )}
          {this.state.modalState == "Edit" && (
            <ModalHeader style={ModalStyles.modalTitleStyle}>{languageService("Edit Category List")}</ModalHeader>
          )}
          <ModalBody>
            <Field>
              <Label>
                {languageService("Description")} :<Required />
              </Label>
              <Control.text model="category.description" placeholder="Describe" />
              <Errors
                model="category.description"
                wrapper={this.errorWrapper}
                component={this.errorComponent}
                show={this.errorShow}
                messages={{
                  required: "Please provide Description.",
                }}
              />
            </Field>
            <Field>
              <Label>Code :</Label>
              <Control.text model="category.code" placeholder="Code" />
              <Errors
                model="category.code"
                wrapper={this.errorWrapper}
                component={this.errorComponent}
                show={this.errorShow}
                messages={{
                  required: "Please provide Code.",
                }}
              />
            </Field>
            {this.state.showCodeDuplciateMsg && (
              <div style={{ display: " block", color: "firebrick", fontSize: "12px" }}>The Code already exists for other listing Field</div>
            )}
            <Field>
              <Label>Option 1 :</Label>
              <Control.text model="category.opt1" placeholder="Option 1" />
              <Errors
                model="category.opt1"
                wrapper={this.errorWrapper}
                component={this.errorComponent}
                show={this.errorShow}
                messages={{
                  required: "Please provide Option 1.",
                }}
              />
            </Field>
            <Field>
              <Label>Option 2 :</Label>
              <Control.text model="category.opt2" placeholder="Option 2" />
              <Errors
                model="category.opt2"
                wrapper={this.errorWrapper}
                component={this.errorComponent}
                show={this.errorShow}
                messages={{
                  required: "Please provide Option 2.",
                }}
              />
            </Field>
            <Field>
              <div onClick={this.handleCheckBoxClick}>
                <div style={{ color: "rgba(64, 118, 179)", display: "inline-block" }}>
                  <SvgIcon size={16} icon={this.state.newListName ? ic_check_box : ic_check_box_outline_blank} />
                </div>
                <div style={{ padding: "0px 5px", color: "rgba(64, 118, 179)", fontSize: "14px", display: "inline-block" }}>
                  Create New List
                </div>
              </div>
            </Field>
            {this.state.newListName && (
              <Field>
                <Label>List Name :</Label>
                <Control.text model="category.listName" placeholder="List Name" />
                <Errors
                  model="category.listName"
                  wrapper={this.errorWrapper}
                  component={this.errorComponent}
                  show={this.errorShow}
                  messages={{
                    required: "Please provide List Name.",
                  }}
                />
              </Field>
            )}
          </ModalBody>
          <ModalFooter style={ModalStyles.footerButtonsContainer}>
            {this.state.modalState == "Add" && <MyButton type="submit">{languageService("Add")} </MyButton>}
            {this.state.modalState == "Edit" && <MyButton type="submit">{languageService("Edit")} </MyButton>}
            <MyButton type="button" onClick={this.handleClose}>
              {languageService("Close")}
            </MyButton>
          </ModalFooter>
        </LocalForm>
      </Modal>
    );
  }
}

export default CategoryAddEdit;
