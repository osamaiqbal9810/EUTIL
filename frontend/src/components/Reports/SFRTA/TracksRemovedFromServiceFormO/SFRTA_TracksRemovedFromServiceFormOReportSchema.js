const headerInlineStyle1 = {
  fontSize: "12px",
};
const headerInlineStyle2 = {
  fontSize: "12px",
  wordBreak: "break-word",
};

export const SFRTA_TracksRemovedFromServiceFormOReportSchema = {
  sections: [
    {
      heights: {
        header1: "auto",
      },
      headerOnly: true,
      classes: {
        header1: "black-background",
      },
      columns: [
        {
          title: "TRACKS REMOVED FROM SERVICE - FORM O",
          colSpan: 26,
          rowSpan: 1,
          className: "tbl-text-normal",
        },
      ],
    },
    {
      heights: {
        header1: "auto",
      },
      inlineData: true,
      columns: [
        {
          title: "NAME",
          colSpan: 26,
          rowSpan: 1,
          className: "tbl-text-normal",
          leftAlign: true,
          accessor: 'name'
        },
      ],
    },
    {
      heights: {
        header1: "auto",
        header2: "auto",
      },
      inlineStyle: {
        header1: headerInlineStyle1,
        header2: headerInlineStyle2,
      },
      minDataRowsCount: 3,
      columns: [
        {
          title: "DATE",
          colSpan: 1,
          rowSpan: 2,
          className: "tbl-text-normal",
          accessor: 'date'
        },
        {
          title: "AUTHORITY NO.",
          colSpan: 4,
          rowSpan: 2,
          className: "tbl-text-normal",
          accessor: 'authno'
        },
        {
          title: "TRACK(S)",
          colSpan: 2,
          rowSpan: 2,
          className: "tbl-text-normal",
          accessor: 'track'
        },
        {
          title: "LIMITS",
          colSpan: 6,
          rowSpan: 1,
          className: "tbl-text-normal",
          columns: [
            {
              title: "BETWEEN",
              colSpan: 3,
              rowSpan: 1,
              className: "tbl-text-normal",
              accessor: 'lbet1'
            },
            {
              title: "BETWEEN",
              colSpan: 3,
              rowSpan: 1,
              className: "tbl-text-normal",
              accessor: 'lbet2'
            },
          ],
        },
        {
          title: "EXPIRES",
          colSpan: 2,
          rowSpan: 2,
          className: "tbl-text-normal",
          accessor: 'exp'
        },
        {
          title: "\"OK\" TIME",
          colSpan: 1,
          rowSpan: 2,
          className: "tbl-text-normal",
          accessor: 'oktime'
        },
        {
          title: "DISP. INITIALS",
          colSpan: 2,
          rowSpan: 2,
          className: "tbl-text-normal",
          accessor: 'dispinit'
        },
        {
          title: "MP RED FLAG",
          colSpan: 1,
          rowSpan: 2,
          className: "tbl-text-normal",
          accessor: 'no1'
        },
        {
          title: "MP RED FLAG",
          colSpan: 1,
          rowSpan: 2,
          className: "tbl-text-normal",
          accessor: 'no2'
        },
        {
          title: "EQUIPMENT / TRAIN IN LIMITS",
          colSpan: 6,
          rowSpan: 1,
          className: "tbl-text-normal",
          columns: [
            {
              title: "TRAIN",
              colSpan: 1,
              rowSpan: 1,
              className: "tbl-text-normal",
              accessor: 'train'
            },
            {
              title: "NAME",
              colSpan: 1,
              rowSpan: 1,
              className: "tbl-text-normal",
              accessor: 'name1'
            },
            {
              title: "TIME IN",
              colSpan: 2,
              rowSpan: 1,
              className: "tbl-text-normal",
              accessor: 'timein'
            },
            {
              title: "TIME CLR",
              colSpan: 2,
              rowSpan: 1,
              className: "tbl-text-normal",
              accessor: 'tclr'
            },
          ],
        },
      ],
    },
    {
      heights: {
        header1: "auto",
      },
      minDataRowsCount: 1,
      columns: [
        {
          title: 'NOTES',
          colSpan: 26,
          rowSpan: 1,
          className: "tbl-text-normal",
          leftAlign: true,
          accessor: 'notes'
        },
      ],
    },
  ],
};
