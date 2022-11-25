import { arrayToSelectOptions } from "../../../utils/arrayToSelectOptions";

export const GetEqRelayTypeOptions = (equipmentTypes) => arrayToSelectOptions(equipmentTypes.map((eq) => eq.type));
export const GetEquipmentTypeOptions = (equipmentTypes) => GetEqRelayTypeOptions(equipmentTypes.filter((eq) => eq.type !== "Relay"));
export const GetRelayTypeOptions = (equipmentTypes) => GetEqRelayTypeOptions(equipmentTypes.filter((eq) => eq.type === "Relay"));
export const GetEquipmentTypeIconsObject = (equipmentTypes) =>
  equipmentTypes
    .map((eq) => ({
      iconGroup: eq.iconGroup,
      type: eq.type,
    }))
    .reduce((result, eq) => {
      result[eq.type] = eq.iconGroup;
      return result;
    }, {});
export const GetEquipmentTypeFormFields = (equipmentTypes, type) => {
  let fields = equipmentTypes.find((eq) => eq.type === type);
  return (fields ? fields.schema : []).map((field) => ({
    ...field,
    col: 4,
    labelValue: field.label,
  }));
};
