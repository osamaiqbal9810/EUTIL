import React, { Component } from 'react';
import { Container, Col, Row, Label, Button, FormGroup, Table } from 'reactstrap';
import { ButtonActionsTable } from 'components/Common/Buttons';
import { themeService } from '../../../theme/service/activeTheme.service';
import { trackReportStyle } from './style/index';
import './style/style.css';
import { languageService } from 'Language/language.service';
import moment from 'moment';
import { weather_star } from 'react-icons-kit/linea/weather_star';
import { weather_mistyrain_fullmoon } from 'react-icons-kit/linea/weather_mistyrain_fullmoon';
import Icon from 'react-icons-kit';
import "./report.css";
class ReportSelection extends Component {

  render() {
    let rows =
      this.props.wpPlanFilter &&
      this.props.wpPlanFilter.length > 0 &&
      this.props.wpPlanFilter.reduce((arr, wPlan) => {
        let tasks = wPlan.tasks ? wPlan.tasks : [];
        tasks.forEach((task) => {
          let units = [];
          units = task.units ? task.units : [];
          units.forEach((unit, index) => {
            if (unit) {
              if ((unit.status =="Missed" || unit.status == "Finished") && unit.assetType !== "Geographical Quadrant" && unit.assetType !== "Neighborhood/Region" && unit.assetType !== "Location Identifier" && (unit.assetType == this.props.InputObj.assetType || this.props.InputObj.assetType == "All") && (wPlan.user.id == this.props.InputObj.user || this.props.InputObj.user == "All") && filterByName(unit, this.props)) {
                let asset = getAssetInfo(this.props.assets.assetsList, unit.id);
                let icon = checkIcon(asset);
                if (asset) {
                  arr.push(<tr key={index}>
                    <td>
                      <span style={{ verticalAlign: 'inherit', marginRight: '5px', color: 'rgb(27, 20, 100)' }}>{icon}</span>
                      {asset.unitId}
                    </td>
                    <td>{asset.assetType}</td>
                    <td>{unit.inspection_type}</td>
                    <td>{getLocationName(this.props.assets.assetsList, asset.lineId)}</td>
                    <td>{languageService(unit.status)}</td>
                    <td>{moment(asset.date).format('MM/DD/YYYY')}</td>
                    <td>{wPlan.user.name}</td>
                    <td></td>
                    <td className="action-button">
                      {unit.status == "Finished" && (
                        <ButtonActionsTable
                          handleClick={(e) => {
                            this.props.handleClick(asset,wPlan, 'view');
                          }}
                          margin="0px 10px 0px 0px"
                          buttonText={languageService('View')}
                        />
                      )}

                      {/*assets.status !== 'In Progress' && this.props.reportName === 'Asset Inspection Reports' && (
                          <ButtonActionsTable
                            handleClick={(e) => {
                              this.props.handleClick(assets, 'All');
                            }}
                            margin="0px 10px 0px 0px"
                            buttonText={languageService('All')}
                          />
                          )*/}
                    </td>
                  </tr>)

                }
              }
            }
          })
        })
        return arr;
      }, []);
    return (
      <div style={{ margin: '25px' }}>
        <hr />
        <div
          id="mainContent"
          className="table-report switch-side-track report-selection"
          style={{ background: 'transparent', background: 'white' }}
        >
          <div className="row">
            <Col md={12}>
              <Table striped bordered hover responsive="sm">
                <thead>
                  <tr>
                    <th data-field="title">
                      {languageService('Asset Name')}
                    </th>
                    <th data-field="title">
                      {languageService('Asset Type')}
                    </th>
                    <th data-field="inspection_type">
                      {languageService('Inspection Type')}
                    </th>
                    <th data-field="location">
                      {languageService('Location')}
                    </th>
                    <th data-field="action">
                      {languageService('Status')}
                    </th>
                    <th data-field="date">
                      {languageService('Date')}
                    </th>
                    <th data-field="user">
                      {languageService('User')}
                    </th>
                    <th data-field="priority_level">
                      {languageService('Priority Level')}
                    </th>
                    <th data-field="action">
                      {languageService('Action')}
                    </th>
                  </tr>
                </thead>
                <tbody style={{ background: '#fff', fontSize: '12px' }}>
                  {rows.length > 0 ? rows : <tr><td colspan={8} style={{ textAlign: 'center', color: '#183D66' }}>No Data Found</td></tr>}
                </tbody>
              </Table>
            </Col>
          </div>
        </div>
      </div>
    );
  }
}

export default ReportSelection;

function checkIcon(inspec) {
  let icon = null;
  if (inspec && inspec.inspectionTypeTag == 'weather') {
    icon = <Icon size={18} icon={weather_mistyrain_fullmoon} />;
  } else if (inspec && inspec.inspectionTypeTag == 'special') {
    icon = <Icon size={18} icon={weather_star} />;
  }
  // else {
  //   icon = <Icon size={18} icon={weather_star} />;
  // }
  return icon;
}
function getLocationName(assetsList, line) {
  if (assetsList && assetsList.length > 0) {
    let region = assetsList.find(({ _id }) => _id === line);
    if (region) {
      return region.unitId;
    }
  }
}

function getAssetInfo(assetsList, assetId) {
  if (assetsList && assetsList.length >= 0) {
    let assetInfo = assetsList.find(({ _id }) => _id === assetId);
    // console.log(assetInfo);
    if (assetInfo) {
      return assetInfo;
    }
  }
}

function filterByName(unit, props) {
  let { asset_name } = props.InputObj;

  if (asset_name !== undefined && unit) {
    if (asset_name == unit.unitId) {
      return true;
    }
    else if (asset_name.length == 0) {
      return true;
    }
    else {
      return false;
    }
  }
  else {
    return true;
  }
}