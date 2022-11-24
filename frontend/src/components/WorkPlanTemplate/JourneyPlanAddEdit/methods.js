import { guid } from "utils/UUID";
import _ from "lodash";

export const getFilteredRuns = (runs, lineId, getRuns) => {
  let runsFiltered = runs.filter((run) => run.runLineID === lineId);
  let ranges = [];

  !getRuns && runsFiltered.forEach((r) => r.runRange.forEach((rr) => ranges.push(rr)));
  return ranges;
};

export function processRangeFieldsFromVariables(formFields, inspectionTitleFields) {
  let runRange = {};
  runRange.mpStart = formFields.runStart.value;
  runRange.mpEnd = formFields.runEnd.value;
  runRange.runId = formFields.runId.value;
  runRange.lineId = inspectionTitleFields.lineId.value;
  runRange.id = guid();
  return runRange;
}

export function filterRunRanges(lineRunNumbers) {
  let runRanges = [];
  lineRunNumbers.forEach((run, index) => {
    run.runRange.forEach((runRange, index) => {
      runRange.runParentId = run._id;

      runRanges.push(runRange);
    });
  });
  let filtered = _.uniq(runRanges);
  return filtered;
}

export function inspectionPlanFieldsWithoutRangeAdd(fields) {
  let __fields = _.cloneDeep(fields);
  delete __fields.runStart;
  delete __fields.runEnd;
  delete __fields.runId;
  return __fields;
}

export function getUniqueRunRangesFromLines(lines, lineId, whole) {
  let RunRangeOptions = getFilteredRuns(lines, lineId);
  RunRangeOptions = RunRangeOptions.map((runRange) => {
    return whole
      ? runRange
      : {
          val: runRange.runId,
          text: runRange.runId,
          id: runRange.id,
        };
  });
  return RunRangeOptions;
}
