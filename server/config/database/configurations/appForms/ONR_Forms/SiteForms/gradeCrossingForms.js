import { batteryCardForm } from "./batteryCardForm";
import { Preemption } from "./testForms/Preemption";
import { MSCW } from "./testForms/MSCW";
import { preemptionRoadAuthority } from "./testForms/Preemption Road Authority";
import { InspectingFoundations } from "./testForms/Inspecting Foundations";
import { cableHousing } from "./testForms/Cable Housing";
import { timerRelaysDevices } from "./testForms/Timer Relays and Devices";
import { recordingDevice } from "./testForms/Recording Device";
import { conditionSitePlans } from "./testForms/Condition Site Plans";
import { warningTime } from "./testForms/Warning Time";

import { flasherOperation } from "./testForms/Flasher Operation";
import { trackCircuits } from "./testForms/Track Circuits";
import { lightUnitsAlignment } from "./testForms/Light Units Alignment";
import { batteryLoad } from "./testForms/Battery Load Test";
import { lampVoltage } from "./testForms/Lamp Voltage";
import { GateMechanismInspection } from "./testForms/Gate Mechanism Inspection";
import { CutOutCircuits } from "./testForms/Cut out Circuits";
import { insulatedTrackHardware } from "./testForms/Insulated Track hardware";
import { relaysVisualInspection } from "./testForms/Relays Visual Inspection";
import { batteryTestExhaustion } from "./testForms/Battery Test Exhaustion";
import { foulingCircuits } from "./testForms/Fouling Circuits";
import { switchCircuitController } from "./testForms/Switch Circuit Controller";
import { warningSystemApproaches } from "./testForms/Warning System approaches";
import { powerOffIndicator } from "./testForms/Power Off indicator";
import { standbyPWRTest } from "./testForms/Standby PWR test";
import { GateOperation } from "./testForms/Gate operation";
import { bellOperation } from "./testForms/Bell operation";
import { lightUnitSign } from "./testForms/Light unit and sign";
import { secondaryBatteryTest } from "./testForms/Secondary Battery Test";
import { primaryBattery } from "./testForms/Primary Battery Test";
import { circuitGNDFaults } from "./testForms/Circuit GND and Isolation Faults";
import { lightningSurgeProtection } from "./testForms/Lightning and Surge  Protection";
import { logBookOpt1 } from "./testForms/Log book audit";
export const gradeListOfTestsForm = [
  { code: "grade_1001b1", description: "Log Book Audit", opt1: logBookOpt1, instructionFiles: ["SSIT-1001(b)1 Log Book Audit.pdf"] },
  {
    code: "grade_303",
    description: "Lightning and Surge Protection",
    instructionFiles: ["SSIT-303 Lightning _ Surge Protection.pdf"],
    opt1: lightningSurgeProtection,
  },
  {
    code: "grade_201",
    description: "Circuit Ground and Isolation Faults",
    instructionFiles: ["SSIT-201 Circuit Ground _ Isolation Fault Test.pdf"],
    opt1: circuitGNDFaults,
  },
  {
    code: "grade_202",
    description: "Primary Batteries",
    opt1: primaryBattery,
    instructionFiles: ["SSIT-202 Primary Batteries - Inspecting _ Testing.pdf"],
  },
  {
    code: "grade_203",
    description: "Secondary Batteries",
    instructionFiles: ["SSIT-203 Secondary Batteries - Inspecting _ Testing.pdf"],
    opt1: secondaryBatteryTest,
  },
  {
    code: "grade_1001(b)2",
    description: "Light Units & Signs: Operation",
    instructionFiles: ["SSIT-1001(b)2 Warning System Light Units _ Signs - Operation.pdf"],
    opt1: lightUnitSign,
  },
  { code: "grade_1001(b)3", description: "Bell Operation", opt1: bellOperation, instructionFiles: ["SSIT-1001(b)3 Bell Operation.pdf"] },
  { code: "grade_1001(b)4", description: "Gate Operation", opt1: GateOperation, instructionFiles: ["SSIT-1001(b)4 Gate Operation.pdf"] },
  {
    code: "grade_1001(b)5",
    description: "Standby Power Operation",
    opt1: standbyPWRTest,
    instructionFiles: ["SSIT-1001(b)5 Standby Power Operation.pdf"],
  },
  {
    code: "grade_1001(b)6",
    description: "Power Off Indicator",
    opt1: powerOffIndicator,
    instructionFiles: ["SSIT-1001(b)6 Power Off Indicator.pdf"],
  },
  {
    code: "grade_1001(b)7",
    description: "Preemption",
    opt1: Preemption,
    instructionFiles: ["SSIT-1001(b)7 Vehicle Traffic Systems - Preemption.pdf"],
  },
  {
    code: "grade_1001(b)8",
    description: "CW & MS - Equipment",
    opt1: MSCW,
    instructionFiles: ["SSIT-1001(b)8 Constant Warning and Motion Sensors - Equipment.pdf"],
  },
  {
    code: "grade_801",
    description: "Switch Circuit Controller",
    opt1: switchCircuitController,
    instructionFiles: ["SSIT-801 Switch Circuit Controllers.pdf"],
  },
  { code: "grade_703", description: "Fouling Circuits", opt1: foulingCircuits, instructionFiles: ["SSIT-703 Fouling Circuits.pdf"] },
  {
    code: "grade_1001(c)1",
    description: "Battery Test - Exhaustion",
    opt1: batteryTestExhaustion,
    instructionFiles: ["SSIT-1001(c)1 Battery Test - Exhaustion.pdf"],
  },
  {
    code: "grade_401(a)",
    description: "Relays - Visual Inspection",
    opt1: relaysVisualInspection,
    instructionFiles: ["SSIT-401(a) Inspecting and Testing Relays.pdf"],
  },
  {
    code: "grade_701",
    description: "Insulated Track Hardware",
    opt1: insulatedTrackHardware,
    instructionFiles: ["SSIT-701 Insulated Track Hardware.pdf"],
  },
  {
    code: "grade_1001(d)1",
    description: "Cut-Out Circuits",
    opt1: CutOutCircuits,
    instructionFiles: ["SSIT-1001(d)1 Cut-Out Circuits.pdf"],
  },
  {
    code: "grade_1001(d)2",
    description: "Gate Mechanism - Inspection",
    opt1: GateMechanismInspection,
    instructionFiles: ["SSIT-1001(d)2 Gate Mechanism - Inspection.pdf"],
  },
  { code: "grade_1001(e)1", description: "Lamp Voltage", opt1: lampVoltage, instructionFiles: ["SSIT-1001(e)1 Lamp Voltage.pdf"] },
  {
    code: "grade_1001(e)2",
    description: "Battery Load Test",
    opt1: batteryLoad,
    instructionFiles: ["SSIT-1001(e)2 Battery Load Test.pdf"],
  },
  {
    code: "grade_1001(e)3",
    description: "Light Units - Alignment",
    opt1: lightUnitsAlignment,
    instructionFiles: ["SSIT-1001(e)3 Light Units - Alignment.pdf"],
  },
  { code: "grade_702", description: "Track Circuits", opt1: trackCircuits, instructionFiles: ["SSIT-702 Track Circuits.pdf"] },
  {
    code: "grade_1001(e)4",
    description: "Flasher Operation",
    opt1: flasherOperation,
    instructionFiles: ["SSIT-1001(e)4 Flasher Operation.pdf"],
  },
  {
    code: "grade_1001(e)5",
    description: "Warning System - Approaches",
    opt1: warningSystemApproaches,
    instructionFiles: ["SSIT-1001(e)5 Warning System - Approaches.pdf"],
  },
  { code: "grade_1001(e)6", description: "Warning Time", opt1: warningTime, instructionFiles: ["SSIT-1001(e)6 Warning Time.pdf"] },
  {
    code: "grade_1001(e)7",
    description: "Condition of Site Plans",
    opt1: conditionSitePlans,
    instructionFiles: ["SSIT-1001(e)7 Condition of Site Plans.pdf"],
  },
  {
    code: "grade_1001(e)8",
    description: "Recording Devices",
    opt1: recordingDevice,
    instructionFiles: ["SSIT-1001(e)8 Recording Devices.pdf"],
  },
  {
    code: "grade_402",
    description: "Timer Relays & Devices",
    opt1: timerRelaysDevices,
    instructionFiles: ["SSIT-402 Timer Relays _ Devices.pdf"],
  },
  { code: "grade_901", description: "Cable Housing", opt1: cableHousing, instructionFiles: ["SSIT-901 Cable Housing.pdf"] },
  {
    code: "grade_1101",
    description: "Inspecting Foundations",
    opt1: InspectingFoundations,
    instructionFiles: ["SSIT-1101 Inspecting Foundations.pdf"],
  },
  {
    code: "grade_1001(e)9",
    description: "Preemption – Road Authority",
    opt1: preemptionRoadAuthority,
    instructionFiles: ["SSIT-1001(e)9 Preemption _ Interconnection - Road Authority.pdf"],
  },
];

