import React, { Component } from "react";
import { CRUDFunction } from "reduxCURD/container";
import { curdActions } from "reduxCURD/actions";
import { getVersionManager } from "reduxRelated/actions/diagnosticsActions";
import { versionInfo } from "./VersionInfo";
// export let versionInfo = {
//     loaded:false,
//     versionInfo:{webVersion:'Not available', customer:'Not available', applicationType:'Not available'}
//     };

//import { versionInfo } from "./VersionManager";

class VersionManager extends Component {
  componentDidMount() {
    this.props.getVersions();
  }

  componentDidUpdate(prevProps) {
    if (this.props.actionType !== prevProps.actionType && this.props.actionType == "VERSIONS_READ_SUCCESS") {
      //console.log(this.props.versions);
      versionInfo.setVersionInfo(this.props.versions);
      versionInfo.loaded = true;
      if(this.props.loadCallback)
      {
          this.props.loadCallback(versionInfo);
      }
    }
  }
  render() {
    return <div> </div>;
  }
};

let actionOptions = {
  read: true,
  create: false,
  delete: false,
  update: false,
  others: {},
};
let variableList = {};
let reducers = [];
let VersionManagerContainer = CRUDFunction(VersionManager, "version", actionOptions, variableList, reducers);
export default VersionManagerContainer;
