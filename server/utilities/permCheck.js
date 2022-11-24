// NOT IN USE

import _ from "lodash";
export const permChecker = (permArray, resource, action) => {
  let check = false;
  check = _.find(permArray, {
    resource,
    action,
  });
  return check;
};