export const gradeFormGet = (code) => {
  if (code) {
    let test = gradeListOfTestsForm.find((t) => t.code == code);
    let extraFields = {};
    if (test.opt1) {
      extraFields.opt1 = test.opt1;
    }
    let obj = {
      ...testObj,
      code: test.code,
      description: test.description,
      opt2: { ...testObj.opt2, allowedInstruction: test.instructionFiles },
      ...extraFields,
    };
    return obj;
  } else {
    let forms = [];
    forms = gradeListOfTestsForm.map((test) => {
      let extraFields = {};
      if (test.opt1) {
        extraFields.opt1 = test.opt1;
      }
      let obj = {
        ...testObj,
        code: test.code,
        description: test.description,
        opt2: { ...testObj.opt2, allowedInstruction: test.instructionFiles },
        ...extraFields,
      };
      return obj;
    });
    return forms;
  }
};

const testObj = {
  tenantId: "ps19",
  listName: "appForms",
  code: "",
  description: "",
  opt2: {
    config: [],
    classify: "point",
    allowedInstruction: [],
    restrictAssetTypes: [],
    allowedAssetTypes: ["Grade Crossing Warning"],
  },
  opt1: [
    {
      id: "Inspected",
      fieldName: "Inspected",
      fieldType: "checkbox",
      tag: "completionCheck",
    },
  ],
};
