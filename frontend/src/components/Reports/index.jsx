import React, { Component } from "react";
import TIMPSReports from "./Timps/reportfilter";
import SCIMReports from "./sims/reportFilter";
//import { timpsSignalApp } from "../../config/config";
import {versionInfo} from "../MainPage/VersionInfo";
import eventBus from "../../utils/eventBus";
export default class ReportModule extends Component {
  constructor()
  {
   super();
    this.loadVersion(versionInfo, true);
    this.versionLoaded = this.versionLoaded.bind(this);
  }
  loadVersion(vInfo, initial=false)
  {
    let timpsSignalApp =  vInfo.isSITE();
    let treportsFeature = vInfo.getFeatureset('timpsReports');
    let treprotsList    = treportsFeature && treportsFeature.subset ? treportsFeature.subset:[];

    let sreportsFeature = vInfo.getFeatureset('siteReports');
    let sreprotsList    = sreportsFeature && sreportsFeature.subset ? sreportsFeature.subset:[];

    if(initial)
    {
    this.state={
      timpsSignalApp: timpsSignalApp,
      timpsReports:   treprotsList,
      siteReports:    sreprotsList
    };
    }
    else
    {
      this.setState({
      timpsSignalApp: timpsSignalApp,
      timpsReports:   treprotsList,
      siteReports:    sreprotsList
      });
    }
  }
  componentDidMount()
  {
    eventBus.on('versionLoaded', this.versionLoaded);
  }
  componentWillUnMount()
  {
    eventBus.remove('versionLoaded', this.versionLoaded);
  }
  versionLoaded(vInfo)
  {
    this.loadVersion(vInfo);
  }
  render() {
    let timpsSignalApp = this.state.timpsSignalApp;

    return (
      <React.Fragment>
        {!timpsSignalApp && <TIMPSReports list={this.state.timpsReports}/>}
        {timpsSignalApp && <SCIMReports list={this.state.siteReports}/>}
      </React.Fragment>
    );
  }
}
