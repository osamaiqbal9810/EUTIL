import _ from "lodash";
import React, { Component } from "react";
import EditableTable from "components/Common/EditableTable";
import { languageService } from "../../Language/language.service";
import permissionCheck from "utils/permissionCheck.js";
import { themeService } from "../../theme/service/activeTheme.service";
import { basicColors, retroColors, electricColors } from "../../style/basic/basicColors";
import { checkmark } from "react-icons-kit/icomoon/checkmark";
import SvgIcon, { Icon } from "react-icons-kit";
import { Tooltip } from "reactstrap";
import { ic_gps_fixed } from "react-icons-kit/md/ic_gps_fixed";
import CommonModal from "../Common/CommonModal";
import moment from "moment";
function calculateActions(obj) {
  let allowedActions = [];
  // console.log(`calculate action for ${obj} at state: ${state}`);
  if (!obj.isRemoved) allowedActions.push("Delete");
  // if(!obj.workplanId || obj.workplanId==='') allowedActions.push('Assign');

  return allowedActions;
}

export default class ATIVDataList extends Component {
  constructor(props) {
    super(props);
    let ativColumns = [
      {
        id: "timestamp",
        header: languageService("Date"),
        type: "timestamp",
        field: "createdAt",
        minWidth: 90,
        editable: false,
      },
      {
        id: "title",
        header: languageService("Title"),
        field: "title",
        type: "text",
        minWidth: 75,
        editable: false,
        possibleValues: [],
      },
      {
        id: "Milepost",
        header: languageService("Milepost"),
        field: "milepost",
        type: "text",
        minWidth: 60,
        editable: false,
        possibleValues: [],
        accessor: (d) => {
          let str = `${d.latitude},${d.longitude}`;
          let locationSrc = "https://www.google.com/maps/place/" + str;
          return (
            <div>
              <span>
                <a href={locationSrc} style={{ color: "inherit" }} target="_blank">
                  <SvgIcon icon={ic_gps_fixed} style={{ marginRight: "5px" }} />
                  {d.lineName}
                </a>
              </span>
              <span>{d.milepost}</span>
            </div>
          );
        },
      },
      {
        id: "properties",
        header: languageService("Details"),
        field: "properties",
        type: "text",
        // formatter: (v)=>{
        //     let vx = JSON.stringify(v,null, 4);
        //     let lines = vx.split('\n');
        //     let display =<div> {lines.map((l,i)=>{return (<div key={i}>{l}</div>)})} </div>

        //     return display;//<textarea value={vx}></textarea>
        // },
        accessor: (d) => {
          return (
            <DetailsDisplay
              d={d}
              detailOnClick={(e) => {
                this.setState({ detailData: d });
                this.openDetailModel && this.openDetailModel();
              }}
            />
          );
        },

        minWidth: 125,
        editable: false,
        possibleValues: [],
        resizable: true,
      },
      {
        id: "verified",
        header: languageService("Verified"),
        field: "verified",
        type: "text",
        minWidth: 50,
        accessor: (d) => {
          let check = d.verified;
          return check ? (
            <div
              style={{ color: retroColors.second, textAlign: "center", cursor: "pointer" }}
              onClick={(e) => {
                this.setState({ verifiedData: d });
                this.openVerifiedModel && this.openVerifiedModel();
              }}
            >
              <SvgIcon icon={checkmark} />
            </div>
          ) : (
            ""
          );
        },
        resizable: true,
      },
      {
        id: "workplanId",
        header: languageService("Inspection"),
        field: "workplanId",
        type: "slelect-button",
        minWidth: 150,
        editable: true,
        accessor: (d) => {
          return (
            <CheckSelect
              key={d._id}
              d={d}
              value={d.workplanId}
              templatesList={this.props.templatesList}
              handleUpdateButton={(obj, value) => {
                // console.log('assign:', {value}, 'to', {id});
                this.props.updateWorkplan(obj, value);
              }}
            />
          );
        },
      },

      {
        id: "actions",
        header: languageService("Actions"),
        type: "action",
        func: calculateActions,
        // immediate:["Assign", "Delete"],
        minWidth: 100,
        editable: true,
      },
    ];

    this.state = {
      columns: ativColumns,
      editableAtivData: [],
      verifiedData: {},
    };
    this.openVerifiedModel = null;
    this.openDetailModel = null;
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let editableAtivData = nextProps.ativData.map((ar, index) => {
      const wpAssigned = ar.workplanId && ar.workplanId !== "";
      let obj = { editMode: !wpAssigned, index: index };
      if (!wpAssigned) obj["workplanId"] = "";
      return { ...ar, ...obj };
    });

    return { editableAtivData };
  }

  render() {
    return (
      <React.Fragment>
        <CommonModal
          headerText={"Verification Info"}
          setModalOpener={(model) => (this.openVerifiedModel = model)}
          footerCancelText={"Close"}
        >
          <VerifiedData data={this.state.verifiedData} />
        </CommonModal>
        <CommonModal headerText={"Detail Info"} setModalOpener={(model) => (this.openDetailModel = model)} footerCancelText={"Close"}>
          <DetailData data={this.state.detailData} />
        </CommonModal>

        <EditableTable
          columns={this.state.columns}
          data={this.state.editableAtivData}
          handleActionClick={this.props.handleClick}
          onChange={() => {}}
          handlePageSize={this.props.handlePageSize}
          pageSize={this.props.pageSize}
        />
      </React.Fragment>
    );
  }
}
/**
tableOptions={{ funcArg: props.addMR }}
rowStyleMap={props.rowStyleMap}      
 */

