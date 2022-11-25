import { TimingRelayResultsFRA234_265Annual } from "./Timing Relay Results 234.265 Annual";
import { LightAlignmentFRA234_253Annual } from "./Light Alignment FRA 234.253 Annual";
import { InsulationJtsBondsFRA234_271 } from "./Insulation Jts Bonds Trk Conn FRA 234.271 Quarterly";
import { HoldClearDeviceFRA234_255cAnnual } from "./Hold Clear Device FRA 234.255c Annual";
import { RelayAppForm } from "./Relay Tests FRA 234.263, 236.106";
import { WarningTimeTestResultsFRA234_259Annual } from "./Warning Time Test Results FRA 234.259 Annual";
import { WarningSystemOperationFRA234_257abMonthly } from "./Warning System Operation FRA 234.257ab Monthly";
import { TrafficPreEmptionFRA234_261Monthly } from "./Traffic Pre Emption FRA 234.261 Monthly";
import { StandByPowerFRA234_251Monthly } from "./StandBy Power FRA 234.251 Monthly";
import { RelayTestsFRA234_263And236_106 } from "./Relay Tests FRA 234.263, 236.106";
import { InsulationTestsFRA234_267And236_108 } from "./Insulation Tests FRA 234.267, 236.108";
import { GroundsFRA234_249Monthly } from "./Grounds FRA 234.249 Monthly";
import { GateArmsMechanismFRA234_255abMonthly } from "./Gate Arms & Mechanism FRA 234.255ab Monthly";
import { CutOutCircuitsFRA234_269Quarterly } from "./Cut Out Circuits FRA 234.269 Quarterly";
import { FlashingLightUnitsFRA234_253Monthly } from "./Flashing Light Units FRA 234.253 Monthly";
import { FlasherTestResultsFRA234_253Annual } from "./Flasher Test Results FRA 234.253 Annual";
import { LampVoltagesFRA234_253Annual } from "./Lamp Voltages FRA 234.253 Annual";
export const fraFormGet = (code) => {
  if (code) {
    let test = fraTestForms.find((t) => t.code == code);
    let extraFields = {};
    if (test.opt1) {
      extraFields.opt1 = test.opt1;
    }
    let opt2 = test.opt2 ? { ...test.opt2 } : { ...testObj.opt2, allowedInstruction: test.instructionFiles };
    let obj = {
      ...testObj,
      code: test.code,
      description: test.description,
      opt2: opt2,
      ...extraFields,
    };
    return obj;
  } else {
    let forms = [];
    forms = fraTestForms.map((test) => {
      let extraFields = {};
      if (test.opt1) {
        extraFields.opt1 = test.opt1;
      }
      let opt2 = test.opt2 ? { ...test.opt2 } : { ...testObj.opt2 };
      let obj = {
        ...testObj,
        code: test.code,
        description: test.description,
        opt2: opt2,
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
    allowedAssetTypes: [],
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

const fraTestForms = [
  {
    code: "FRA234_269",
    description: "Cut-out circuits",
    opt1: CutOutCircuitsFRA234_269Quarterly,
  },
  {
    code: "FRA234_253A",
    description: "Flashing light units and lamp voltage Annual",
    opt1: FlasherTestResultsFRA234_253Annual,
  },
  {
    code: "FRA234_253M",
    description: "Flashing light units and lamp voltage Monthly",
    opt1: FlashingLightUnitsFRA234_253Monthly,
  },

  {
    code: "FRA234_255",
    description: "Gate arm and gate mechanism",
    opt1: GateArmsMechanismFRA234_255abMonthly,
  },
  {
    code: "FRA234_249",
    description: "Ground tests",
    opt1: GroundsFRA234_249Monthly,
  },
  {
    code: "FRA234_255c",
    description: "Hold-clear devices",
    opt1: HoldClearDeviceFRA234_255cAnnual,
  },
  { code: "FRA234_271", description: "Insulated rail joints, bond wires, and track connections", opt1: InsulationJtsBondsFRA234_271 },
  {
    code: "FRA234_267And236_108",
    description: "Insulation resistance tests, wires in trunking and cables",
    opt1: InsulationTestsFRA234_267And236_108,
  },
  { code: "FRA234_253_LV", description: "Lamp Voltages", opt1: LampVoltagesFRA234_253Annual },
  { code: "FRA234_253_LA", description: "Light Alignment", opt1: LightAlignmentFRA234_253Annual },
  {
    code: "FRA234_263And236_106",
    description: "Relays",
    opt1: RelayTestsFRA234_263And236_106,
    opt2: {
      config: [],
      classify: "point",
      allowedInstruction: [],
      restrictAssetTypes: [],
      allowedAssetTypes: [],
      childAppForms: ["RelayAppForm"],
    },
  },
  {
    code: "FRA234_251",
    description: "Standby power",
    opt1: StandByPowerFRA234_251Monthly,
  },
  {
    code: "FRA234_265",
    description: "Timing Relay Test",
    opt1: TimingRelayResultsFRA234_265Annual,
  },
  {
    code: "FRA234_261",
    description: "Highway traffic signal pre-emption",
    opt1: TrafficPreEmptionFRA234_261Monthly,
  },
  {
    code: "FRA234_257",
    description: "Warning system operation",
    opt1: WarningSystemOperationFRA234_257abMonthly,
  },
  {
    code: "FRA234_259",
    description: "Warning time",
    opt1: WarningTimeTestResultsFRA234_259Annual,
  },
  {
    code: "RelayAppForm",
    description: "Relay App Form",
    opt1: RelayAppForm,
    opt2: { target: "equipment", allowedEquipmentTypes: ["Relay"], parentTestCode: "FRA234_263And236_106" },
  },
];
