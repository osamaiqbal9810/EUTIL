import React, { Component } from "react";
import moment from "moment";
import { Table } from "reactstrap";
import TableDayCell from "./TableDayCell";
import "./TableStyle.css";
import { languageService } from "../../../Language/language.service";
import { themeService } from "theme/service/activeTheme.service";
import { calenderCellStyle } from "./style/CalendarDatesTable";

class CalendarDatesTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      calComp: null,
      rows: [],
      cols: [],
    };
    this.dayNames = moment.weekdays();
    // console.log(this.dayNames);
    this.dayNamesHeaderComp = this.dayNames.map((d) => {
      return (
        <th style={themeService(calenderCellStyle.dayColmns)} key={d}>
          {d}
        </th>
      );
    });
  }

  componentDidMount() {
    this.createCalComp();
  }

  monthFirstDay() {
    let firstDay = moment(moment().month(this.props.month).set("year", this.props.year)).startOf("month").day();

    return firstDay;
  }

  monthLastDay() {
    let lastDay = moment(moment().month(this.props.month).set("year", this.props.year)).endOf("month").format("D");
    return lastDay;
  }

  getEmptyCellsBfreFirstDay(firstDay) {
    let emptyCells = [];
    for (let index = 0; index < firstDay; index++) {
      emptyCells.push(
        <td key={"empty_" + index} style={themeService(calenderCellStyle.dateCell)}>
          {""}
        </td>,
      );
    }
    return emptyCells;
  }
  getDaysCell(firstDay, lastDay) {
    let dataCells = [];
    let emptyCells = this.getEmptyCellsBfreFirstDay(firstDay);
    dataCells = [...emptyCells];
    for (let day = 1; day <= lastDay; day++) {
      let date = moment().year(this.props.year).month(this.props.month).date(day).format("YYYYMMDD");
      let dataObj = this.props.data[date] ? this.props.data[date] : [];
      dataCells.push(
        <td key={day} style={themeService(calenderCellStyle.dateCell)}>
          <TableDayCell
            version={this.props.version}
            day={day}
            data={dataObj}
            date={date}
            selectionListData={this.props.selectionListData}
            userList={this.props.userList}
            updateSelectionData={this.props.updateSelectionData}
            handleViewItem={this.props.handleViewItem}
          />
        </td>,
      );
    }
    return dataCells;
  }

  getCalStructure(daysCells) {
    let rows, cells, lngth;
    rows = [];
    cells = [];
    lngth = daysCells.length;

    daysCells.forEach((td, i) => {
      if (i % 7 !== 0) {
        cells.push(td);
      } else {
        rows.push(cells);
        cells = [];
        cells.push(td);
      }
      if (i === lngth - 1) {
        rows.push(cells);
      }
    });

    return this.mapFinalRows(rows);
  }
  mapFinalRows(rows) {
    let finalRowsCells = rows.map((row, i) => {
      return <tr key={i}>{row}</tr>;
    });
    return finalRowsCells;
  }

  createCalComp() {
    let firstDay, lastDay, daysCells;
    firstDay = this.monthFirstDay();
    lastDay = this.monthLastDay();
    // console.log("Start: ", firstDay);
    // console.log("End : ", lastDay);
    daysCells = this.getDaysCell(firstDay, lastDay);
    let comp = this.getCalStructure(daysCells);
    return comp;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.month !== this.props.month || prevProps.year !== this.props.year) {
      this.createCalComp();
    }
  }
  render() {
    let calComp = this.createCalComp();
    return (
      <Table className="calender">
        <thead>
          <tr style={themeService(calenderCellStyle.dayRow)}>{this.dayNamesHeaderComp}</tr>
        </thead>
        <tbody>{calComp}</tbody>
      </Table>
    );
  }
}

export default CalendarDatesTable;
