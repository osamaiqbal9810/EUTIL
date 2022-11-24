import React, { Component } from "react";
import _ from "lodash";
import CustomFilters from "components/Common/Filters/CustomFilters";
import DateRangeSelector from "components/Common/DateRangeSelector";
import CommonModal from "components/Common/CommonModal";
import MultiLineSelection from "components/Common/MultiLineSelection";
import moment from "moment";
// import { Rect } from "react-konva";
import { themeService } from "../../../theme/service/activeTheme.service";
import { commonFilterStyles } from "./styles/CommonFilterStyle";
class DateAndLineFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filters: this.props.dateFilters,
      lineFilters: [{ text: "Line's", state: false, logic: 2 }],
      dateSelectionDialog: false,
      dateSelectionAction: "",
      filterDateText: "",
      lineSelectionDialog: false,
    };

    this.handleFilterClick = this.handleFilterClick.bind(this);
    this.handleDateSelectionCancel = this.handleDateSelectionCancel.bind(this);
    this.handleDateSelectionClick = this.handleDateSelectionClick.bind(this);
    this.handleSubmitLineModalClick = this.handleSubmitLineModalClick.bind(this);
    this.setFilterLines = this.setFilterLines.bind(this);
  }

  handleFilterClick(filter, index) {
    if (filter.logic == 1) {
      if (filter.state) {
        this.setState({
          dateSelectionDialog: true,
          dateSelectionAction: filter.text,
        });
      } else {
        if (this.props.getRangeFromServer) {
          this.handleDateSelectionCancel();
        } else {
          this.clearAllDateFilters();
        }
      }
    } else if (filter.logic == 2) {
      if (filter.state) {
        this.setState({
          lineSelectionDialog: true,
        });
        this.openModelMethod();
      } else {
        this.clearLineFilter();
      }
    } else if (filter.logic == 3) {
      let indexToSet = index;
      if (filter.state) {
        this.props.clickedFilter(filter.text);
      } else {
        indexToSet = this.props.dateFilterName;
        this.props.clickedFilter(this.props.dateFilterName);
      }
      // let filterDateText = "";
      // let range = this.props.fixedDateRanges[this.state.filters[indexToSet].text];
      // if (range && range.from != undefined) {
      //   filterDateText = moment(range.from).format("llll");

      //   if (range.to != undefined && moment(range.from).format("llll") != moment(range.to).format("llll")) {
      //     filterDateText += " to " + moment(range.to).format("llll");
      //   }
      // }

      // this.setState({
      //   filterDateText: filterDateText,
      // });
    }
  }

  handleDateSelectionCancel() {
    //clear all filters
    let filters = _.cloneDeep(this.state.filters);
    let defaultIndex = this.props.dateFilterName;
    filters.forEach((filter, index) => {
      if (defaultIndex == index) {
        this.props.clickedFilter(filter.text);
        filter.state = true;
      } else {
        filter.state = false;
      }
    });

    this.clearAllDateFilters({ filters: filters, dateSelectionDialog: false });
  }

  clearAllDateFilters(additionalState = null) {
    if (this.props.getRangeFromServer) {
      this.props.clickedFilter(this.props.dateFilterName);
    } else {
      let allData = this.props.data;
      if (this.state.lineFilters[0].state) {
        allData = this.props.multiData ? this.props.multiData : allData;
      }
      this.props.calculateSummaryData(allData);
    }
    let st = {
      filterDateText: "",
    };

    if (additionalState) {
      st = Object.assign(st, additionalState);
    }
    this.setState(st);
  }

  clearLineFilter() {
    if (this.state.filterDateText) {
      let lineFilters = _.cloneDeep(this.state.lineFilters);
      for (let lineFilter of lineFilters) {
        lineFilter.state = false;
      }
      let newobj = [...this.props.data];
      _.remove(newobj, mntnce => {
        return mntnce.lineId !== this.props.selectedLine._id;
      });
      this.props.calculateSummaryData(newobj);
    } else {
      this.props.setDefaultObjects();
    }
  }

  handleSubmitLineModalClick() {
    let filters = _.cloneDeep(this.state.filters);
    filters.forEach(fil => {
      fil.state = false;
    });
    this.setState({
      filters: filters,
    });
    this.getLineFilterMethod();
  }

  setFilterLines(linestoGet) {
    let linesArray = [];
    linestoGet.forEach(element => {
      if (element.showDataOf) {
        linesArray.push(element._id);
      }
    });
    if (linesArray.length > 0) {
      this.props.getMultiLineData(linesArray, this.props.apiCall);
      //this.props.getMultiLineData(linesArray, "asset");
      //console.log('Multiline array:',linesArray);
    }
  }

  handleDateSelectionClick(range) {
    if (this.props.getRangeFromServer) {
      let filterRange = { from: moment(range.from).startOf("day"), to: moment(range.to ? range.to : range.from).endOf("day") };
      this.props.getRangeFromServer(filterRange);
    } else {
      let action = this.state.dateSelectionAction;
      let allData = this.props.data;
      if (this.state.lineFilters[0].state) {
        allData = this.props.multiData;
      }
      let cols = [];
      if (action) {
        let result = _.find(this.state.filters, { text: action });
        cols[result.text] = result.propertyValue;
      }

      if (cols[action] == undefined) {
        return;
      }

      allData = this.filterData(
        allData,
        cols[action],
        range.from,
        range.to,
        (a, b) => {
          return moment(a).isSame(b, "day");
        },
        (a, b) => {
          return moment(a).isAfter(b, "day");
        },
        (a, b) => {
          return moment(a).isBefore(b, "day");
        },
      );
      this.props.calculateSummaryData(allData);
    }
    let filterDateText = "";
    if (range && range.from != undefined) {
      filterDateText = range.from.toLocaleDateString("en-US");

      if (range.to != undefined && range.from.getTime() != range.to.getTime()) {
        filterDateText += " to " + range.to.toLocaleDateString("en-US");
      }
    }

    this.setState({
      dateSelectionDialog: !this.state.dateSelectionDialog,
      filterDateText: filterDateText,
      dateRange: range,
    });
  }

  filterData(dataCollection, key, from, to, isEqual = null, isGreater = null, isLess = null) {
    if (!isGreater)
      isGreater = (a, b) => {
        return a > b;
      };
    if (!isLess)
      isLess = (a, b) => {
        return a < b;
      };
    if (!isEqual)
      isEqual = (a, b) => {
        return a === b;
      };

    if (to == undefined) to = from;

    let filteredData = dataCollection.filter(d => {
      let grt = isGreater(d[key], from);
      let eqf = isEqual(d[key], from);
      let lst = isLess(d[key], to);
      let eqt = isEqual(d[key], to);

      return d && d.hasOwnProperty(key) && (grt || eqf) && (lst || eqt);
      //(d[key]>=from && d[key]<=to));
    });

    return filteredData;
  }

  render() {
    return (
      <div>
        <DateRangeSelector
          modal={this.state.dateSelectionDialog}
          toggle={this.handleDateSelectionCancel}
          handleOkClick={this.handleDateSelectionClick}
        />

        <CommonModal
          handleSubmitClick={this.handleSubmitLineModalClick}
          headerText="Select Line's"
          handleCancelClick={this.handleLinesCancelClick}
          setModalOpener={method => {
            this.openModelMethod = method;
          }}
        >
          <MultiLineSelection
            handleLineClick={this.handleLineFilterChange}
            setAllLineGetMethod={method => {
              this.getLineFilterMethod = method;
            }}
            setFilterLines={this.setFilterLines}
          />
        </CommonModal>
        {!this.props.displayDateElement && (
          <span>
            <CustomFilters
              handleClick={this.handleFilterClick}
              filters={this.state.filters}
              exclusive
              displayText={this.props.filterDateText ? this.props.filterDateText : this.state.filterDateText}
              showDisplayText
            />
            <div style={themeService(commonFilterStyles.divider)}> |</div>
          </span>
        )}

        {/* <CustomFilters handleClick={this.handleFilterClick} filters={this.state.lineFilters} exclusive displayText={""} /> */}
      </div>
    );
  }
}

export default DateAndLineFilter;

DateAndLineFilter.defaultProps = {
  dateFilters: [{ text: "Date", state: false, logic: 1, propertyValue: "date" }],
};
