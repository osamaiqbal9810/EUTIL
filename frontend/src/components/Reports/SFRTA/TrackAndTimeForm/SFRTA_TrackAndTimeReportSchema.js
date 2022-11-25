const headerInlineStyle1 = {
  fontSize: "12px",
};
const headerInlineStyle2 = {
  fontSize: "12px",
  wordBreak: "break-word",
};

const SubTitleFormatterWithLogo = (title) => {
  return title;
}

export const SFRTA_TrackAndTimeReportSchema = {
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
          title: "TRACK AND TIME FORM",
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
          colSpan: 7,
          rowSpan: 1,
          className: "tbl-text-normal",
          leftAlign: true,
          accessor: 'name'
        },
        {
          title: "GCOR RULE 10.3",
          isTitleOnly: true,
          titleFormatter: SubTitleFormatterWithLogo,
          colSpan: 12,
          rowSpan: 1,
          className: "tbl-text-normal",
        },
        {
          title: "EQUIPMENT NO",
          colSpan: 7,
          rowSpan: 1,
          className: "tbl-text-normal",
          leftAlign: true,
          accessor: 'equipno'
        },
      ],
    },
    {
      heights: {
        header1: "auto",
        header2: "50px",
      },
      inlineStyle: {
        header1: headerInlineStyle1,
        header2: headerInlineStyle2,
      },
      minDataRowsCount: 12,
      columns: [
        {
          title: "DATE",
          colSpan: 1,
          rowSpan: 2,
          className: "tbl-text-normal",
          accessor: 'date'
        },
        {
          title: "AUTH. NO.",
          colSpan: 1,
          rowSpan: 2,
          className: "tbl-text-normal",
          accessor: 'authno'
        },
        {
          title: "TRAIN AHEAD (ENG NO. AND DIR.)",
          colSpan: 2,
          rowSpan: 2,
          className: "tbl-text-normal",
          accessor: 'train'
        },
        {
          title: "LIMITS",
          colSpan: 7,
          rowSpan: 1,
          className: "tbl-text-normal",
          columns: [
            {
              title: "TRACK",
              colSpan: 1,
              rowSpan: 1,
              className: "tbl-text-normal",
              accessor: 'track'
            },
            {
              title: "BETWEEN",
              colSpan: 2,
              rowSpan: 1,
              className: "tbl-text-normal",
              accessor: 'lbet1'
            },
            {
              title: "SW (Y/N)",
              colSpan: 1,
              rowSpan: 1,
              className: "tbl-text-normal",
              accessor: 'lsw1'
            },
            {
              title: "BETWEEN",
              colSpan: 2,
              rowSpan: 1,
              className: "tbl-text-normal",
              accessor: 'lbet2'
            },
            {
              title: "SW (Y/N)",
              colSpan: 1,
              rowSpan: 1,
              className: "tbl-text-normal",
              accessor: 'lsw2'
            },
          ],
        },
        {
          title: "JOINT WITH",
          colSpan: 1,
          rowSpan: 2,
          className: "tbl-text-normal",
          accessor: 'joint'
        },
        {
          title: "TIME UNTIL",
          colSpan: 1,
          rowSpan: 2,
          className: "tbl-text-normal",
          accessor: 'tuntil'
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
          colSpan: 1,
          rowSpan: 2,
          className: "tbl-text-rotate-multiline",
          accessor: 'dispinit'
        },
        {
          title: "TRACK ROLL UP",
          colSpan: 7,
          rowSpan: 1,
          className: "tbl-text-normal",
          columns: [
            {
              title: "LOCATIONS AND TIMES",
              colSpan: 7,
              rowSpan: 1,
              className: "tbl-text-normal",
              accessor: 'locatime'
            },
          ],
        },
        {
          title: "EXTENDED TIME",
          colSpan: 1,
          rowSpan: 2,
          className: "tbl-text-rotate-multiline",
          accessor: 'exttime'
        },
        {
          title: "TIME RELEASED",
          colSpan: 1,
          rowSpan: 2,
          className: "tbl-text-rotate-multiline",
          accessor: 'timerel'
        },
        {
          title: "DATE RELEASED",
          colSpan: 1,
          rowSpan: 2,
          className: "tbl-text-rotate-multiline",
          accessor: 'daterel'
        },
        {
          title: "DISP. INITIALS",
          colSpan: 1,
          rowSpan: 2,
          className: "tbl-text-rotate-multiline",
          accessor: 'dispinit2'
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
