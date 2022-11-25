import React, { Component } from "react";
import { CRUDFunction } from "../../reduxCURD/container";

import { duplicateFieldsCheck } from "../../utils/duplicateFieldChecker";
import { basicColors, retroColors, electricColors } from "style/basic/basicColors";
import { curdActions } from "../../reduxCURD/actions";
import { Row, Col } from "reactstrap";
class TestForms extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showValididty: false,
      valid: "",
      invalidKeys: [],
      selected: "",
      formName: "",
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
        formName: appForm.description,
      });
    } else {
      this.setState({
        invalidKeys: [],
        valid: true,
        showValididty: true,
        selected: appForm.code,
        formName: appForm.description,
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
          <div key={appForm._id} style={{ background: "var(--fifth)", padding: "7.5px 25px" }}>
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
        <Row>
          <Col md={4}>
            <div style={{ overflow: "scroll", height: "80vh" }}>{forms}</div>
          </Col>
          <Col md={8}>
            <div
              style={{
                padding: "15px",

                background: "var(--fifth)",
                fontSize: "14px",
                fontWeight: 600,
                color: retroColors.second,
                lineHeight: 2,
                display: "inline-block",
              }}
            >
              Form : {this.state.selected}
              Form Name : {this.state.formName}
              {this.state.showValididty && <div> Validity : {this.state.valid == true ? "True" : "False"}</div>}
              {this.state.showValididty && this.state.valid == false && (
                <div>
                  Invlid Keys : <div>{invalidKeysComps}</div>
                </div>
              )}
            </div>
          </Col>
        </Row>
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
