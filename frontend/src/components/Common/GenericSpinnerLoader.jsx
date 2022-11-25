import React from "react";

import PropagateLoader from "react-spinners/PropagateLoader";
import _ from "lodash";
import { sidebarWidth, topBarHeight } from "components/Common/Variables/CommonVariables";
import { themeService } from "../../theme/service/activeTheme.service";
import { basicColors, retroColors, electricColors } from "../../style/basic/basicColors";
// Can be a string as well. Need to ensure each key-value pair ends with ;

class Loader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  componentDidMount() {
    let actionKeys = Object.keys(this.props);
    let names = [];
    for (let key of actionKeys) {
      if (key.includes("ActionType")) {
        let str = key;
        str = str.replace("ActionType", "");
        names.push(str);
      }
    }
    let actionMethodGroups = commonTasksActionTypes(names, this.props.actionMethods, this.props.customActions);
    this.setState({
      allActionTypeGroups: actionMethodGroups,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    let spinnerState = checkForSpinnerState(this.props, prevProps, this.state.allActionTypeGroups);
    if (this.state.loading !== spinnerState) {
      this.setState({ loading: spinnerState });
    }
  }

  render() {
    return (
      <React.Fragment>
        {this.state.loading && (
          <div
            style={{
              position: "fixed",
              zIndex: "2000",
              overflow: "visible",
              background: "#0000002e",
              top: topBarHeight,
              left: sidebarWidth,
              bottom: 0,
              right: 0,
            }}
          >
            <div
              style={{
                position: "absolute",
                height: "100px",
                width: "100px",
                left: "50%",
                marginLeft: "-50px",
                top: "50%",
                marginTop: "-50px",
              }}
            >
              <PropagateLoader
                loading={this.state.loading}
                color={themeService({ default: basicColors.first, retro: retroColors.first, electric: electricColors.first })}
                sizeUnit={"px"}
                size={10}
              />
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default Loader;

function commonTasksActionTypes(names, actionMethodsRec, customActions) {
  let allActionTypesToConsider = [];
  if (names) {
    let actionMethods = actionMethodsRec ? actionMethodsRec : ["READ" /*"UPDATE", "DELETE", "CREATE"*/];
    for (let name of names) {
      let customNameCheck = _.find(customActions, { name: name });

      if (customNameCheck) {
        for (let act of customNameCheck.actions) {
          allActionTypesToConsider.push({ name: name, actions: act });
        }
      } else {
        for (let actionMethod of actionMethods) {
          let aTypeREQ = name.toUpperCase() + "_" + actionMethod + "_REQUEST";
          let aTypeSUCC = name.toUpperCase() + "_" + actionMethod + "_SUCCESS";
          let aTypeFAIL = name.toUpperCase() + "_" + actionMethod + "_FAILURE";
          allActionTypesToConsider.push({ name: name, actions: [aTypeREQ, aTypeSUCC, aTypeFAIL] });
          let aTypeREQS = name.toUpperCase() + "S_" + actionMethod + "_REQUEST";
          let aTypeSUCCS = name.toUpperCase() + "S_" + actionMethod + "_SUCCESS";
          let aTypeFAILS = name.toUpperCase() + "S_" + actionMethod + "_FAILURE";
          allActionTypesToConsider.push({ name: name, actions: [aTypeREQS, aTypeSUCCS, aTypeFAILS] });
        }
      }
    }
  }
  return allActionTypesToConsider;
}

function checkForSpinnerState(props, prevProps, actionsToWatch) {
  let finalState = false;

  actionsToWatch.forEach((reqSucFailGroup) => {
    let localGroupSpinnerState = false;
    let actions = reqSucFailGroup.actions;
    let ourActionType = props[reqSucFailGroup.name + "ActionType"];
    let ourPrevActionType = prevProps[reqSucFailGroup.name + "ActionType"];
    let prevReq = ourPrevActionType == actions[0];
    let thisReq = ourActionType == actions[0];
    // let prevSuccess = ourPrevActionType == actions[1];
    // let thisSuccess = ourActionType == actions[1];
    // let prevFailure = ourPrevActionType == actions[2];
    // let thisFailure = ourActionType == actions[2];
    // let offCondition1 = (thisSuccess && !prevSuccess) || (thisFailure && !prevFailure);

    // On Condition
    if (!prevReq && thisReq) {
      localGroupSpinnerState = true;
      finalState = true;
    }
  });
  return finalState;
}

// example of using loader component
// added props of required Actions Type
//added action Method Array ["READ","CREATE","UPDATE","DELETE"]
//added custom Actions object and object consist 2 params name(string) and actions(Array of Array([request,success,Failure]))

{
  /* <Loader
  devicesActionType={this.props.actionType}
  switchMachineActionType={this.props.switchMachineActionType}
  actionMethods={["READ", "UPDATE"]}
  customActions={[
    {
      name: "switchMachine",
      actions: [
        ["GET_DEVICE_BLOCK_REQUEST", "GET_DEVICE_BLOCK_SUCCESS", "GET_DEVICE_BLOCK_FAILURE"],
        ["GET_ALL_DEVICES_BLOCK_REQUEST", "GET_ALL_DEVICES_BLOCK_SUCCESS", "GET_ALL_DEVICES_BLOCK_FAILURE"],
      ],
    },
  ]}
/>; */
}
