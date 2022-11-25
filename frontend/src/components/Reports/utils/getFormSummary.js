const getTableValues = (data) => {
  let records = [];
  if (data && Array.isArray(data)) {
    records = data
      .filter((d) => d)
      .map((d) => {
        return getFormSummary(d);
      });
  }
  return records;
};

export const getFormSummary = (appForm) => {
  return appForm.form
    .filter((item) => item && item.id)
    .reduce((result, item) => {
      let value = "";
      switch (item.type) {
        case "checkbox":
          value = item.value === "true" || item.value === true ? true : false;
          break;
        case "table":
          value = getTableValues(item.value);
          break;
        default:
          value = item.value;
          break;
      }

      result[item.id] = value;
      return result;
    }, {});
};
