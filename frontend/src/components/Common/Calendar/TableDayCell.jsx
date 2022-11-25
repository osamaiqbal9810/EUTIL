import React, { Component } from "react";
import UserInLineEdit from "components/JourneyPlan/JourneyPlanList/UserInLineEdit";
import { getStatusColor } from "utils/statusColors";
import SelectionListDropDown from "../SelectionListDropDown";
import SvgIcon from "react-icons-kit";
import { checkmark } from "react-icons-kit/icomoon/checkmark";
import { search } from "react-icons-kit/icomoon/search";
import { spreadsheet } from "react-icons-kit/iconic/spreadsheet";
import { themeService } from "theme/service/activeTheme.service";
import { tableCellStyle } from "./style/TableDayCell";
// import { Tooltip } from "reactstrap";
import { basicColors, retroColors, electricColors } from "../../../style/basic/basicColors";
import CalendarDatesTable from "./Calendar";
import { AssetTestCell } from "./TableDayCellFields/AssetTestCell";
class TableDayCell extends Component {
  render() {
    let comp = null;
    comp = this.props.data.map((obj, index) => {
      let field = null;
      if (this.props.version == "inspection") {
        field = (
          <InspectionRowField
            obj={obj}
            key={index}
            index={index}
            day={this.props.day}
            selectionListData={this.props.selectionListData ? this.props.selectionListData : []}
            userList={this.props.userList ? this.props.userList : []}
            updateSelectionData={this.props.updateSelectionData}
            handleViewItem={this.props.handleViewItem}
          />
        );
      } else if (this.props.version == "workOrder") {
        field = <WorkOrderRowField obj={obj} key={index} day={this.props.day} updateSelectionData={this.props.updateSelectionData} />;
      } else if (this.props.version == "assetSchedules") {
        field = <AssetTestCell obj={obj} key={obj._id} />;
      }
      return field;
    });
    return (
      <div className="table-cell">
        <DayArea day={this.props.day} />

        <RowArea dataComp={comp} />
      </div>
    );
  }
}

export default TableDayCell;

const DayArea = (props) => {
  return (
    <div className="table-date" style={themeService(tableCellStyle.tableDate)}>
      {props.day}
    </div>
  );
};

const RowArea = (props) => {
  return <div className="date-detail scrollbar"> {props.dataComp} </div>;
};

