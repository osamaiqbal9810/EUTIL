import React, { Component } from "react";
import TabsWrapper from "./Tabs/TabsWrapper";
import _ from "lodash";
import { CRUDFunction } from "reduxCURD/container";
import { getAssetLines } from "reduxRelated/actions/assetHelperAction";
import CheckRowElements from "./CheckRowElements/CheckRowElements";
class MultiLineSelection extends Component {
  constructor(props) {
    super(props);
    this.state = { tabsArray: ["Norris", "Albindo"], selectedTab: "", linesToShow: [], allLines: [] };
    this.handleTabClick = this.handleTabClick.bind(this);
    this.handleLineRowClick = this.handleLineRowClick.bind(this);
    this.getAllLinesFilter = this.getAllLinesFilter.bind(this);
  }

  componentDidMount() {
    this.props.setAllLineGetMethod(this.getAllLinesFilter);
    if (this.props.lineAssets.length > 0) {
      let tabsArray = _.cloneDeep(this.state.tabsArray);
      let lineAssets = _.cloneDeep(this.props.lineAssets);
      let newUnique = _.uniqBy(this.props.lineAssets, "subdivision");

      let subDivs = [];
      newUnique.forEach(element => {
        subDivs.push(element.subdivision);
      });
      lineAssets.forEach(element => {
        element.showDataOf = false;
      });
      let subDivLines = _.filter(lineAssets, { subdivision: subDivs.length > 0 ? subDivs[0] : "" });

      this.setState({
        linesToShow: subDivLines,
        allLines: lineAssets,
        tabsArray: subDivs.length > 0 ? subDivs : tabsArray,
        selectedTab: subDivs.length > 0 ? subDivs[0] : "",
      });
    } else {
      this.props.getAssetLines();
    }
  }

  getAllLinesFilter() {
    this.props.setFilterLines(this.state.allLines);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.lineAssets !== prevProps.lineAssets &&
      this.props.assetHelperActionType !== prevProps.assetHelperActionType &&
      this.props.assetHelperActionType == "GET_LINE_ASSETS_SUCCESS"
    ) {
      let tabsArray = _.cloneDeep(this.state.tabsArray);
      let lineAssets = _.cloneDeep(this.props.lineAssets);
      let newUnique = _.uniqBy(this.props.lineAssets, "subdivision");

      let subDivs = [];
      newUnique.forEach(element => {
        subDivs.push(element.subdivision);
      });
      lineAssets.forEach(element => {
        element.showDataOf = false;
      });
      let subDivLines = _.filter(lineAssets, { subdivision: subDivs.length > 0 ? subDivs[0] : "" });

      this.setState({
        linesToShow: subDivLines,
        allLines: lineAssets,
        tabsArray: subDivs.length > 0 ? subDivs : tabsArray,
        selectedTab: subDivs.length > 0 ? subDivs[0] : "",
      });
    }
  }

  handleTabClick(tab) {
    if (this.state.selectedTab !== tab) {
      let allLines = this.state.allLines;
      let subDivLines = _.filter(allLines, { subdivision: tab });
      this.setState({
        selectedTab: tab,
        linesToShow: subDivLines,
      });
    }
  }
  handleLineRowClick(line) {
    let allLines = _.cloneDeep(this.state.allLines);
    let resultIndex = _.findIndex(allLines, { _id: line._id });
    if (resultIndex > -1) {
      allLines[resultIndex].showDataOf = !allLines[resultIndex].showDataOf;
      let subDivLines = _.filter(allLines, { subdivision: this.state.selectedTab });
      this.setState({
        allLines: allLines,
        linesToShow: subDivLines,
      });
    }
  }
  render() {
    return (
      <div>
        <div>
          <TabsWrapper selectedTab={this.state.selectedTab} tabsArray={this.state.tabsArray} handleTabClick={this.handleTabClick} />
        </div>
        <div>
          <CheckRowElements data={this.state.linesToShow} onRowClick={this.handleLineRowClick} textPropInObj="unitId" keyPropInObj="_id" />
        </div>
      </div>
    );
  }
}

let actionOptions = {
  create: true,
  update: true,
  read: true,
  delete: true,
  others: { getAssetLines },
};

let variables = {
  assetHelperReducer: {
    lineAssets: [],
  },
};

let MultiLineSelectionConstructor = CRUDFunction(MultiLineSelection, "MultiLineSelection", actionOptions, variables, [
  "assetHelperReducer",
]);
export default MultiLineSelectionConstructor;
