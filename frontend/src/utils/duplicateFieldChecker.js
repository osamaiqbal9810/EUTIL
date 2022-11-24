import _ from "lodash";
export function duplicateFieldsCheck(arrayItems, fieldKey) {
  let invalidKeys = [];
  let groupBy = _.groupBy(arrayItems, fieldKey);
  let keys = Object.keys(groupBy);
  for (let key of keys) {
    if (groupBy[key].length > 1) {
      invalidKeys.push(key);
    }
  }
  return fieldKey ? invalidKeys : null;
}