class InspectionRowField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isHover: false,
      selectionChangedCheck: false,
      inputUser: this.props.obj.temp_user ? this.props.obj.temp_user.email : this.props.obj.user.email,
    };

    this.handleEnterMouse = this.handleEnterMouse.bind(this);
    this.handleExitMouse = this.handleExitMouse.bind(this);
    this.updateSelectionData = this.updateSelectionData.bind(this);
    // this.toggle = this.toggle.bind(this);
    this.state = {
      SmallLargeText: "detail-text",
    };
  }
  // toggle() {
  //   this.setState({
  //     tooltipOpen: !this.state.tooltipOpen,
  //   });
  // }
  handleEnterMouse(e) {
    if (!this.state.isHover) {
      this.setState({ isHover: true, SmallLargeText: "detail-text-full" });
    }
  }
  handleExitMouse(e) {
    if (this.state.isHover) {
      this.setState({ isHover: false, SmallLargeText: "detail-text" });
    }
  }

  updateSelectionData(e) {
    let selection = e.target.value;
    let check = true;

    check = selection == (this.props.obj.temp_user ? this.props.obj.temp_user.email : this.props.obj.user.email) ? false : true;
    this.setState({
      selectionChangedCheck: check,
      inputUser: selection,
    });
  }
  resetState() {
    this.setState({
      isHover: false,
      selectionChangedCheck: false,
    });
  }

  render() {
    let executed = true;
    switch (this.props.obj.status) {
      case "Future Inspection":
      case "Overdue":
        executed = false;
        break;
      default:
        true;
    }
    let bgClr = getStatusColor(this.props.obj.status);
    let RandomId = this.props.obj && this.props.obj.title ? this.props.obj.title.replace(/\s/g, "") + this.props.day : "";
    return (
      <div id={RandomId} onMouseEnter={this.handleEnterMouse} onMouseLeave={this.handleExitMouse} style={{ cursor: "pointer" }}>
        <div
          onClick={(e) => {
            this.props.handleViewItem(this.props.obj);
          }}
        >
          <div className="detail-title" style={themeService(tableCellStyle.detailTitle(bgClr))}>
            <div className="detail-icon" style={themeService(tableCellStyle.detailIcon)}>
              <SvgIcon
                size={13}
                icon={search}
                style={{
                  marginRight: "5px",
                  marginLeft: "5px",
                  verticalAlign: "middle",
                  zIndex: "10",
                  position: "relative",
                }}
              />
            </div>
            <div className={this.state.SmallLargeText} style={themeService(tableCellStyle.detailText)}>
              {this.props.obj.title}
            </div>
          </div>
        </div>
        {
          //this.props.obj.title.length > 28 && (
          // <Tooltip placement="bottom" isOpen={this.state.tooltipOpen} target={RandomId} toggle={this.toggle}>
          // {this.props.obj.title}
          // </Tooltip>
          //)
        }
        {(this.state.isHover || this.state.selectionChangedCheck) && !executed && (
          <div>
            <div style={{ display: "inline-block", width: "80%" }}>
              <SelectionListDropDown
                selectedItem={this.props.obj.temp_user ? this.props.obj.temp_user.email : this.props.obj.user.email}
                selectionList={this.props.selectionListData ? this.props.selectionListData : []}
                changeSelection={this.updateSelectionData}
                userList={this.props.userList ? this.props.userList : []}
              />
            </div>
            <div style={{ display: "inline-block" }}>
              <div
                style={themeService({
                  default: { color: basicColors },
                  retro: { color: retroColors.second },
                  electric: { color: electricColors.second },
                })}
              >
                <SvgIcon
                  size={15}
                  icon={checkmark}
                  onClick={(e) => {
                    this.resetState();
                    this.props.updateSelectionData(this.state.inputUser, this.props.obj);
                  }}
                  style={{
                    marginRight: "5px",
                    marginLeft: "5px",
                    verticalAlign: "middle",
                    cursor: "pointer",
                    zIndex: "10",
                    position: "relative",
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

class WorkOrderRowField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      SmallLargeText: "detail-text",
    };
    this.handleEnterMouse = this.handleEnterMouse.bind(this);
    this.handleExitMouse = this.handleExitMouse.bind(this);
  }
  handleEnterMouse(e) {
    if (!this.state.isHover) {
      this.setState({ isHover: true, SmallLargeText: "detail-text-full" });
    }
  }
  handleExitMouse(e) {
    if (this.state.isHover) {
      this.setState({ isHover: false, SmallLargeText: "detail-text" });
    }
  }
  resetState() {
    this.setState({
      isHover: false,
    });
  }

  render() {
    let bgClr = getStatusColor(this.props.obj.status);
    let RandomId = this.props.obj && this.props.obj.mwoNumber ? this.props.obj.mwoNumber.replace(/\s/g, "") + this.props.day : "";
    return (
      <div id={RandomId} onMouseEnter={this.handleEnterMouse} onMouseLeave={this.handleExitMouse} style={{ cursor: "pointer" }}>
        <div className="detail-title" style={themeService(tableCellStyle.detailTitle(bgClr))}>
          <div className="detail-icon" style={themeService(tableCellStyle.detailIcon)}>
            <SvgIcon
              size={13}
              icon={search}
              style={{
                marginRight: "5px",
                marginLeft: "5px",
                verticalAlign: "middle",
                zIndex: "10",
                position: "relative",
              }}
            />
          </div>
          <div className={this.state.SmallLargeText} style={themeService(tableCellStyle.detailText)}>
            {this.props.obj.mwoNumber}
          </div>
        </div>
      </div>
      // <div className="detail-title" style={{ background: bgClr }}>
      //   <div className="detail-icon">
      //     <SvgIcon
      //       size={13}
      //       icon={spreadsheet}
      //       style={{
      //         marginRight: "5px",
      //         marginLeft: "5px",
      //         verticalAlign: "middle",
      //         zIndex: "10",
      //         position: "relative",
      //       }}
      //     />
      //   </div>
      //   <div className="detail-text">{this.props.obj.mwoNumber}</div>
      // </div>
    );
  }
}
