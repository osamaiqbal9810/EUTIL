export function createNewCreateableSelectOption(label) {
  return {
    label: label,
    value: label,
  };
}

export function convertToCreateableSelectOptions(labels) {
  return labels.map((label) => createNewCreateableSelectOption(label));
}

export function convertArrayToSelectOptions(labels) {
  let options = [{ val: "", text: "Select" }];
  return [
    ...options,
    ...labels.map((label) => ({
      val: label,
      text: label,
    })),
  ];
}
