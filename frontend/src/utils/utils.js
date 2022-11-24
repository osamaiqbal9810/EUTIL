/* eslint eqeqeq: 0 */

export function substractObjects(source, dest) {
  let difference = {};

  if (typeof source == "object") {
    //&& typeof dest == "object")   //&& !(source instanceof Array
    for (const key in source) {
      if (typeof source[key] == "object") {
        // && !(source[key] instanceof Array))
        let diff = substractObjects(source[key], !dest || dest == undefined ? {} : dest[key]);
        if (diff != {}) {
          difference[key] = source[key] instanceof Array ? [] : {};
          difference[key] = Object.assign(source[key] instanceof Array ? [] : {}, diff);
        }
      } else if (!dest || dest[key] == undefined || source[key] != dest[key]) {
        difference[key] = source[key];
      }
    }
  }
  return difference;
}

export function truncateNumber(num) {
  let retNum = num;
  let checkNum = Number.isInteger(retNum);
  if (!checkNum) {
    retNum = parseFloat(retNum.toFixed(2));
  }
  return retNum;
}
