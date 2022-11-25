import React, { Component, Fragment } from "react";
import _ from "lodash";
import "./style.css";

function getFormattedValue(row, col) {
  const { accessor, dontJoinValues, formatter } = col;
  let val = null;
  if (typeof accessor === "string") {
    val = getColVal(row, accessor);
  } else if (Array.isArray(accessor)) {
    val = accessor.map((acc) => getColVal(row, acc));
    if (!dontJoinValues) {
      val = val.join(" ");
    }
  }
  if (formatter) {
    val = formatter(val);
  }
  return val === null || val === undefined ? '' : val;
}

function setColValue(dataRow, col, val) {
  const { accessor } = col;
  if (typeof accessor === "string") {
    var parts = accessor.split(".");
    // todo: implement for length > 1 later
    if (parts.length === 1) {
      let acc = parts[0];
      if (dataRow.hasOwnProperty(acc)) {
        dataRow[acc] = val;
      }
    }
  }
}

function getColVal(obj, accessor) {
  var parts = accessor.split(".");

  if (obj) {
    for (var i = 0; i < parts.length; i++) {
      obj = obj[parts[i]];
      if (obj === undefined || obj === null) {
        break;
      }
    }
  }
  return obj ? obj : "";
}

// function getTableHeaderDepth(columns, depth = 1) {
//   let nextlevel = 0;
//   columns.forEach((col) => {
//     if (col.columns && col.columns.length > 0) {
//       nextlevel = getTableHeaderDepth(col.columns);
//     }
//   });
//   return depth + nextlevel;
// }

function getDataRowSchema(columns) {
  return columns
    .map((col) => {
      return col.columns && col.columns.length > 0 ? getDataRowSchema(col.columns) : [col];
    })
    .flat();
}

function addMinimumRows(rows, minRowsCount, rowSchema) {
  let requiredRows = [...rows];
  let missingRowsCount = minRowsCount - rows.length;
  if (missingRowsCount > 0) {
    requiredRows = [...requiredRows, ...Array.from({ length: missingRowsCount }, (v, i) => ({}))];
  }
  return requiredRows.map((dataRow) => {
    let maxSubRows = null;
    rowSchema &&
      rowSchema.forEach((col) => {
        const { isArray, minDataRowsCount } = col;
        let val = getFormattedValue(dataRow, col);
        if (isArray && val && Array.isArray(val)) {
          // add missing rows
          val = addMinimumRows(val, minDataRowsCount, rowSchema.columns);
          setColValue(dataRow, col, val);
          if (maxSubRows) {
            maxSubRows = Math.max(maxSubRows, val.length);
          } else {
            maxSubRows = val.length;
          }
        }
      });
    dataRow.maxSubRows = maxSubRows ? maxSubRows : 1;

    return dataRow;
  });
}

const RenderReportTableData = (rowSchema, rows, minRowsCount) => {
  let requiredRows = addMinimumRows(rows, minRowsCount, rowSchema);

  return requiredRows.map((row) => {
    const { maxSubRows } = row;
    return (
      <Fragment>
        {/* {while(maxSubRows > 0) {
          return 1;
        }} */}

        <tr>
          {" "}
          {rowSchema.map((col, i) => {
            const { dataFontSize, isArray, subAccessor } = col;
            let val = getFormattedValue(row, col);
            if (isArray) {
              let subRows = [...val];
              let subRow1 = subRows[0];
              val = getColVal(subRow1, subAccessor);
            }

            return (
              // for array data, set it to one by default
              <td colSpan={col.colSpan} rowSpan={isArray ? 1 : maxSubRows}>
                <span style={_.merge({ wordBreak: "break-word" }, dataFontSize ? { fontSize: dataFontSize } : {})}>{val}</span>
              </td>
            );
          })}{" "}
        </tr>
        {Array.from({ length: maxSubRows - 1 }, (v, subRowIndex) => {
          return (
            <tr>
              {" "}
              {rowSchema
                .filter((col) => col.isArray)
                .map((col, i) => {
                  const { dataFontSize, subAccessor } = col;
                  let val = getFormattedValue(row, col);
                  let subRows = [...val];
                  let subRow = subRows[subRowIndex + 1];
                  val = getColVal(subRow, subAccessor);

                  return (
                    // for array data, set it to one by default
                    <td colSpan={col.colSpan}>
                      <span style={_.merge({ wordBreak: "break-word" }, dataFontSize ? { fontSize: dataFontSize } : {})}>{val}</span>
                    </td>
                  );
                })}{" "}
            </tr>
          );
        })}
      </Fragment>
    );
  });
};

