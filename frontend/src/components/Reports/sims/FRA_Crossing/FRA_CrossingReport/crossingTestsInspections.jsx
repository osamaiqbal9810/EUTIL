import React from "react";
import _ from "lodash";
import "./style.css";
import CrossingHeading from "./header";
import CrossingBody from "./body";
import { getFieldsReportForm } from "../../appFormReportsUtility";

class CrossingTestsInspections extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      basicData: {},
      reportData: {},
    };
  }

  componentDidMount() {
    this.caclulateData(this.props.gradeCrossingData);
  }
  caclulateData(gradeCrossingTests) {
    let tests = {
      FlashingLight: { condition: "", comments: "" },
      GateArms: { condition: "", comments: "" },
      WarningSystemOperation: { condition: "", comments: "" },
      Grounds: [],
      StandByPower: { condition: "", comments: "" },
      TrafficPreEmption: [],
      CutOutCircut: [],
      InsulJtsBonds: { condition: "", comments: "" },
      LampVoltages: { condition: "", comments: "" },
      LightAlignment: { condition: "", comments: "" },
      HoldClearDevice: { condition: "", comments: "" },
      WarningTimeTests: [],
      FlasherTestResults: { condition: "", comments: "", flashesPerMinute: "", flashNomen: "" },
      TimingRelayDevice: [],
    };

    gradeCrossingTests &&
      gradeCrossingTests.map((testSched) => {
        if (testSched) this.setTestsData(testSched, tests);
      });
    // console.log(tests);
    this.setState({
      tests: tests,
    });
  }
  setTestsData(testSched, tests) {
    this.arrayMethods = {
      FRA234_249: "Grounds",
      FRA234_269: "CutOutCircut",
      FRA234_261: "TrafficPreEmption",
      FRA234_259: "WarningTimeTests",
      FRA234_265: "TimingRelayDevice",
    };
    let arrayTest = this.arrayMethods[testSched.testCode];
    if (arrayTest) {
      tests[arrayTest] = this.arrayMethod(testSched, tests[arrayTest]);
    } else {
      this.objectMethods = {
        FRA234_253M: "FlashingLight",
        FRA234_255: "GateArms",
        FRA234_257: "WarningSystemOperation",
        FRA234_251: "StandByPower",
        FRA234_271: "InsulJtsBonds",
        FRA234_253_LV: "LampVoltages",
        FRA234_253_LA: "LightAlignment",
        FRA234_255c: "HoldClearDevice",
        FRA234_253A: "FlasherTestResults",
      };
      let objectTest = this.objectMethods[testSched.testCode];
      if (objectTest) {
        this.objectMethod(testSched, tests[objectTest]);
      }
    }
  }

  objectMethod(testSched, testObj) {
    let conditionField = testSched.formData && testSched.formData.find((field) => field && field.id === "test");
    let commentsField = testSched.formData && testSched.formData.find((field) => field && field.id === "com");
    testObj.condition = conditionField && conditionField.value;
    testObj.comments = commentsField && commentsField.value;
    if (testSched.testCode === "FRA234_253A") {
      let flasherField = testSched.formData && testSched.formData.find((field) => field && field.id === "desc");
      let flashperMinField = testSched.formData && testSched.formData.find((field) => field && field.id === "flash");
      testObj.flashNomen = flasherField && flasherField.value;
      testObj.flashesPerMinute = flashperMinField && flashperMinField.value;
    }
  }

  arrayMethod(testSched) {
    let data = [];
    let table = testSched && testSched.formData && testSched.formData.find((field) => field.type === "table");
    if (table && table.value) {
      data = getFieldsReportForm(table.value);
    }
    return data;
  }

  render() {
    return (
      <React.Fragment>
        <div id="mainContent" className="table-report CrossingTestsInspections" style={{ minHeight: "800px", pageBreakAfter: "always" }}>
          <CrossingHeading
            mainTitle="Inspection Report - Highway Grade Crossing Tests &
Inspections "
            notes="True"
            testType="Crossing"
            data={this.props.basicData}
            selectedAssetId={this.props.selectedAssetId}
          />
          <CrossingBody tests={this.state.tests} />
        </div>
      </React.Fragment>
    );
  }
}

export default CrossingTestsInspections;
