export const SFRTA_QuarterlySwitchTestsAndInspectionsReportSchema = {
  sections: [
    {
      heights: {
        header1: "auto",
        header2: "auto",
      },
      minDataRowsCount: 3,
      columns: [
        {
          title: "Quarterly Tests",
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
