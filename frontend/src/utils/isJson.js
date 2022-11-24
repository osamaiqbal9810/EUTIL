export const isJSON = (str: string) => {
  let toReturnObj = "";
  try {
    const json = JSON.parse(str);
    if (Object.prototype.toString.call(json).slice(8, -1) !== "Object") {
      return false;
    }
    toReturnObj = json;
  } catch (e) {
    return false;
  }
  return toReturnObj;
};
