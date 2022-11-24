/* eslint eqeqeq: 0 */
import React, { Component } from "react";
import {
  Row,
  Col
} from "reactstrap";
import { CRUDFunction } from "reduxCURD/container";
import { commonPageStyle } from "components/Common/Summary/styles/CommonPageStyle";
import _ from "lodash";
import { ButtonCirclePlus } from "components/Common/Buttons";
import { withPlus } from "react-icons-kit/entypo/withPlus";
import CommonModal from "components/Common/CommonModal";
import { curdActions } from "reduxCURD/actions";

import EditableTable from "components/Common/EditableTable";
const patchColumns = [
    {
      id: "name",
      header: "Patch File Name",
      type: "text",
      field: "name",
      minWidth: 100,
      editable: false,
      possibleValues: [],
    },
    {
      id: "lastExecuted",
      header: "Last Executed",
      field: "timestamp",
      type: "text",
      minWidth: 100,
      editable: false,
      possibleValues: [],
    },
    {
      id: "actions",
      header: "Actions",
      type: "action",
      //func: calculateActions,
      immediate:["Execute", "View History"],
      minWidth: 150,
      editable: false,
    },
  ];
const executionColumns = [{
      id: "timestamp",
      header: "Date/Time",
      type: "text",
      field: "timestamp",
      minWidth: 100,
      editable: false,
      possibleValues: [],
    },
    {
      id: "status",
      header: "Status",
      field: "status",
      type: "bool",
      minWidth: 100,
      editable: false,
      possibleValues: [],
    },
    {
      id: "result",
      header: "Result",
      field: "result",
      type: "textarea",
      minWidth: 200,
      editable: false,
      possibleValues: [],
    }
    ];
class Patches extends Component {
  constructor(props) {
    super(props);
    this.state = {
    
    //   modalState: "",
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.props.getPatchs();
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.actionType !== this.props.actionType && this.props.actionType == "PATCHS_READ_SUCCESS")
    {
        this.populatePatchList(this.props.patchs);
    }
    
    if (prevProps.actionType !== this.props.actionType && this.props.actionType == "PATCH_CREATE_SUCCESS")
    {
      setTimeout(function(){
        this.props.getPatchs();
      }.bind(this),5000);    // refresh after 5 seconds
    }
  }
  handleClick(action, row) {
    //console.log(action, row);
    if(action==="Execute")
    {
        //console.log("Execute", row.name);
        this.props.createPatch({patchname: row.name});
    }
    else if(action==="View History")
    {
        let selectedPatch=row.name;
        let executions=row.executions;
        this.setState({selectedPatch: row.name, executionsList: executions});
        //console.log("View History", row.name);
    }
  }
  populatePatchList(patchprops)
  {
    let patches=[];
    //console.log(this.props.patchs);
    let patchlist = JSON.parse(this.props.patchs);
    for(let p of patchlist)
    {
        let name=p[0];
        let executions=p[1];
        let timestamp='N/A';
        if(executions && executions.length)
        {
            timestamp=executions[executions.length-1].timestamp;
        }
        patches.push({name: name, timestamp: timestamp, executions: executions});
    }     
    this.setState({patchList: patches});
  }
 
  render() {
    return (
      <Col md="12">
        <Row>
          <Col md="10">
            <div style={commonPageStyle.commonSummaryHeadingContainer}>
              <h4 style={commonPageStyle.commonSummaryHeadingStyle}>Patch List</h4>
            </div>
          </Col>
        </Row> 
        <Row>
          <Col md="12">
            {
             <EditableTable
                columns={patchColumns}
                data={this.state.patchList}
                handleActionClick={this.handleClick}
                onChange={() => {}}
                handlePageSize={this.handlePageSize}
                pageSize={this.pageSize}
                rowStyleMap={this.rowStyleMap}
                />
            }
          </Col>
        </Row>
        <Row>
          <Col md="10">
            <div style={commonPageStyle.commonSummaryHeadingContainer}>
              <h4 style={commonPageStyle.commonSummaryHeadingStyle}>Executions {this.state.selectedPatch}</h4>
            </div>
          </Col>
        </Row> 
        <Row>
          <Col md="12">
            {
             <EditableTable
                columns={executionColumns}
                data={this.state.executionsList}
                handleActionClick={this.handleClick}
                onChange={() => {}}
                handlePageSize={this.handlePageSize}
                pageSize={this.pageSize}
                rowStyleMap={this.rowStyleMap}
                />
            }
          </Col>
        </Row>

       </Col> 
        );
  }
}

//const getApplicationlookupss = curdActions.getApplicationlookupss;
let actionOptions = {
  create: true,
  update: false,
  read: true,
  delete: false,
  others:{}
  //others: { getAppMockupsTypes, setNewDynamicLangWord, setEditDynamicLangWord, removeDynamicLangWord, getApplicationlookupss },
};
let variableList = {
  /*diagnosticsReducer: { dynamicLanguageList: "" },
    applicationlookupsReducer: { applicationlookupss: [] },*/
};

const PatchesContainer = CRUDFunction(Patches, "patch", actionOptions,[]);//, ["diagnosticsReducer", "applicationlookupsReducer"]);

export default PatchesContainer;
