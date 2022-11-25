import React from 'react'
const headerInlineStyle1 = {
  fontSize: "12px",
};
const headerInlineStyle2 = {
  fontSize: "10px",
  wordBreak: "break-word",
};

const AdditionalNoTitleFormatter = (val, num) => {
  return <div style={{ display: 'grid', height: '45px' }}>
    <div>{`${num}`}</div>
    <div>{val}</div>
  </div>
}

export const SEPTA_TrackSectionTurnoutAndSpecialWorkInspectionReportSchema = {
  sections: [
    {
      heights: {
        header1: "auto",
      },
      classes: {
        header1: "grey-background",
      },
      inlineStyle: {
        header1: headerInlineStyle1,
      },
      minDataRowsCount: 1,
      columns: [
        {
          title: "Interlocking",
          colSpan: 4,
          rowSpan: 1,
          className: "tbl-text-normal",
        },
        {
          title: "Date of Inspection",
          colSpan: 3,
          rowSpan: 1,
          className: "tbl-text-normal",
        },
        {
          title: "Inspector",
          colSpan: 7,
          rowSpan: 1,
          className: "tbl-text-normal",
        },
        {
          title: "Inspection Foreman",
          colSpan: 8,
          rowSpan: 1,
          className: "tbl-text-normal",
        },
        {
          title: "Number of Pages",
          colSpan: 4,
          rowSpan: 1,
          className: "tbl-text-normal",
        },
      ],
    },
    {
      heights: {
        header1: "auto",
        header2: "auto",
      },
      classes: {
        header1: "grey-background",
        header2: "grey-background",
      },
      inlineStyle: {
        header1: headerInlineStyle1,
        header2: headerInlineStyle2,
      },
      minDataRowsCount: 5,
      columns: [
        {
          title: "Location",
          colSpan: 2,
          rowSpan: 1,
          className: "tbl-text-normal",
          columns: [
            {
              title: "Switch Number",
              colSpan: 1,
              rowSpan: 1,
              className: "tbl-text-normal",
              titleFormatter: (val) => AdditionalNoTitleFormatter(val, '1')
            },
            {
              title: "Designation",
              colSpan: 1,
              rowSpan: 1,
              className: "tbl-text-normal",
              titleFormatter: (val) => AdditionalNoTitleFormatter(val, '2')
            },
          ],
        },
        {
          title: "Switch Rails",
          colSpan: 2,
          rowSpan: 1,
          className: "tbl-text-normal",
          columns: [
            {
              title: "Point Opening",
              colSpan: 1,
              rowSpan: 1,
              className: "tbl-text-normal",
              titleFormatter: (val) => AdditionalNoTitleFormatter(val, '3')
            },
            {
              title: "Condition",
              colSpan: 1,
              rowSpan: 1,
              className: "tbl-text-normal",
              titleFormatter: (val) => AdditionalNoTitleFormatter(val, '4')
            },
          ],
        },
        {
          title: "Condition",
          colSpan: 6,
          rowSpan: 1,
          className: "tbl-text-normal",
          columns: [
            {
              title: "Switch Rods",
              colSpan: 1,
              rowSpan: 1,
              className: "tbl-text-normal",
              titleFormatter: (val) => AdditionalNoTitleFormatter(val, '5')
            },
            {
              title: "Braces",
              colSpan: 1,
              rowSpan: 1,
              className: "tbl-text-normal",
              titleFormatter: (val) => AdditionalNoTitleFormatter(val, '6')
            },
            {
              title: "Stock Rails",
              colSpan: 1,
              rowSpan: 1,
              className: "tbl-text-normal",
              titleFormatter: (val) => AdditionalNoTitleFormatter(val, '7')
            },
            {
              title: "Switch Lock",
              colSpan: 1,
              rowSpan: 1,
              className: "tbl-text-normal",
              titleFormatter: (val) => AdditionalNoTitleFormatter(val, '8')
            },
            {
              title: "Switch Latch",
              colSpan: 1,
              rowSpan: 1,
              className: "tbl-text-normal",
              titleFormatter: (val) => AdditionalNoTitleFormatter(val, '9')
            },
            {
              title: "Switch Target",
              colSpan: 1,
              rowSpan: 1,
              className: "tbl-text-normal",
              titleFormatter: (val) => AdditionalNoTitleFormatter(val, '10')
            },
          ],
        },
        {
          title: "Guage",
          colSpan: 3,
          rowSpan: 1,
          className: "tbl-text-normal",
          columns: [
            {
              title: "AT Stock rail bend",
              colSpan: 1,
              rowSpan: 1,
              className: "tbl-text-normal",
              titleFormatter: (val) => AdditionalNoTitleFormatter(val, '11X')
            },
            {
              title: "2' into sw. rail",
              colSpan: 1,
              rowSpan: 1,
              className: "tbl-text-normal",
              titleFormatter: (val) => AdditionalNoTitleFormatter(val, '11Y')
            },
            {
              title: "Max Guage",
              colSpan: 1,
              rowSpan: 1,
              className: "tbl-text-normal",
              titleFormatter: (val) => AdditionalNoTitleFormatter(val, '12')
            },
          ],
        },
        {
          title: "Frog",
          colSpan: 2,
          rowSpan: 1,
          className: "tbl-text-normal",
          columns: [
            {
              title: "Condition",
              colSpan: 1,
              rowSpan: 1,
              className: "tbl-text-normal",
              titleFormatter: (val) => AdditionalNoTitleFormatter(val, '13')
            },
            {
              title: "Track Guage",
              colSpan: 1,
              rowSpan: 1,
              className: "tbl-text-normal",
              titleFormatter: (val) => AdditionalNoTitleFormatter(val, '14')
            },
          ],
        },
        {
          title: "Check Rails",
          colSpan: 3,
          rowSpan: 1,
          className: "tbl-text-normal",
          columns: [
            {
              title: "Condition",
              colSpan: 1,
              rowSpan: 1,
              className: "tbl-text-normal",
              titleFormatter: (val) => AdditionalNoTitleFormatter(val, '15')
            },
            {
              title: "Check Guage",
              colSpan: 1,
              rowSpan: 1,
              className: "tbl-text-normal",
              titleFormatter: (val) => AdditionalNoTitleFormatter(val, '16')
            },
            {
              title: "Back to Back",
              colSpan: 1,
              rowSpan: 1,
              className: "tbl-text-normal",
              titleFormatter: (val) => AdditionalNoTitleFormatter(val, '17')
            },
          ],
        },
        {
          title: "Condition",
          colSpan: 4,
          rowSpan: 1,
          className: "tbl-text-normal",
          columns: [
            {
              title: "Ties",
              colSpan: 1,
              rowSpan: 1,
              className: "tbl-text-normal",
              titleFormatter: (val) => AdditionalNoTitleFormatter(val, '18')
            },
            {
              title: "Anchors",
              colSpan: 1,
              rowSpan: 1,
              className: "tbl-text-normal",
              titleFormatter: (val) => AdditionalNoTitleFormatter(val, '19')
            },
            {
              title: "de-Rails",
              colSpan: 1,
              rowSpan: 1,
              className: "tbl-text-normal",
              titleFormatter: (val) => AdditionalNoTitleFormatter(val, '20')
            },
            {
              title: "Surface",
              colSpan: 1,
              rowSpan: 1,
              className: "tbl-text-normal",
              titleFormatter: (val) => AdditionalNoTitleFormatter(val, '21')
            },
          ],
        },
        {
          title: "Correction",
          colSpan: 4,
          rowSpan: 1,
          className: "tbl-text-normal",
          columns: [
            {
              title: "Remedial action taken",
              colSpan: 4,
              rowSpan: 1,
              className: "tbl-text-normal",
              titleFormatter: (val) => AdditionalNoTitleFormatter(val, '22')
            },
          ],
        },
      ],
    },
    {
      heights: {
        header1: "auto",
      },
      classes: {
        header1: "grey-background",
      },
      inlineStyle: {
        header1: headerInlineStyle1,
      },
      minDataRowsCount: 1,
      columns: [
        {
          title: 'Remarks / Notations (Section "B" on reverse side)',
          colSpan: 26,
          rowSpan: 1,
          className: "tbl-text-normal",
          leftAlign: true,
        },
      ],
    },
  ],
};
