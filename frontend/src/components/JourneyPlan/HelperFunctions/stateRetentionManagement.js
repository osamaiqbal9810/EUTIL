/* eslint eqeqeq: 0 */
import { LIST_VIEW_SELECTION_TYPES } from "../ViewSelection.js";
import { languageService } from "Language/language.service";
//import { timpsSignalApp } from "../../../config/config";
import moment from "moment";
export const TEMPLATE_INSPECTION_FILTERS = {
  listViewDataToShow: LIST_VIEW_SELECTION_TYPES.LIST, //timpsSignalApp ? LIST_VIEW_SELECTION_TYPES.LinearView : LIST_VIEW_SELECTION_TYPES.LinearView,
  lineNames: [],
  assetChildren: null,
  fromDashboard: null,
  rangeState: { today: moment().endOf("day"), from: moment().startOf("month"), to: moment().endOf("month") },
  dateFilterName: "Month",
  activeSummary: "Total",
  pageSize: 30,
};

export const getCurrentInspectionStateFilters = (inspectionFilterState) => {
  let stateToReturn = TEMPLATE_INSPECTION_FILTERS;
  if (inspectionFilterState) {
    let dashboardRelatedFields = {
      listViewDataToShow: inspectionFilterState.listViewDataToShow,
      assetChildren: inspectionFilterState.assetChildren,
      rangeState: inspectionFilterState.rangeState,
      dateFilterName: inspectionFilterState.dateFilterName,
      lineNames: inspectionFilterState.lineNames,
      activeSummary: inspectionFilterState.activeSummary,
      pageSize: inspectionFilterState.pageSize,
    };
    if (inspectionFilterState.fromDashboard) {
      dashboardRelatedFields = {
        listViewDataToShow: inspectionFilterState.fromDashboard.listViewDataToShow,
        assetChildren: inspectionFilterState.fromDashboard.assetChildren,
        lineNames: inspectionFilterState.fromDashboard.lineNames,
        dateFilterName: inspectionFilterState.fromDashboard.dateFilterName,
        activeSummary: inspectionFilterState.fromDashboard.activeSummary,
        pageSize: inspectionFilterState.fromDashboard.pageSize,
      };
      inspectionFilterState.fromDashboard.rangeState &&
        (dashboardRelatedFields.rangeState = inspectionFilterState.fromDashboard.rangeState);
    }

    stateToReturn = {
      ...dashboardRelatedFields,
    };
  }

  return stateToReturn;
};
