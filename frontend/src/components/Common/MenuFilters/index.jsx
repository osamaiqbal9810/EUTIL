import React, { Component } from "react";

import { savePageNum, clearPageNum } from "reduxRelated/actions/utilActions";
import SpinnerLoader from "components/Common/SpinnerLoader";

import { CRUDFunction } from "reduxCURD/container";
import { curdActions } from "reduxCURD/actions";

import MenuFilterLink from "./menuFilter";

const defaultMenuItem = "All";
class MenuFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinnerLoading: false,
      //selectedTab: "",

      //selectedMenuItems: [],
      // displayName: { name: defaultMenuItem, multi: true, all: true },
      //tabActive: true,
      // defaultMenuState: true,
    };
  }
  componentDidMount() {
    this.props.assets.length > 0
      ? //this.setLocations(this.props.assets),
        this.setState({
          spinnerLoading: false,
        })
      : this.props.getAssets();
    //console.log("this.props.assetChildren >>", this.props.assetChildren, this.props.lineNames);
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.assetActionType === "ASSETS_READ_SUCCESS" && this.props.assetActionType !== prevProps.assetActionType) {
      //this.setLocations(this.props.assets);
      this.setState({
        spinnerLoading: false,
      });
    }
  }

  // handelAssetChange(assetChildrenCopy) {
  //   //console.log(assetChildrenCopy);
  //   this.setState({ assetChildren: assetChildrenCopy });
  // }

  render() {
    let modelRendered = <SpinnerLoader spinnerLoading={this.state.spinnerLoading} />;
    return (
      <MenuFilterLink
        //lineNames={this.state.lineNames}
        //assetChildren={this.state.assetChildren}
        assets={this.props.assets}
        assetActionType={this.props.assetActionType}
        handelMenuClickData={this.props.handelMenuClickData}
        dataLoadedCallback={this.props.dataLoadedCallback}
        defaultMenuItem={defaultMenuItem}
        assetChildren={this.props.assetChildren}
        menuFilterApplied={this.props.menuFilterApplied}
        lineNames={this.props.lineNames}
      >
        {modelRendered}
      </MenuFilterLink>
    );
  }
}

const getAssets = curdActions.getAssets;
const getAssetType = curdActions.getAssetType;
let actionOptions = {
  create: false,
  update: false,
  read: true,
  delete: false,
  others: { savePageNum, clearPageNum, getAssets, getAssetType },
};

let variableList = {
  assetReducer: { assets: "" },
  assetTypeReducer: {
    assetTypes: [],
  },
};

const MenuFilterContainer = CRUDFunction(MenuFilter, "menu", actionOptions, variableList, ["assetReducer", "assetTypeReducer"]);
//export default MenuFilter;
export default MenuFilterContainer;
