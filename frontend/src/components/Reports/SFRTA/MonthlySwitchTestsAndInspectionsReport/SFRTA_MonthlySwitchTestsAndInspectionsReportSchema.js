export const SFRTA_MonthlySwitchTestsAndInspectionsReportSchema = {
  sections: [
    {
      heights: {
        header1: "auto",
        header2: "auto",
      },
      minDataRowsCount: 2,
      columns: [
        {
          title: "Monthly Tests",
          colSpan: 20,
          rowSpan: 1,
          className: "tbl-text-normal",
          columns: [
            {
              title: "Test Description & Rule",
              colSpan: 14,
              rowSpan: 1,
              className: "tbl-text-normal",
            },
            {
              title: "Condition Left",
              colSpan: 6,
              rowSpan: 1,
              className: "tbl-text-normal",
            },
          ],
        },
      ],
    },
  ],
};
