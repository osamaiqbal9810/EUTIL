import React, { Component, useState } from "react";
import ThisTable from "components/Common/ThisTable/index";
import moment from "moment";
import Gravatar from "react-gravatar";
import { getStatusColor } from "utils/statusColors.js";
import { Link, Route } from "react-router-dom";
import { ButtonActionsTable } from "components/Common/Buttons";
import _ from "lodash";
import CommonFilters from "components/Common/Filters/CommonFilters";
import permissionCheck from "utils/permissionCheck.js";
import SelectOption from "components/Common/SelectOption";
import { languageService } from "../../Language/language.service";
import { themeService } from "../../theme/service/activeTheme.service";
import { statusStyle } from "../JourneyPlan/JourneyPlanList/style";
import { generalSort } from "../../utils/sortingMethods";
import CommonModal from "components/Common/CommonModal";
import StyledCheckBox from "./StyledCheckBox";
import { Col, Row } from "reactstrap";

const FORM_SELECTION = {
  MAIN: "main",
  CUSTOM_MULTI_SELECT: "custom_multi_select",
};

class EditableTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null,
      filteredData: [],
      tableOptions: {},
      columns: [],
      pageSize: 30,
      page: 0,
      formView: FORM_SELECTION.MAIN,
      fieldForManage: null,
      selectAll: false,
    };

    // Each coloumn should contain: id, Header, minWidth, type(text, date, time, datetime, gps, status, action),
    //            fieldName, editing
    //

    // let cols = this.props.columns;
    // this.columns=[];

    // cols.forEach((col, index)=>{
    //     let c={
    //         id : col.id ? col.id : col.header,
    //         Header : col.header,
    //         minWidth : col.minWidth ? col.minWidth : 150,
    //         accessor : col.accessor ? col.accessor : this.getAccessor(col.field, col.type, col.field, col.possibleValues, col.immediate ? col.immediate:{}, col.editMode ? col.editMode:{})
    //     };
    //     this.columns.push(c);
    // });
    this.handlePageSave = this.handlePageSave.bind(this);
    this.manageMultiSelection = this.manageMultiSelection.bind(this);
    this.handleCancelModal = this.handleCancelModal.bind(this);
    this.handleChangeSelectionFieldModal = this.handleChangeSelectionFieldModal.bind(this);
    this.handleSubmitModal = this.handleSubmitModal.bind(this);
    this.handleClickOnSelectAll = this.handleClickOnSelectAll.bind(this);
  }
  manageMultiSelection(fieldForManage) {
    this.openModelMethod();
    this.setState({ fieldForManage, selectAll: false });
  }
  handleCancelModal() {
    this.setState({ fieldForManage: null, selectAll: false });
  }
  handleChangeSelectionFieldModal(value, isAdd) {
    let { fieldForManage } = this.state;
    if (fieldForManage) {
      if (isAdd) {
        if (fieldForManage[fieldForManage.fieldName]) fieldForManage[fieldForManage.fieldName].push(value);
        else fieldForManage[fieldForManage.fieldName] = [value];
      } else {
        if (fieldForManage[fieldForManage.fieldName])
          fieldForManage[fieldForManage.fieldName] = fieldForManage[fieldForManage.fieldName].filter((f) => f !== value);
      }
    }

    this.setState({ fieldForManage });
  }
  handleSubmitModal() {
    let { fieldForManage } = this.state;
    this.props.onChange(fieldForManage.fieldName, fieldForManage[fieldForManage.fieldName], fieldForManage);
  }
  getAccessor(name, type, field, possibleValues, immediate, editModeText, permissionItems, func, formatter, possibleValuesWithTitle, editable) {
    // type(text, date, time, datetime, gps, status, action),
    //            fieldName, editing
    let ret = (d) => {
      let val = null;
      // console.log('accessor:', type, field,immediate, typeof func, d);
      if ((d && d[field] != undefined) || (immediate && immediate.length > 0) || (func && typeof func === "function")) {
        if (func && typeof func === "function") {
          if (this.state.tableOptions && this.state.tableOptions.funcArg) {
            val = func(d, this.state.tableOptions.funcArg);
          } else {
            val = func(d);
          }
          //console.log("editabletable function value", name, type, val);
        } else if (immediate && immediate.length > 0) {
          //console.log('editabletable immediate value', name, type);
          val = immediate.map((v, i) => {
            return v;
          });

          if (editable && d.editMode && editModeText && editModeText.length > 0) {
            val = editModeText.map((v, i) => {
              //console.log("in Edit mode", v);
              return v;
            });
          }
        } else {
          //console.log('editabletable field value', name, type);
          val = d[field];
          if (formatter && typeof formatter === "function") {
            val = formatter(val);
          }
        }

        if (editable && d.editMode && type === "multiple") {
          // let size = val.length > 5 ? 5 : val.length;
          // let items = val.slice(0, size).toString().split(",").join(", ");

          val = (
            <Row>
              <Col md={10}>
                <span className="inspection-names">{val}</span>
              </Col>
              <Col md={2}>
                <ButtonActionsTable
                  handleClick={() => {
                    let copyOfD = _.cloneDeep(d);
                    copyOfD.possibleValues = possibleValues;
                    copyOfD.possibleValuesWithTitle = possibleValuesWithTitle;
                    copyOfD.fieldName = "destinations";
                    this.manageMultiSelection(copyOfD);
                  }}
                  margin="0px 10px 0px auto"
                  padding="3px 5px"
                  border="1px solid"
                  color={"white"}
                  backgroundColor="var(--first)"
                  hover="var(--first)"
                  buttonText={languageService("Manage")}
                />
              </Col>
            </Row>
          );
        }

        if (type == "text") {
          //val=d[field];
          if (editable && d.editMode) {
            if (possibleValues && possibleValues.length > 0) {
              // display select option
              val = (
                <SelectOption
                  name={name}
                  options={possibleValues}
                  selected={val}
                  onChange={(n, v) => {
                    this.props.onChange(n, v, d);
                  }}
                />
              );
            } else {
              // display editable text field
              //console.log('text area', val); //console.log('onchange', {e}, e.target.value);
              val = (
                <textarea
                  value={val}
                  onChange={(e) => {
                    this.props.onChange(name, e.target.value, d);
                  }}
                ></textarea>
              );
            }
          }
        } else if (type == "timestamp" || type == "datetime") {
          val = moment(val).format("llll");
        } else if (type == "date") {
          val = moment(val).format("ll");
        } else if (type == "gps") {
          let valueTaskStartLoc = "",
            planStr = val;
          let linkSrc = "#";
          if (planStr !== "" && planStr) {
            const [lat, lon] = planStr.split(",");
            valueTaskStartLoc = `Lat: ${lat}, Lon: ${lon}`;
            linkSrc = "https://www.google.com/maps/place/" + planStr;
          }

          val = (
            <a href={linkSrc} style={{ color: "inherit" }} target="_blank">
              {valueTaskStartLoc}{" "}
            </a>
          );
        } else if (type == "status") {
          val = <div style={themeService(statusStyle.statusColorStyle(val, this.props))}>{languageService(val)}</div>;
        } else if (type === "user") {
          if (val && val.name) {
            val = <div>{val.name}</div>;
          }
        } else if (type === "action") {
          //console.log('action', val);
          if (val.length && val.length > 0) {
            let v1 = val.map((v, i) => {
              let permCheckReq = permissionItems && permissionItems[i];
              let permissionPass = true;
              if (permCheckReq) {
                permissionPass = permissionCheck(permissionItems[i][0], permissionItems[i][1]);
              }
              return (
                <React.Fragment>
                  {permissionPass && (
                    <ButtonActionsTable
                      handleClick={(e) => {
                        this.props.handleActionClick(v, d);
                      }}
                      margin="0px 10px 0px 0px"
                      buttonText={languageService(v)}
                      key={i}
                    />
                  )}
                </React.Fragment>
              );
            });
            val = <div>{v1}</div>;
          }
        } else if (type == "bool") {
          if (val === false || val === true) {
            val = (
              <div>
                <input
                  type="checkbox"
                  style={{ margin: "-7px 0px 0px 12px" }}
                  checked={val}
                  onChange={(e) => {
                    this.props.onChange(name, e.target.value, d);
                  }}
                />
              </div>
            );
          }
        } else if (type == "radio") {
          if (val === false || val === true) {
            val = (
              <div>
                <input
                  type="radio"
                  style={{ margin: "-7px 0px 0px 12px" }}
                  checked={val}
                  onChange={(e) => {
                    this.props.onChange(name, e.target.value, d);
                  }}
                />
              </div>
            );
          }
          else if(type === "select-button" && editable && d.editMode) {
            if (possibleValues && possibleValues.length > 0) {
              // display select option
              val = (
                <SelectOption
                  name={name}
                  options={possibleValues}
                  selected={val}
                  onChange={(n, v) => {
                    this.props.onChange(n, v, d);

                  }}
                />
              );
            }
          }
        }
      }
      //else console.log(field not found)

      return languageService(val);
    };

    return ret;
  }
  updateColumns() {
    let cols = this.props.columns;
    let columns = [];

    cols.forEach((col, index) => {
      let c = {
        id: col.id ? col.id : col.header,
        Header: col.header,
        minWidth: col.minWidth ? col.minWidth : 150,
        accessor: col.accessor
          ? col.accessor
          : this.getAccessor(
              col.field,
              col.type,
              col.field,
              col.possibleValues,
              col.immediate ? col.immediate : {},
              col.editMode ? col.editMode : {},
              col.permissionCheck ? col.permissionCheck : null,
              col.func ? col.func : null,
              col.formatter ? col.formatter : null,
              col.possibleValuesWithTitle,
              col.editable
            ),
            resizable: col.resizable,
      };
      // debugger;
      if (col.type === "status" || col.type === "priority") c.sortMethod = generalSort;
      columns.push(c);
    });

    this.setState({ columns: columns });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.columns != prevProps.columns || prevProps.updateColumnToggle !== this.props.updateColumnToggle) {
      this.updateColumns();
    }

    // if(this.props.actionType=='MAINTENANCES_READ_SUCCESS' && this.props.maintenanceData)
    // {
    //     let l=this.props.maintenanceData.length;
    //     if(l !=this.state.dataLength && l > 0 )
    //     {
    //         //console.log('MaintenanceList->componentDidUpdate', this.props.maintenanceData);
    //         this.setState({filteredData: this.props.maintenanceData, dataLength: l});
    //     }
    // }
    // console.log('maintenancelist->componentdidupdate', this.props.maintenanceData);
    // console.log(prevProps.actionType !== this.props.actionType, this.props.actionType=='MAINTENANCES_READ_SUCCESS', this.props.maintenanceData.length);
    // if(prevProps.actionType !== this.props.actionType && this.props.actionType=='MAINTENANCES_READ_SUCCESS')
    // {
    //     if(this.props.maintenanceData.length > 0)
    //     {
    //         console.log('MaintenanceList->componentDidUpdate', this.props.maintenanceData);
    //        // console.log('got data in maintenance list componentdidupdate', this.props.maintenaceData);
    //         this.setState({filteredData: this.props.maintenaceData});
    //     }
    // }
  }

  componentDidMount() {
    this.updateColumns();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return { filteredData: nextProps.data, tableOptions: nextProps.tableOptions };
  }

  handlePageSave(page, pageSize) {
    this.setState({
      page: page,
      pageSize: pageSize,
    });
  }

  handleClickOnSelectAll(fieldForManage, selectAll) {
    if (fieldForManage && fieldForManage.possibleValuesWithTitle && fieldForManage.possibleValuesWithTitle.length) {
      fieldForManage.possibleValuesWithTitle.forEach((pv) => this.handleChangeSelectionFieldModal(pv.value, selectAll));
    }
    this.setState({ selectAll });
  }

  render() {
    let columns = this.state.columns;
    let fieldForManage = this.state.fieldForManage;
    if (this.props.noActionColumn) {
      _.remove(columns, { id: "actions" });
    }

    return (
      <div style={{ padding: "0px 15px 15px", width: "-webkit-fill-available" }}>
        <CommonModal
          handleSubmitClick={this.handleSubmitModal}
          headerText={languageService("Select Recepient(s)")}
          handleCancelClick={this.handleCancelModal}
          setModalOpener={(method) => {
            this.openModelMethod = method;
          }}
        >
          <div style={{ display: "inline-block", marginLeft: "15px" }}>
            <StyledCheckBox
              checked={this.state.selectAll}
              chkLabel={languageService("Select All")}
              onClick={() => this.handleClickOnSelectAll(fieldForManage, !this.state.selectAll)}
            />
          </div>
          <div className="inspection-manage scrollbar" style={{ background: "var(--fifth)" }}>
            <Col md={12}>
              <div style={{ width: "auto", display: "inline-block" }}>
                {fieldForManage &&
                  fieldForManage.possibleValuesWithTitle &&
                  fieldForManage.possibleValuesWithTitle.length &&
                  fieldForManage.possibleValuesWithTitle.map((pv, i) => {
                    let checked = false;

                    if (fieldForManage[fieldForManage.fieldName].includes(pv.value)) checked = true;

                    return (
                      <div className="asset-type-select">
                        <StyledCheckBox
                          checked={checked}
                          key={i}
                          chkLabel={`${pv.text}`}
                          onClick={() => {
                            this.handleChangeSelectionFieldModal(pv.value, !checked);
                          }}
                        />
                      </div>
                    );
                  })}
              </div>
            </Col>
          </div>
        </CommonModal>

        {!this.props.noFilter && (
          <CommonFilters
            noFilters
            tableInFilter
            //checkTodayAllFilter={this.props.checkTodayAllFilter}
            showCustomFilter
            customFilterComp={this.props.customFilterComp}
            tableColumns={columns}
            tableData={this.state.filteredData}
            pageSize={this.props.pageSize ? this.props.pageSize : this.state.pageSize}
            pagination={this.props.pagination ? this.props.pagination : true}
            handlePageSave={this.props.handlePageSave ? this.props.handlePageSave : this.handlePageSave}
            page={this.props.page ? this.props.page : this.state.page}
            defaultSorted={this.props.defaultSorted ? this.props.defaultSorted : []}
            handlePageSize={this.props.handlePageSize}
            rowStyleMap={this.props.rowStyleMap ? this.props.rowStyleMap : []}

          />
        )}
      </div>
    );
  }
}

export default EditableTable;
