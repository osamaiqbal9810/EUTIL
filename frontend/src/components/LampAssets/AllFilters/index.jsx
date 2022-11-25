import React, { Component } from "react";
import AssetTypeFilter from "../AssetTypeFilter/AssetTypeFilter";
import DateAndLineFilter from "components/Common/Filters/DateAndLineFilter";
import { CRUDFunction } from "reduxCURD/container";
import { getMultiLineData } from "reduxRelated/actions/lineSelectionAction";
import LineFilterTemp from "../LocationFilter/lineFilterTemp";
import { commonFilterStyles } from "../../Common/Filters/styles/CommonFilterStyle";
import { themeService } from "../../../theme/service/activeTheme.service";
class AllFilters extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    //console.log(this.props.lineAssetsToShow);
    return (
      <React.Fragment>
        <div
          style={{
            display: "inline-block",
            //padding: "15px 15px 15px 0px",
            verticalAlign: "top",
            width: "76%",
            overflowX: "scroll",
            overflowY: "hidden",
            minHeight: "35px",
            WebkitBoxShadow: "rgba(0, 0, 0, 0.65) 15px 3px 20px -15px",
            MozBoxShadow: "rgba(0, 0, 0, 0.65) 15px 3px 20px -15px",
            boxShadow: "rgba(0, 0, 0, 0.65) 15px 3px 20px -15px",
          }}
          className="scrollbarHor"
        >
          <div style={{ minWidth: "100%" }}>
            <div style={{ display: "inline-block" }}>
              {/* <DateAndLineFilter
                displayDateElement="false"
                getMultiLineData={this.props.multipleLinesSelectHandler}
                apiCall="asset"
                setDefaultObjects={this.props.setDefaultObjects}
              /> */}
              {/* <LineFilterTemp
                lineAssetsToShow={this.props.lineAssetsToShow}
                showLocationAsset={this.props.showLocationAsset}
                clearLineFilter={this.props.clearLineFilter}
                locationAssetType={this.props.locationAssetType}
                locationFilter={this.props.locationFilter}
              /> */}
            </div>
            {/* <div style={{ display: "inline-block", color: "var(--first)" }}> |</div> */}
            <div style={{ display: "inline-block" }}>
              <AssetTypeFilter
                assetType={this.props.assetType}
                filterState={this.props.filterState}
                handleAssetTypeFilterClick={this.props.handleAssetTypeFilterClick}
              />
              <div style={themeService(commonFilterStyles.divider)}> | </div>
            </div>

            {this.props.assetTypeFilterComponent}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

let variables = {
  userReducer: {
    userList: [],
  },
  sodReducer: {
    sodList: [],
  },
  utilReducer: {
    planPageNum: 0,
    planFilter: "all",
    planPageSize: 10,
  },
  lineSelectionReducer: {
    selectedLine: {},
    multiData: [],
  },
  inspectionHelperReducer: {
    futureInspection: null,
  },
  templateHelperReducer: {},
};

let actionOptions = {
  create: false,
  update: false,
  read: false,
  delete: false,
  others: { getMultiLineData },
};
//export default AllFilters;
let AllFiltersContainer = CRUDFunction(AllFilters, "assets", actionOptions, variables, [
  "userReducer",
  "sodReducer",
  "utilReducer",
  "lineSelectionReducer",
  "inspectionHelperReducer",
  "templateHelperReducer",
]);
export default AllFiltersContainer;
