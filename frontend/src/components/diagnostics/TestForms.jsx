import React, { Component } from "react";
import { CRUDFunction } from "../../reduxCURD/container";

import { duplicateFieldsCheck } from "../../utils/duplicateFieldChecker";
import { retroColors } from "../../style/basic/basicColors";
import { curdActions } from "../../reduxCURD/actions";
class TestForms extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showValididty: false,
      valid: "",
      invalidKeys: [],
      selected: "",
    };
    this.handleValidCheck = this.handleValidCheck.bind(this);
  }
  handleValidCheck(appForm) {
    let invalidKeys = duplicateFieldsCheck(appForm.opt1, "id");
    if (invalidKeys.length > 0) {
      this.setState({
        invalidKeys: invalidKeys,
        valid: false,
        showValididty: true,
        selected: appForm.code,
      });
    } else {
      this.setState({
        invalidKeys: [],
        valid: true,
        showValididty: true,
        selected: appForm.code,
      });
    }
  }

  componentDidMount() {
    this.props.getApplicationlookupss(["appForms"]);
  }

  render() {
    let forms =
      this.props.applicationlookupss &&
      this.props.applicationlookupss.map((appForm) => {
        return (
          <div key={appForm._id} style={{ background: "#fff", padding: "7.5px 25px" }}>
            <div style={{ minWidth: "200px", display: "inline-block", fontSize: "14px", color: retroColors.second }}>{appForm.code}</div>
            <button
              style={{ marginLeft: "10px" }}
              onClick={(e) => {
                this.handleValidCheck(appForm);
              }}
            >
              Validate
            </button>
          </div>
        );
      });
    let invalidKeysComps =
      this.state.invalidKeys &&
      this.state.invalidKeys.map((invalKey) => {
        return <div key={invalKey}>{invalKey}</div>;
      });
    return (
      <div style={{ padding: "25px" }}>
        {forms}
        <div
          style={{
            padding: "15px",
            marginTop: "20px",
            background: "#fff",
            fontSize: "14px",
            fontWeight: 600,
            color: retroColors.second,
            lineHeight: 2,
          }}
        >
          Form : {this.state.selected}
          {this.state.showValididty && <div> Validity : {this.state.valid == true ? "True" : "False"}</div>}
          {this.state.showValididty && this.state.valid == false && (
            <div>
              Invlid Keys : <div>{invalidKeysComps}</div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

let variables = {
  applicationlookupsReducer: {
    applicationlookupss: [],
  },
};
const getApplicationlookupss = curdActions.getApplicationlookupss;
let actionOptions = {
  create: false,
  update: false,
  read: false,
  delete: false,
  others: { getApplicationlookupss },
};
let reducers = ["applicationlookupsReducer"];
const TestFormsContainer = CRUDFunction(TestForms, "testForm", actionOptions, variables, reducers);
export default TestFormsContainer;
