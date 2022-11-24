/* eslint eqeqeq: 0 */
import React, { Component } from "react";
import _ from "lodash";
import { ic_expand_more } from "react-icons-kit/md/ic_expand_more";
import { Icon } from "react-icons-kit";
import { themeService } from "../../../theme/service/activeTheme.service";
import { retroColors } from "../../../style/basic/basicColors";
class DefectCodes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defectCodesObj: null,
    };
  }
  componentDidMount() {
    let assetType, selectedAssetType, defectCodesAll, codesObj, codesArray;
    defectCodesAll = null;

    // temp var codes
    // codesArray = ["7.04", "7.03", "9.02", "9.01", "37.03"];
    if (this.props.selectedIssue && this.props.selectedIssue.unit) {
      assetType = this.props.selectedIssue.unit.assetType;
      selectedAssetType = _.find(this.props.assetTypes, { assetType: assetType });
      defectCodesAll =
        selectedAssetType && selectedAssetType.defectCodesObj && selectedAssetType.defectCodesObj.details
          ? selectedAssetType.defectCodesObj.details
          : null;
      codesArray = this.props.selectedIssue.defectCodes;
      codesObj = {};
      if (codesArray && codesArray.length > 0)
        codesArray.forEach(d_code => {
          codesObj[d_code] = d_code;
        });
      this.setState({
        codesMapObj: codesObj,
        defectCodesObj: defectCodesAll,
      });
    }
  }

  render() {
    return (
      <div style={{ width: "100%" }}>
        <DefectCodeListArea
          defects={this.state.defectCodesObj ? this.state.defectCodesObj : []}
          codes={this.state.codesMapObj}
          hierarchy={0}
          classToShow={this.props.classToShow}
        />
      </div>
    );
  }
}

export default DefectCodes;

const DefectCodeListArea = props => {
  let defArea = props.defects.map(defect => {
    let haveChildren = defect.details && defect.details.length > 0 ? true : false;
    let check = props.codes[defect.code] ? true : false;
    if (haveChildren) {
      defect.details.forEach(detail_defect => {
        check = props.codes[detail_defect.code] ? true : check;
      });
    }
    // console.log(check);
    return (
      <DefectCodeField
        defect={defect}
        key={defect.code}
        check={check}
        codes={props.codes}
        hierarchy={props.hierarchy}
        classToShow={props.classToShow}
      />
    );
  });
  return <div>{defArea}</div>;
};

class DefectCodeField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      titleColor: "",
      showChildren: false,
    };
    this.handleHideShow = this.handleHideShow.bind(this);
  }
  handleHideShow() {
    this.setState({
      showChildren: !this.state.showChildren,
    });
  }
  render() {
    return (
      <React.Fragment>
        <DefectField
          defect={this.props.defect}
          check={this.props.check}
          showChildren={this.state.showChildren}
          handleHideShow={this.handleHideShow}
          codes={this.props.codes}
          hierarchy={this.props.hierarchy}
          classToShow={this.props.classToShow}
        />
      </React.Fragment>
    );
  }
}

const DefectField = props => {
  let basicStlying = { display: "inline-block", fontSize: "12px", color: "rgb(64, 118, 179)", padding: "5px 10px", marginRight: "10px" };
  let iconShowHideStyle = {
    background: "transparent",
    border: "none",
    display: "inline-block",
    verticalAlign: "bottom",
    color: "rgb(64, 118, 179)",
    transition: "all .3s ease-in-out",
    cursor: "pointer",
    outline: "0px",

    transform: "rotate(" + (props.showChildren ? 180 : 0) + "deg)",
  };
  let haveChildren = props.defect.details && props.defect.details.length > 0 ? true : false;
  let checkStyle = props.check
    ? themeService({
        default: { background: "rgb(64, 118, 179)", color: "#fff" },
        retro: { background: retroColors.first, color: retroColors.second },
      })
    : themeService({
        default: { background: "rgb(166, 168, 171)", color: "#fff" },
        retro: { background: retroColors.eleventh, color: retroColors.second },
      });
  let bgStyle = props.check
    ? themeService({
        default: { background: "rgb(115, 202, 129)", color: "#fff" },
        retro: { background: retroColors.fifth, color: retroColors.nine },
      })
    : themeService({
        default: { background: "rgb(193, 194, 196)", color: "#fff" },
        retro: { background: retroColors.fifth, color: retroColors.nine },
      });
  let className = props.check ? "active data-row" : props.classToShow + " data-row";
  return (
    <div style={{ borderLeft: "1px solid #ccc" }}>
      <div
        className={className}
        style={{
          position: "relative",
          background: props.hierarchy % 2 == 0 ? "#fff" : "#efefef",
          borderBottom: "5px solid #fff",
          overflow: "hidden",
          marginLeft: 10 * props.hierarchy,
          ...bgStyle,
        }}
      >
        <div
          style={{
            ...basicStlying,
            ...checkStyle,
            ...{
              // marginLeft: 10 * props.hierarchy,
              minWidth: "55px",
              marginBottom: "-99999px",
              paddingBottom: "99999px",
              verticalAlign: "top",
            },
          }}
        >
          {props.defect.code}{" "}
        </div>
        <div
          style={themeService({
            defect: {
              ...basicStlying,
              color: "#fff",
              width: "80%",
              fontSize: haveChildren ? "14px" : "12px",
              fontWeight: haveChildren ? "600" : "600",
            },
            retro: {
              ...basicStlying,
              color: retroColors.second,
              width: "80%",
              fontSize: haveChildren ? "14px" : "12px",
              fontWeight: haveChildren ? "600" : "600",
            },
          })}
        >
          {props.defect.title}
        </div>
        {haveChildren && (
          <div
            style={{
              display: "inline-block",
              verticalAlign: props.showChildren ? "baseline" : "top",
              position: "absolute",
              right: "10px",
            }}
          >
            <button onClick={props.handleHideShow} style={iconShowHideStyle}>
              <Icon
                size={"24"}
                icon={ic_expand_more}
                style={themeService({
                  default: { color: "#fff", verticalAlign: "top" },
                  retro: { color: retroColors.fourth, verticalAlign: "top" },
                })}
              />
            </button>
          </div>
        )}
      </div>
      {haveChildren && props.showChildren && (
        <DefectCodeListArea
          defects={props.defect.details}
          codes={props.codes}
          hierarchy={props.hierarchy + 1}
          classToShow={props.classToShow}
        />
      )}
    </div>
  );
};
