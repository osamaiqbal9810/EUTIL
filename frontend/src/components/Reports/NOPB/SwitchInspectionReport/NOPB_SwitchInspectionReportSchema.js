import React, { Component, Fragment } from "react";

const getFractionInches = (values) => {
  let result = "";
  if (values && Array.isArray(values)) {
    let numbers = values.filter(val => val);
    if (numbers.length === 1) {
      result = numbers[0];
    } else if (numbers.length === 2) {
      result = (
        <Fragment>
          <span style={{ whiteSpace: "nowrap" }}>
            {numbers[0]} <sup>{numbers[1].split("/")[0]}</sup>⁄<sub>{numbers[1].split("/")[1]}</sub>
          </span>
        </Fragment>
      );
    }
  }
  return result;
};

export const NOPB_SwitchInspectionReportSchema = {
  sections: [
    {
      heights: {
        header1: "50px",
        header2: "200px",
      },
      minDataRowsCount: 5,
      columns: [
        {
          title: "MP/YARD",
          colSpan: 1,
          rowSpan: 2,
          className: "tbl-text-rotate",
          accessor: "milepost",
        },
        {
          title: "SW. ID.",
          colSpan: 3,
          rowSpan: 2,
          className: "tbl-text-normal",
          accessor: "switchName",
        },
        {
          title: "ALIGNMENT",
          colSpan: 1,
          rowSpan: 2,
          className: "tbl-text-rotate",
          accessor: "summary.align",
        },
        {
          title: "SURFACE",
          colSpan: 1,
          rowSpan: 2,
          className: "tbl-text-rotate",
          accessor: "summary.surf",
        },
        {
          title: "CROSSLEVEL",
          colSpan: 1,
          rowSpan: 2,
          className: "tbl-text-rotate",
          accessor: "summary.cross",
        },
        {
          title: "MAX GAGE STR. (in.)",
          colSpan: 1,
          rowSpan: 2,
          className: "tbl-text-rotate",
          accessor: ["summary.inch1", "summary.pinch1"],
          dontJoinValues: true,
          formatter: getFractionInches,
          dataFontSize: "12px",
        },
        {
          title: "MAX GAGE CLOSURE (in.)",
          colSpan: 1,
          rowSpan: 2,
          className: "tbl-text-rotate",
          accessor: ["summary.inch2", "summary.pinch2"],
          dontJoinValues: true,
          formatter: getFractionInches,
          dataFontSize: "12px",
        },
        {
          title: "SWITCH POINT RH (in.)",
          colSpan: 1,
          rowSpan: 2,
          className: "tbl-text-rotate",
          accessor: ["summary.inch3", "summary.pinch3"],
          dontJoinValues: true,
          formatter: getFractionInches,
          dataFontSize: "12px",
        },
        {
          title: "SWITCH POINT LH (in.)",
          colSpan: 1,
          rowSpan: 2,
          className: "tbl-text-rotate",
          accessor: ["summary.inch4", "summary.pinch4"],
          dontJoinValues: true,
          formatter: getFractionInches,
          dataFontSize: "12px",
        },
        {
          title: "HEEL BLOCK (in.)",
          colSpan: 1,
          rowSpan: 2,
          className: "tbl-text-rotate",
          accessor: ["summary.inch5", "summary.pinch5"],
          dontJoinValues: true,
          formatter: getFractionInches,
          dataFontSize: "12px",
        },
        {
          title: "STOCK RAIL STR (in.)",
          colSpan: 1,
          rowSpan: 2,
          className: "tbl-text-rotate",
          accessor: ["summary.inch6", "summary.pinch6"],
          dontJoinValues: true,
          formatter: getFractionInches,
          dataFontSize: "12px",
        },
        {
          title: "STOCK RAIL BENT (in.)",
          colSpan: 1,
          rowSpan: 2,
          className: "tbl-text-rotate",
          accessor: ["summary.inch7", "summary.pinch7"],
          dontJoinValues: true,
          formatter: getFractionInches,
          dataFontSize: "12px",
        },
        {
          title: "CLOSUE RAIL- T/O SIDE (in.)",
          colSpan: 1,
          rowSpan: 2,
          className: "tbl-text-rotate",
          accessor: ["summary.inch8", "summary.pinch8"],
          dontJoinValues: true,
          formatter: getFractionInches,
          dataFontSize: "12px",
        },
        {
          title: "FROG",
          colSpan: 5,
          rowSpan: 1,
          className: "tbl-text-normal",
          columns: [
            {
              title: "FROG #",
              colSpan: 1,
              rowSpan: 1,
              className: "tbl-text-rotate",
              accessor: "summary.frogno",
            },
            {
              title: "TYPE",
              colSpan: 2,
              rowSpan: 1,
              className: "tbl-text-rotate",
              accessor: "summary.ftype",
            },
            {
              title: "POINT",
              colSpan: 1,
              rowSpan: 1,
              className: "tbl-text-rotate",
              accessor: "summary.pin",
            },
            {
              title: "BOLTS",
              colSpan: 1,
              rowSpan: 1,
              className: "tbl-text-rotate",
              accessor: "summary.bolt",
            },
          ],
        },
        {
          title: "GUARD RAIL",
          colSpan: 4,
          rowSpan: 1,
          className: "tbl-text-normal",
          columns: [
            {
              title: "CHECK STR. (in.)",
              colSpan: 1,
              rowSpan: 1,
              className: "tbl-text-rotate",
              accessor: ["summary.inch9", "summary.pinch9"],
              dontJoinValues: true,
              formatter: getFractionInches,
              dataFontSize: "12px",
            },
            {
              title: "CHECK T/O (in.)",
              colSpan: 1,
              rowSpan: 1,
              className: "tbl-text-rotate",
              accessor: ["summary.inch10", "summary.pinch10"],
              dontJoinValues: true,
              formatter: getFractionInches,
              dataFontSize: "12px",
            },
            {
              title: "FACE STR. (in.)",
              colSpan: 1,
              rowSpan: 1,
              className: "tbl-text-rotate",
              accessor: ["summary.inch11", "summary.pinch11"],
              dontJoinValues: true,
              formatter: getFractionInches,
              dataFontSize: "12px",
            },
            {
              title: "FACE T/O (in.)",
              colSpan: 1,
              rowSpan: 1,
              className: "tbl-text-rotate",
              accessor: ["summary.inch13", "summary.pinch13"],
              dontJoinValues: true,
              formatter: getFractionInches,
              dataFontSize: "12px",
            },
          ],
        },
        {
          title: "INSULATED JOINTS",
          colSpan: 1,
          rowSpan: 2,
          className: "tbl-text-rotate",
          accessor: "summary.joint",
        },
        {
          title: "SWITCH POINT GUARD",
          colSpan: 1,
          rowSpan: 2,
          className: "tbl-text-rotate",
          accessor: "summary.spgard",
        },
        {
          title: "RAIL SIZE",
          colSpan: 1,
          rowSpan: 2,
          className: "tbl-text-rotate",
          accessor: "summary.rsize",
        },
        {
          title: "SW PT",
          colSpan: 3,
          rowSpan: 1,
          className: "tbl-text-normal",
          columns: [
            {
              title: "TYPE",
              colSpan: 2,
              rowSpan: 1,
              className: "tbl-text-rotate",
              accessor: "summary.swpty",
            },
            {
              title: "LENGTH (in.)",
              colSpan: 1,
              rowSpan: 1,
              className: "tbl-text-rotate",
              accessor: "summary.swptlen",
            },
          ],
        },
        {
          title: "INSULATED",
          colSpan: 1,
          rowSpan: 2,
          className: "tbl-text-rotate",
          accessor: "summary.insult",
        },
      ],
    },
    {
      heights: {
        header1: "90px",
      },
      minDataRowsCount: 5,
      columns: [
        {
          title: "MP/YARD",
          colSpan: 1,
          rowSpan: 1,
          className: "tbl-text-rotate",
          accessor: "milepost",
        },
        {
          title: "SW. ID.",
          colSpan: 3,
          rowSpan: 1,
          className: "tbl-text-normal",
          accessor: "switchName",
        },
        {
          title: "T.O. SIDE",
          colSpan: 1,
          rowSpan: 1,
          className: "tbl-text-rotate",
          accessor: "summary.toside",
          dataFontSize: "13px",
        },
        {
          title: "SW STAND TYPE",
          colSpan: 4,
          rowSpan: 1,
          className: "tbl-text-normal",
          accessor: "summary.swsta",
        },
        {
          title: "SW OPERATOR",
          colSpan: 4,
          rowSpan: 1,
          className: "tbl-text-normal",
          accessor: "summary.swoper",
        },
        {
          title: "OTM (BRACES / PLATES / RODS)",
          colSpan: 4,
          rowSpan: 1,
          className: "tbl-text-normal",
          accessor: "summary.otm",
        },
        {
          title: "SWITCH STAND",
          colSpan: 4,
          rowSpan: 1,
          className: "tbl-text-normal",
          accessor: "summary.sstan",
        },
        {
          title: "TIE CONDITION",
          colSpan: 4,
          rowSpan: 1,
          className: "tbl-text-normal",
          accessor: "summary.tcond",
        },
        {
          title: "COMMENTS",
          colSpan: 6,
          rowSpan: 1,
          className: "tbl-text-normal",
          accessor: "summary.comm",
        },
      ],
    },
  ],
};