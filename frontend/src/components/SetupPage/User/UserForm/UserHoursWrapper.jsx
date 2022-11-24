import React, { Component } from "react";
import { getAppMockupsTypes } from "reduxRelated/actions/diagnosticsActions";
import { CRUDFunction } from "reduxCURD/container";
class UserHoursWrapper extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getAppMockupsTypes("GlobalUserLocLogging");
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.diagnosticsActionType !== prevProps.diagnosticsActionType &&
      this.props.diagnosticsActionType == "GLOBAL_USER_LOGGING_GET_SUCCESS"
    ) {
      this.props.setGlobalGeoLocOpt(this.props.userLogging ? this.props.userLogging.opt1.GlobalGeoLogging : false);
    }
  }
  render() {
    return (
      <div>
        <div>{this.props.children}</div>
      </div>
    );
  }
}

let variables = {
  diagnosticsReducer: { userLogging: null },
};

let actionOptions = {
  create: false,
  update: false,
  read: false,
  delete: false,
  others: {
    getAppMockupsTypes,
  },
};
let reducers = ["diagnosticsReducer"];
let UserHoursWrapperContainer = CRUDFunction(UserHoursWrapper, "UserHoursGlobalSetting", actionOptions, variables, reducers);

export default UserHoursWrapperContainer;
