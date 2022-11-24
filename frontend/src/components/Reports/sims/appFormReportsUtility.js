export function getFieldsReport(reportsData) {
  let basicData = [];
  reportsData &&
    reportsData.forEach(dat => {
      let formData = {};
      dat.formData &&
        dat.formData.forEach((item, i) => {
          formData = { ...formData, [item.id]: item.value };
        });
      basicData.push(formData);
    });
  return basicData;
}
