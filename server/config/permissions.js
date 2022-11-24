/**
 * Created by zqureshi on 5/25/2018.
 */
// User's permissions
export const READ_USER = { resource: "USER", action: "read" };
export const CREATE_USER = { resource: "USER", action: "create" };
export const UPDATE_USER = { resource: "USER", action: "update" };
export const DELETE_USER = { resource: "USER", action: "delete" };
export const VIEW_USER = { resource: "USER", action: "view" };
export const USER_GROUP_UPDATE = { resource: "USER", action: "group_update" };

// Sidebar Permissions
export const VIEW_SETUP = { resource: "SETUP", action: "view" };

// Track Permission
export const READ_TRACK = { resource: "TRACK", action: "read" };
export const CREATE_TRACK = { resource: "TRACK", action: "create" };
export const UPDATE_TRACK = { resource: "TRACK", action: "update" };
export const DELETE_TRACK = { resource: "TRACK", action: "delete" };
export const VIEW_TRACK = { resource: "TRACK", action: "view" };

// Work Plan Permission
export const READ_WORKPLAN = { resource: "WORKPLAN", action: "read" };
export const CREATE_WORKPLAN = { resource: "WORKPLAN", action: "create" };
export const UPDATE_WORKPLAN = { resource: "WORKPLAN", action: "update" };
export const DELETE_WORKPLAN = { resource: "WORKPLAN", action: "delete" };
export const VIEW_WORKPLAN = { resource: "WORKPLAN", action: "view" };
export const WORKPLAN_SORTING = { resource: "WORKPLAN", action: "plan_sort" };
export const CREATE_INSPECTION_TASK = { resource: "INSPECTION TASK", action: "create" };
export const UPDATE_INSPECTION_TASK = { resource: "INSPECTION TASK", action: "update" };
export const DELETE_INSPECTION_TASK = { resource: "INSPECTION TASK", action: "delete" };
export const VIEW_INSPECTION_TEMP_WORKER = { resource: "INSPECTION TEMP WORKER", action: "view" };

// Maintenance Permissions
export const READ_MAINTENANCE = { resource: "MAINTENANCE", action: "read" };
export const CREATE_MAINTENANCE = { resource: "MAINTENANCE", action: "create" };
export const UPDATE_MAINTENANCE = { resource: "MAINTENANCE", action: "update" };
export const DELETE_MAINTENANCE = { resource: "MAINTENANCE", action: "delete" };
export const VIEW_MAINTENANCE = { resource: "MAINTENANCE", action: "view" };
export const VIEW_MAINTENANCE_DETAIL = { resource: "MAINTENANCE DETAIL", action: "view" };
export const VIEW_MAINTENANCE_WORKORDER = { resource: "MAINTENANCE WORK ORDER", action: "view" };
export const CREATE_MAINTENANCE_ADD_ESTIMATE = { resource: "MAINTENANCE ADD ESTIMATE", action: "create" };
export const VIEW_MAINTENANCE_CHANGE_LOG = { resource: "MAINTENANCE CHANGE LOG ", action: "view" };
export const UPDATE_MAINTENANCE_ESTIMATE = { resource: "MAINTENANCE ESTIMATE", action: "update" };
export const DELETE_MAINTENANCE_ESTIMATE = { resource: "MAINTENANCE ESTIMATE", action: "delete" };

// WorkOrder Permissions
export const READ_WORKORDER = { resource: "WORKORDER", action: "read" };
export const CREATE_WORKORDER = { resource: "WORKORDER", action: "create" };
export const UPDATE_WORKORDER = { resource: "WORKORDER", action: "update" };
export const DELETE_WORKORDER = { resource: "WORKORDER", action: "delete" };
export const VIEW_WORKORDER = { resource: "WORKORDER", action: "view" };
export const VIEW_WORKORDER_GIS = { resource: "WORKORDER GIS", action: "view" };
export const UPDATE_WORKORDER_EXECUTE = { resource: "WORKORDER EXECUTE", action: "update" };
export const UPDATE_WORKORDER_CLOSE = { resource: "WORKORDER CLOSE", action: "update" };

// Dashboard Permissions
export const VIEW_DASHBOARD = { resource: "DASHBOARD", action: "view" };

// Issue Permissions
export const VIEW_ISSUE = { resource: "ISSUE", action: "view" };
export const MR_CREATE_ISSUE = { resource: "ISSUE MR", action: "create" };
export const UPDATE_ISSUE_CLOSE = { resource: "ISSUE CLOSE", action: "update" };
export const UPDATE_ISSUE_REASON = { resource: "ISSUE REASON", action: "update" };
export const UPDATE_ISSUE = { resource: "ISSUE", action: "update" };
export const VIEW_ISSUE_REASON = { resource: "ISSUE REASON", action: "view" };
export const VIEW_ISSUE_MR = { resource: "ISSUE MR", action: "view" };

// ASSET Permissions
export const CREATE_ASSET = { resource: "ASSET", action: "create" };
export const DELETE_ASSET = { resource: "ASSET", action: "delete" };
export const VIEW_ASSET = { resource: "ASSET", action: "view" };
export const UPDATE_ASSET = { resource: "ASSET", action: "update" };
export const READ_ASSET = { resource: "ASSET", action: "read" };
export const LOCATIONS_VIEW = { resource: "LOCATION", action: "view" };

// TEAM Permissions
export const CREATE_TEAM = { resource: "TEAM", action: "create" };
export const VIEW_TEAM = { resource: "TEAM", action: "view" };
export const DELETE_TEAM = { resource: "TEAM", action: "delete" };

// RUN Permissions
export const CREATE_RUN = { resource: "RUN", action: "create" };
export const VIEW_RUN = { resource: "RUN", action: "view" };
export const DELETE_RUN = { resource: "RUN", action: "delete" };
export const CREATE_RUN_RANGE = { resource: "RUN RANGE", action: "create" };

// List permissions
export const CREATE_SETUP_LIST_DATA = { resource: "SETUP LIST DATA", action: "create" };

// Application lookups
export const APPLICATIONLOOKUPS_VIEW = { resource: "APPLICATIONLOOKUP", action: "view" };
