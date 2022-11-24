import { languageService } from "Language/language.service";
import { LIST_VIEW_SELECTION_TYPES } from "../ViewSelection.js";
export const TEMPLATE_MAINTENANCE_FILTERS = {
  listViewDataToShow: LIST_VIEW_SELECTION_TYPES.LIST,
  lineNames: [],
  assetChildren: null,
  fromDashboard: null,
  rangeState: null,
  dateFilterName: "Month",
  activeSummary: 'Total',
  pageSize: 30,
};

export const getCurrentMaintenanceStateFilters = maintenanceFilterState => {
  let stateToReturn = TEMPLATE_MAINTENANCE_FILTERS;
  if (maintenanceFilterState) {
    stateToReturn = {
      listViewDataToShow: maintenanceFilterState.listViewDataToShow ? maintenanceFilterState.listViewDataToShow : LIST_VIEW_SELECTION_TYPES.LIST,
      assetChildren: maintenanceFilterState.assetChildren,
      rangeState: maintenanceFilterState.rangeState,
      dateFilterName: maintenanceFilterState.dateFilterName,
      lineNames: maintenanceFilterState.lineNames,
      activeSummary: maintenanceFilterState.activeSummary,
      pageSize: maintenanceFilterState.pageSize,
    };

  }

  return stateToReturn;
};
