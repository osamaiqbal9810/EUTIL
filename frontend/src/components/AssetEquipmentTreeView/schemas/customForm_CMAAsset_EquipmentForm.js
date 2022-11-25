import { themeService } from "theme/service/activeTheme.service";
import { ButtonStyle, CommonModalStyle } from "style/basic/commonControls";
export const customForm_CMAAsset_EquipmentForm = {
  title: "Add/Edit Equipment",
  id: "customForm_CMAAsset_EquipmentForm",
  stateTitle: {
    create: "Add Equipment",
    edit: "Edit Equipment",
  },
  sections: [
    {
      id: "equipmentInfoSection",
      fields: [
        {
          id: "name", // required
          type: "input", // required
          labelValue: "Name",
          required: true,
          disabledStates: ["edit"],
          col: 4,
        },
        {
          id: "equipmentType", // required
          type: "select", // required
          labelValue: "Equipment Type",
          selectOptions: [],
          updatedSectionFieldsOnCertainValue: [
            { targetSecId: "equipmentInfoAttributesSection", getSectionFieldsCallback: "GetEquipmentTypeFormFields" },
          ],
          required: true,
          disabledStates: ["edit"],
          col: 4,
        },
      ],
    },
    {
      id: "equipmentInfoAttributesSection",
      accessor: "attributes",
      returnLabelAsKey: true,
      fields: [],
    },
    {
      id: "equipmentInfoFormButtonsSection",
      fields: [
        {
          id: "addEquipment", // required
          type: "button", // required
          labelValue: "Add",
          action: "submit",
          callback: "addEquipment",
          position: "footer",
          hiddenStates: ["edit"],
          col: 6,
        },
        {
          id: "updateEquipment", // required
          type: "button", // required
          labelValue: "Update",
          action: "submit",
          callback: "updateEquipment",
          position: "footer",
          hiddenStates: ["create"],
          col: 6,
        },
        {
          id: "cancelEquipmentDialog", // required
          type: "button", // required
          labelValue: "Cancel",
          action: "cancel",
          position: "footer",
          col: 6,
        },
      ],
    },
  ],
};
