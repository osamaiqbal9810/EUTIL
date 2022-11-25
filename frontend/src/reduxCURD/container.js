import { containerExistCheck, saveContainer } from "./settings";
import { createActionTypes } from "./actions";
import { setcommonReducers } from "./reducer";
import { connect } from "react-redux";
import * as CURDACTIONS from "./types";

export function CRUDFunction(Component, name, actionOptions, variablesList, additionalReducer, apiName, customActionItems) {
  let container = containerExistCheck(name);
  if (container) {
    return container;
  } else {
    let nameReducer = [name] + "Reducer";
    let currentName = name;
    let myCustomReducers = additionalReducer;
    // console.log(nameReducer);

    if (!actionOptions) {
      actionOptions = {
        create: true,
        update: true,
        read: true,
        delete: true,
        others: {},
      };
    }

    let actionRelated = createActionTypes(name, actionOptions, apiName);
    let customActionRelated = {};
    setcommonReducers(name);
    CURDACTIONS.setCommonTasks(actionRelated.actionTypes);
    if (customActionItems && customActionItems.length > 0) {
      for (let item of customActionItems) {
        let valid = validateItem(item);
        if (valid) {
          let customApiName = item.apiName ? item.apiName : apiName ? apiName : name;
          let customActionOpts = item.actionOptions ? item.actionOptions : { ...actionOptions };
          let customActionMethods = createActionTypes(item.name, customActionOpts, customApiName);
          customActionRelated = { ...customActionRelated, ...customActionMethods.actions };
          CURDACTIONS.setCommonTasks(customActionMethods.actionTypes);
          setcommonReducers(item.name);
        }
      }
    }

    const mapStateToProps = (state) => {
      const thisReducer = state[nameReducer];
      let myReducer = {};
      let customVariables = {};
      let myActionsType = {};
      let myErrorMessage = {};
      if (myCustomReducers && variablesList) {
        myCustomReducers.forEach((reducer) => {
          myReducer[reducer] = state[reducer];
          let reducerComponentName = reducer.replace("Reducer", "");
          let variableKeys = Object.keys(variablesList[reducer]);
          variableKeys.forEach((variableName) => {
            customVariables[variableName] = myReducer[reducer][variableName];
            myActionsType[reducerComponentName + "ActionType"] = myReducer[reducer].actionType;
            myErrorMessage[reducerComponentName + "ErrorMessage"] = myReducer[reducer].errorMessage;
          });
        });
      }
      const actionType = thisReducer.actionType;
      const errorMessage = thisReducer.errorMessage;
      customVariables[name] = thisReducer[currentName];
      customVariables[name + "s"] = thisReducer[currentName + "s"];
      if (customActionItems && customActionItems.length > 0) {
        for (let item of customActionItems) {
          let valid = validateItem(item);
          if (valid) {
            let itemReducer = state[item.name + "Reducer"];
            customVariables[item.name] = itemReducer[item.name];
            customVariables[item.name + "s"] = itemReducer[item.name + "s"];
            myActionsType[item.name + "ActionType"] = itemReducer.actionType;
            myErrorMessage[item.name + "ErrorMessage"] = itemReducer.errorMessage;
          }
        }
      }

      // if (!myReducer && variablesList) {
      //   console.error(
      //     'Please Make sure an Array of Custom Reducer(string name) for Custom Variables(array of object which contains variables for each reducer) for each reducer is provided. (custom reducer is 5th argument and variables are 4th arguement) '
      //   )
      // } else if (myReducer && !variablesList) {
      //   console.error(
      //     'Please Make sure an Array of Custom Reducer(string name) for Custom Variables(array of object which contains variables for each reducer) for each reducer is provided. (custom reducer is 5th argument and variables are 4th arguement) '
      //   )
      // }

      return {
        ...customVariables,
        errorMessage,
        ...myErrorMessage,
        actionType,
        ...myActionsType,
      };
    };

    const mapDispatchToProps = (dispatch) => {
      let actionsObj = actionRelated.actions;
      let customActions = actionRelated.customAction;
      let dispatchActions = {};
      let actionsKeys = Object.keys(actionsObj);
      actionsKeys.forEach((funcName) => {
        dispatchActions[funcName] = (arg, id) => {
          return dispatch(actionsObj[funcName](arg, id));
        };
      });
      let funcKey = Object.keys(customActions);
      funcKey.forEach((funcName) => {
        dispatchActions[funcName] = (arg, id) => {
          return dispatch(customActions[funcName](arg, id));
        };
      });
      let customActionkeys = Object.keys(customActionRelated);
      customActionkeys.forEach((funcName) => {
        dispatchActions[funcName] = (arg, id) => {
          return dispatch(customActionRelated[funcName](arg, id));
        };
      });
      return {
        ...dispatchActions,
      };
    };

    container = connect(mapStateToProps, mapDispatchToProps)(Component);
    saveContainer(container, name);
    return container;
  }
}

function validateItem(item) {
  if (!item) {
    return false;
  }
  if (!item.name) {
    return false;
  }
  return true;
}
