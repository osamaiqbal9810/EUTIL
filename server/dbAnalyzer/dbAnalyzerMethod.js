import { funcs } from "./dbAnalyzerActions";
import { argsMeaning } from "./analyzerArguments";

export async function dbAnalyzerMethod(execute, fix, mode, actions) {
  if (execute) {
    console.log("-- Running Database Analyzer --");
    console.log("");
    try {
      let iterateOn = actions ? actions : funcs;
      for (let func of iterateOn) {
        //console.log("");
        let report = await func.method(func.fix == false || func.fix == true ? func.fix : fix);
        if (report.error) {
          console.log("Error While Testing " + argsMeaning[func.name] + ": " + report.error);
        } else {
          //  console.log(argsMeaning[func.name] + " : " + report.result + report.fixed ? ", Fixed : " + report.fixed : "");
          //console.log("");
          var index = 0;
          for (let singleRes of report.resultsArray) {
            singleRes.index += index;
            //  if ((mode == 1 && singleRes.result) || (mode == 2 && !singleRes.result) || !mode) showIndividualReport(singleRes);
          }
        }
      }
    } catch (err) {
      console.log("Error performing Analysis on Database : " + err);
    }
  }
}

function showIndividualReport(singleRes) {
  console.log(
    singleRes.index + " - id: " + singleRes.id + ", name: " + singleRes.name + ", result: " + singleRes.result + singleRes.fixed
      ? ", Fixed : " + singleRes.fixed
      : "",
  );
  console.log("");
}