class CheckSelect extends Component {
  constructor(props) {
    super(props);
    this.state = { value: undefined };

    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(id, target) {
    this.setState({ value: target.value });
  }
  componentDidMount() {
    if (this.props.value) {
      this.setState({ value: this.props.value });
      return;
    }
    let list = this.props.templatesList; // this.props.getList();
    if (list && list.length) {
      this.setState({ value: list[0].id });
      return;
    }
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    // if (prevState.value) return {};
    if (nextProps.value && prevState.value !== nextProps.value) return { value: nextProps.value };
    if (!prevState.value && nextProps.templatesList && nextProps.templatesList.length) return { value: nextProps.templatesList[0].id };

    return {};
  }
  getValueToText(value) {
    let list = this.props.templatesList; // this.props.getList();
    let item = list.find((v) => {
      return v.id === value;
    });
    if (item && item.name) return item.name;

    return "<Unknown>";
  }
  render() {
    let changeable = this.props.d.editMode;
    let list = this.props.templatesList; // this.props.getList(); // ['1','2','3'];

    let optionsList = (
      <React.Fragment>
        $
        {list.map((l, i) => {
          return (
            <option key={l.id} value={l.id}>
              {" "}
              {l.name}{" "}
            </option>
          );
        })}
      </React.Fragment>
    );

    return (
      <div>
        {changeable && (
          <React.Fragment>
            <div style={{ display: "inline-block" }}>
              <select
                disabled={false}
                onChange={(e) => {
                  this.handleChange(this.props.d._id, e.target);
                }}
                name="workplanId"
                value={this.state.value}
                style={{ width: "150px" }}
              >
                {optionsList}
              </select>
              <React.Fragment>
                {this.props.d.editMode && (
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
                        onClick={(e) => this.props.handleUpdateButton(this.props.d, this.state.value, "save")}
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
                )}
              </React.Fragment>
            </div>
          </React.Fragment>
        )}
        {!changeable && <React.Fragment>{this.getValueToText(this.state.value)}</React.Fragment>}
      </div>
    );
    // }
  }
}

class DetailsDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = { tooltipOpen: false };
  }
  render() {
    let dataObj = Object.assign(
      { Milepost: this.props.d.milepost, Title: this.props.d.title, Latitude: this.props.d.latitude, Longitude: this.props.d.longitude },
      this.props.d.properties,
    );
    let selector = "detail-" + this.props.d.index;
    let display = <div></div>, shortDisplay=<div></div>;

    if (dataObj) {
      display = jsonToDisplay(dataObj);
     shortDisplay = jsonToDisplay(dataObj, 2);
    }
    return (
      <div onClick={this.props.detailOnClick} style={{ cursor: "pointer" }}>
        <div id={selector}>
          <span>{shortDisplay}</span>

          <Tooltip
            style={{ minWidth: "300px" }}
            target={selector}
            isOpen={this.state.tooltipOpen}
            toggle={() => {
              this.setState({ tooltipOpen: !this.state.tooltipOpen });
            }}
          >
            <b>
              {this.props.d.title} at {this.props.d.milepost}
            </b>
            <br />
            <br />
            {display}
          </Tooltip>
        </div>
      </div>
    );
  }
}

function jsonToDisplay(jsonObj, maxRows = 0) {
  let display = "";
  if (jsonObj) {
    let keys = Object.keys(jsonObj);
    
    // reduce the number of rows to display if a limit is specified
    if(maxRows > 0 && keys.length > maxRows) 
        keys = keys.slice(0, maxRows);
    
    display = keys.map((k, i) => {
      return (
        <tr key={k} style={{ textAlign: "left" }}>
          <td>
            <b>{k}</b>
          </td>
          <td>{jsonObj[k]}</td>
        </tr>
      );
    });
  }
  return (
    <table>
      <tbody>{display}</tbody>
    </table>
  );
}

const DetailData = (props) => {
  let data =
    props.data &&
    Object.assign(
      {
        Milepost: props.data.milepost,
        Title: props.data.title,
        Latitude: props.data.latitude,
        Longitude: props.data.longitude,
      },
      props.data.properties,
    );

  let toRet = null;
  if (data) {
    toRet = [];
    for (let k in data) {
      let retRow = (
        <div className="verifyRow">
          <span className="verifiyLabel">{k}</span>
          {data[k]}
        </div>
      );
      toRet.push(retRow);
    }
  }
  return <div className="verifyInfoContainer">{toRet}</div>;
};

const VerifiedData = (props) => {
  let verificationObj = props.data && props.data.verificationProps;
  let str = `${verificationObj.vLatitude},${verificationObj.vLongitude}`;
  let locationSrc = "https://www.google.com/maps/place/" + str;
  return (
    <React.Fragment>
      <div className="verifyInfoContainer">
        <div className="verifyRow">
          <span className="verifiyLabel">Defect Code</span>
          <span className="verifiyField"> {verificationObj.defCode}</span>
        </div>
        <div className="verifyRow">
          <span className="verifiyLabel">Defect Description</span>
          <span className="verifiyField"> {verificationObj.defDescription}</span>{" "}
        </div>
        <div className="verifyRow">
          <span className="verifiyLabel">Location</span>
          {verificationObj && (
            <span>
              <a href={locationSrc} style={{ color: "inherit" }} target="_blank">
                <SvgIcon icon={ic_gps_fixed} style={{ marginRight: "5px" }} />
              </a>
              View On Map
            </span>
          )}
        </div>
        <div className="verifyRow">
          <span className="verifiyLabel">Verified By</span>
          <span className="verifiyField"> {verificationObj.user && verificationObj.user.name}</span>{" "}
        </div>
        <div className="verifyRow">
          <span className="verifiyLabel">Date</span>
          <span className="verifiyField"> {verificationObj.verifiedDate && moment(verificationObj.verifiedDate).format("lll")}</span>{" "}
        </div>
      </div>
    </React.Fragment>
  );
};
