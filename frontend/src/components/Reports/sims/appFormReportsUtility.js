export function getFieldsReport(reportsData) {
  let basicData = [];
  reportsData &&
    reportsData.forEach((dat) => {
      let formData = {};
      dat.formData &&
        dat.formData.forEach((item, i) => {
          if (item) {
            formData = { ...formData, [item.id]: item.value };
          }
        });
      formData.testSched = dat;
      basicData.push(formData);
    });
  return basicData;
}

export function getFieldsReportForm(reportsData, checkCode, codeField) {
  let basicData = [];
  reportsData &&
    reportsData.forEach((dat) => {
      let toCheck = checkCode && codeField ? checkCode === dat[codeField] : true;
      if (toCheck) {
        let formData = {};

        dat.form &&
          dat.form.forEach((item, i) => {
            if (item) {
              formData = { ...formData, [item.id]: item.value };
            }
          });
        formData.testSched = dat;
        basicData.push(formData);
      }
    });
  return basicData;
}