const RenderInlineReportTable = (columns, heights, classes, inlineStyle, data) => {
  if (columns.length === 0) return null;

  let height = heights.header1;
  let className = classes && classes.header1 ? classes.header1 : "";
  let style = inlineStyle && inlineStyle.header1 ? inlineStyle.header1 : {};

  return (
    <tr className={className} style={_.merge({ height: height }, style)}>
      {columns.map((col) => {
        const { titleFormatter, title, isTitleOnly, leftAlign } = col;
        return (
          <th className="tbl-bordered-header" colSpan={col.colSpan} rowSpan={col.rowSpan} style={leftAlign ? { textAlign: 'left' } : {}}>
            <span className={`${col.className}`}>
              {" "}
              {isTitleOnly ?
                (titleFormatter ? titleFormatter(title) : title)
                :
                (`${titleFormatter ? titleFormatter(title) : title}: ${getFormattedValue(data, col)}`)
              }
            </span>
          </th>
        );
      })}
    </tr>
  );
};

const RenderReportTableHeader = (columns, heights, classes, inlineStyle) => {
  if (columns.length === 0) return null;

  let renderedheaders = [];

  {
    let height = heights.header1;
    let className = classes && classes.header1 ? classes.header1 : "";
    let style = inlineStyle && inlineStyle.header1 ? inlineStyle.header1 : {};
    let renderedCols = columns.map((col) => {
      const { titleFormatter, title, leftAlign } = col;
      return (
        <th className="tbl-bordered-header" colSpan={col.colSpan} rowSpan={col.rowSpan} style={leftAlign ? { textAlign: 'left' } : {}}>
          <span className={`${col.className}`}>{titleFormatter ? titleFormatter(title) : title}</span>
        </th>
      );
    });
    if (renderedCols.length > 0) {
      renderedheaders.push({
        height: height,
        renderedCols: renderedCols,
        className: className,
        inlineStyle: style,
      });
    }
  }
  {
    let height = heights.header2;
    let className = classes && classes.header2 ? classes.header2 : "";
    let style = inlineStyle && inlineStyle.header2 ? inlineStyle.header2 : {};
    let renderedCols = columns
      .reduce((resultColumns, col) => {
        if (col.columns && col.columns.length > 0) {
          resultColumns.push(...col.columns);
        }
        return resultColumns;
      }, [])
      .map((col) => {
        const { titleFormatter, title, leftAlign } = col;
        return (
          <th className="tbl-bordered-header" colSpan={col.colSpan} rowSpan={col.rowSpan} style={leftAlign ? { textAlign: 'left' } : {}}>
            <span className={`${col.className}`}>{titleFormatter ? titleFormatter(title) : title}</span>
          </th>
        );
      })
      .filter((col) => col);
    if (renderedCols.length > 0) {
      renderedheaders.push({
        height: height,
        renderedCols: renderedCols,
        className: className,
        inlineStyle: style,
      });
    }
  }

  return renderedheaders.length > 0
    ? renderedheaders.map((header) => (
      <tr className={header.className} style={_.merge({ height: header.height }, header.inlineStyle)}>
        {header.renderedCols}
      </tr>
    ))
    : null;
};

const ReportTableSectionRenderer = (props) => {
  let { rowsData, section } = props;
  const { columns, heights, classes, inlineStyle, minDataRowsCount, inlineData } = section;

  let rowsDataSchema = getDataRowSchema(columns);
  return (
    <Fragment>
      {inlineData ? (
        <Fragment>
          <thead>{RenderInlineReportTable(columns, heights, classes, inlineStyle, rowsData)}</thead>
        </Fragment>
      ) : (
        <Fragment>
          <thead>{RenderReportTableHeader(columns, heights, classes, inlineStyle)}</thead>
          <tbody>{RenderReportTableData(rowsDataSchema, rowsData, minDataRowsCount)}</tbody>
        </Fragment>
      )}
    </Fragment>
  );
};

export default ReportTableSectionRenderer;
