import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import { Table } from "reactstrap";
import { languageService } from "../../../Language/language.service";
import { basicColors, retroColors, electricColors } from "../../../style/basic/basicColors";
import { themeService } from "../../../theme/service/activeTheme.service";

class DropDownMonths extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataComp: null,
    };
  }
  componentDidMount() {
    this.createMonthsComp();
  }

  createMonthsComp() {
    let months, comp, rows, cols, lngth;
    months = this.props.months;
    comp = [];
    rows = [];
    cols = [];
    lngth = months.length;

    months.forEach((mnth, index) => {
      if (index % 3 !== 0) {
        cols.push(
          <TableCell
            handleMonthClick={this.props.handleMonthClick}
            mnth={mnth}
            key={"cell" + index}
            index={index}
            rightBorder={(index + 1) % 3 == 0 ? true : false}
          />,
        );
      } else {
        if (cols.length > 1) {
          rows.push(cols);
          cols = [];
        }
        cols.push(<TableCell key={"cell" + index} handleMonthClick={this.props.handleMonthClick} mnth={mnth} index={index} />);
      }
      if (index === lngth - 1) {
        rows.push(cols);
      }
    });
    comp = rows.map((row, index) => {
      return <TableRow key={"row" + index} cols={row} />;
    });
    this.setState({
      dataComp: comp,
    });
  }

  render() {
    return (
      <div
        style={{
          position: "absolute",
          top: this.props.top,
          background: "var(--fifth)",
          zIndex: this.props.zIndex,
          borderBottom: borderStyle,
          opacity: this.props.opacity,
          left: "10%",
          transition: "all .2s ease-in-out",
        }}
      >
        {this.props.yearComp}
        <Table className="popupTable" borderless style={{ marginBottom: "0px" }}>
          <tbody>{this.state.dataComp}</tbody>
        </Table>
      </div>
    );
  }
}

export default DropDownMonths;

export const TableCell = (props) => {
  let borderRight = props.rightBorder ? borderStyle : null;
  return (
    <td
      style={{
        borderTop: borderStyle,
        borderLeft: borderStyle,
        borderRight: borderRight,
        cursor: "pointer",
        color: themeService({ default: basicColors.first, retro: retroColors.second, electric: electricColors.second }),
      }}
      onClick={(e) => {
        props.handleMonthClick(props.index, props.mnth);
      }}
    >
      {languageService(props.mnth)}
    </td>
  );
};

export const TableRow = (props) => {
  return <tr>{props.cols}</tr>;
};

const borderStyle = "1px solid #d0d0d0";
