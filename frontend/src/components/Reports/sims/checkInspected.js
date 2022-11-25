import _ from "lodash";
export function checkInspectedForm(form, formField) {
  let completed = false;
  if (form[formField] && form[formField].length > 0) {
    let OuiIndex = _.findIndex(form[formField], (field) => {
      return field && (field.id == "yes" || field.id == "inspected" || field.tag == "completionCheck");
    });
    if (OuiIndex > -1) {
      completed = form[formField][OuiIndex].value == "true" || form[formField][OuiIndex].value == true ? true : false;
    }
  }
  return completed;
}
