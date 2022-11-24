export const isJSON = (str) => {
  let toReturnObj = true;
  try {
    const json = JSON.parse(str);
    if (Object.prototype.toString.call(json).slice(8, -1) !== "Object") {
      return false;
    }
  } catch (e) {
    return false;
  }
  return toReturnObj;
};
