import _ from "lodash";
import React, { Component } from "react";
import EditableTable from "components/Common/EditableTable";
import { languageService } from "../../Language/language.service";
import permissionCheck from "utils/permissionCheck.js";
function calculateActions(wo, addMRState) {
  let allowedActions = [];
  if (addMRState) {
    if (wo.status !== "Closed" && wo.status !== "In Progress" && wo.locationId == addMRState.lineId) return ["Select"];

    return [];
  } else {
    if (wo.status === "New") {
      permissionCheck("WORKORDER", "update") && allowedActions.push("Edit");
      permissionCheck("WORKORDER", "delete") && allowedActions.push("Delete");
    } else if (wo.status === "Planned") {
      permissionCheck("WORKORDER", "update") && allowedActions.push("Edit");
      // permissionCheck("WORKORDER EXECUTE", "update") && allowedActions.push("Execute");
    } else if (wo.status === "In Progress") {
      permissionCheck("WORKORDER", "view") && allowedActions.push("View");
      // permissionCheck("WORKORDER CLOSE", "update") && allowedActions.push("Close");
    } else if (wo.status === "Closed") {
      permissionCheck("WORKORDER", "view") && (allowedActions = ["View"]);
    }
    if (wo.maintenanceRequests && wo.maintenanceRequests.length) {
      permissionCheck("WORKORDER GIS", "view") && allowedActions.push("GIS");
    }
  }
  allowedActions.push("Estimate");
  return allowedActions;
}

export const WOListView = (props) => {
  let woList = props.workOrders;
  const woColumns = [
    {
      id: "WorkOrderNo",
      header: "MWO No.",
      type: "text",
      field: "mwoNumber",
      minWidth: 60,
      editable: false,
      possibleValues: [],
    },
    {
      id: "title",
      header: languageService("Name"),
      field: "title",
      type: "text",
      minWidth: 100,
      editable: false,
      possibleValues: [],
    },
    {
      id: "Location",
      header: languageService("Location"),
      field: "locationName",
      type: "text",
      minWidth: 100,
      editable: false,
      possibleValues: [],
    },
    {
      id: "Description",
      header: languageService("Description"),
      field: "description",
      type: "text",
      minWidth: 100,
      editable: false,
      possibleValues: [],
    },
    {
      id: "Priority",
      header: languageService("Priority"),
      field: "priority",
      type: "status",
      minWidth: 80,
      editable: false,
    },
    {
      id: "dueDate",
      header: languageService("Due Date"),
      field: "dueDate",
      type: "date",
      minWidth: 60,
      editable: false,
    },
    // {
    //   id: "executionDate",
    //   header: languageService("Execution Date"),
    //   field: "executionDate",
    //   type: "date",
    //   minWidth: 60,
    //   editable: false,
    // },
    {
      id: "closedDate",
      header: languageService("Closed Date"),
      field: "closedDate",
      type: "date",
      minWidth: 60,
      editable: false,
    },
    {
      id: "assignedTo",
      header: languageService("Assigned To"),
      field: "assignedTo",
      type: "user",
      minWidth: 100,
      editable: false,
    },
    {
      id: "createdBy",
      header: languageService("Created By"),
      field: "createdBy",
      type: "user",
      minWidth: 60,
      editable: false,
    },
    {
      id: "Status",
      header: languageService("Status"),
      field: "status",
      type: "status",
      minWidth: 100,
      editable: false,
    },
    {
      id: "actions",
      header: languageService("Actions"),
      type: "action",
      func: calculateActions,
      //immediate:["Edit", "Delete"],
      minWidth: 150,
      editable: false,
    },
  ];

  return (
    <EditableTable
      columns={woColumns}
      data={woList}
      handleActionClick={props.handleClick}
      onChange={() => {}}
      tableOptions={{ funcArg: props.addMR }}
      defaultSorted={[{ id: "WorkOrderNo", desc: true }]}
      handlePageSize={props.handlePageSize}
      pageSize={props.pageSize}
      rowStyleMap={props.rowStyleMap}
    />
  );
};
