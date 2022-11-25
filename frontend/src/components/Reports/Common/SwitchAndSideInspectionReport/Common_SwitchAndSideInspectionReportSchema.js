import { dataFormatters } from "../../../../utils/dataFormatters";

export const Common_SwitchAndSideInspectionReportSchema = {
  sections: [
    // {
    //   heights: {
    //     header1: "auto",
    //   },
    //   classes: {
    //     header1: "left-align bold-text",
    //   },
    //   inlineData: true,
    //   columns: [
    //     {
    //       title: "Date",
    //       colSpan: 4,
    //       rowSpan: 1,
    //       className: "tbl-text-normal",
    //       accessor: "date",
    //       formatter: dataFormatters.dateFormatter,
    //     },
    //     {
    //       title: "Inspector(s)",
    //       colSpan: 12,
    //       rowSpan: 1,
    //       className: "tbl-text-normal",
    //       accessor: "user.name",
    //     },
    //     {
    //       title: "Weather",
    //       colSpan: 12,
    //       rowSpan: 1,
    //       className: "tbl-text-normal",
    //       accessor: "weather",
    //     },
    //   ],
    // },
    {
      heights: {
        header1: "auto"
      },
      minDataRowsCount: 6,
      columns: [
        {
          title: "Mp",
          colSpan: 2,
          rowSpan: 1,
          className: "tbl-text-normal",
          accessor: ["mpPrefix", "milepost"],
        },
        {
          title: "Switch",
          colSpan: 2,
          rowSpan: 1,
          className: "tbl-text-normal",
          accessor: "switchName",
        },
        {
          title: "Operated Y/N",
          colSpan: 2,
          rowSpan: 1,
          className: "tbl-text-normal",
          accessor: "summary.operateswitch",
        },
        {
          title: "Gage at Point",
          colSpan: 2,
          rowSpan: 1,
          className: "tbl-text-normal",
          accessor: "summary.gagepoints",
        },
        {
          title: "Guard Check Gage - Straight",
          colSpan: 2,
          rowSpan: 1,
          className: "tbl-text-normal",
          accessor: "summary.guardcheck",
        },
        {
          title: "Guard Face Gage - Straight",
          colSpan: 2,
          rowSpan: 1,
          className: "tbl-text-normal",
          accessor: "summary.guardface",
        },
        {
          title: "Guard Check Gage - Turn Out",
          colSpan: 2,
          rowSpan: 1,
          className: "tbl-text-normal",
          accessor: "summary.guardcheckout",
        },
        {
          title: "Guard Face Gage - Turn Out",
          colSpan: 2,
          rowSpan: 1,
          className: "tbl-text-normal",
          accessor: "summary.guardfaceout",
        },
        {
          title: "Defects / Comments",
          colSpan: 10,
          rowSpan: 1,
          className: "tbl-text-normal",
          accessor: "issues",
          subAccessor: "description",
          isArray: true,
          minDataRowsCount: 3,
        },
        {
          title: "Defect Repaired",
          colSpan: 2,
          rowSpan: 1,
          className: "tbl-text-normal",
          accessor: "issues",
          subAccessor: "remedialAction",
          isArray: true,
          minDataRowsCount: 3,
        },
      ],
    },
  ],
};
