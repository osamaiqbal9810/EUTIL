export const SFRTA_BridgeTestsAndInspectionReportSchema = {
  sections: [
    {
      heights: {
        header1: "auto",
        header2: "auto",
      },
      minDataRowsCount: 1,
      columns: [
        {
          title: "Bridge Locking (FRA 236.387) Annual",
          colSpan: 20,
          rowSpan: 1,
          className: "tbl-text-normal",
          columns: [
            {
              title: "Circuit Nomenclature",
              colSpan: 13,
              rowSpan: 1,
              className: "tbl-text-normal",
            },
            {
              title: "Condition Left",
              colSpan: 7,
              rowSpan: 1,
              className: "tbl-text-normal",
            },
          ],
        },
      ],
    },
  ],
};
