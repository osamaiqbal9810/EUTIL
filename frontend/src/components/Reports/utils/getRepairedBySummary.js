import { dataFormatters } from "../../../utils/dataFormatters";
import _ from 'lodash'

export const getRepairedBySummary = (issue, usersSignatures) => {
  let repairedBySummary = {
    name: '',
    date: '',
    signature: ''
  }
  if (issue.serverObject) {
    repairedBySummary.date = dataFormatters.dateFormatter(issue.serverObject.repairDate);
    if (issue.serverObject.repairedBy && usersSignatures && usersSignatures.length > 0) {
      let sig = _.find(usersSignatures, { email: issue.serverObject.repairedBy.email });
      let userName = issue.serverObject.repairedBy.name;
      if (sig && sig.signature) repairedBySummary.signature = sig.signature.imgName;
      if (userName) repairedBySummary.name = issue.serverObject.repairedBy.name;
    }
  }
  return repairedBySummary;
}