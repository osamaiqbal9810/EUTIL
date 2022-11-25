import React, { Fragment } from "react";

const ReportInfoSection = (props) => {
  const { rows } = props;

  return (
    <div>
      {rows.map((row) => {
        return (
          <div className="report-header-flex-container">
            <div className="report-header-property">
              {row.col1 && (
                <Fragment>
                  <label className="title">{`${row.col1.title}:`}</label>
                  <div className="value">{row.col1.value}</div>
                </Fragment>
              )}
            </div>

            <div className="spacer"></div>

            <div className="report-header-property">
              {row.col2 && (
                <Fragment>
                  <label className="title">{`${row.col2.title}:`}</label>
                  <div className="value">{row.col2.value}</div>
                </Fragment>
              )}
            </div>

            <div className="spacer"></div>
          </div>
        );
      })}
    </div>
  );
};

export default ReportInfoSection;
