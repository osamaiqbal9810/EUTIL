import React, { Component } from "react";
import classnames from "classnames";
import "./pagination.css";
import { themeService } from "theme/service/activeTheme.service";
import { paginationStyle } from "./style/PaginationComponent";
import { languageService } from "../../../Language/language.service";

//
// import _ from './utils'

const defaultButtonNext = (props) => (
  <button type="button" {...props} className=" myButtonNext" style={themeService(paginationStyle.myButtonNext)}>
    {props.children}
  </button>
);

const defaultButtonPrev = (props) => (
  <button type="button" {...props} className=" myButtonPrev" style={themeService(paginationStyle.myButtonPrev)}>
    {props.children}
  </button>
);

export default class PaginationComponent extends Component {
  constructor(props) {
    super();

    this.getSafePage = this.getSafePage.bind(this);
    this.changePage = this.changePage.bind(this);
    this.applyPage = this.applyPage.bind(this);

    this.state = {
      page: props.page,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ page: nextProps.page });
    if (this.props.pageSize !== nextProps.pageSize) {
      this.props.onPageSizeChange(nextProps.pageSize);
    }
  }

  getSafePage(page) {
    if (Number.isNaN(page)) {
      page = this.props.page;
    }
    return Math.min(Math.max(page, 0), this.props.pages - 1);
  }

  changePage(page) {
    //console.log(page);
    page = this.getSafePage(page);
    this.setState({ page });
    if (this.props.page !== page) {
      this.props.onPageChange(page);
    }
  }

  applyPage(e) {
    if (e) {
      e.preventDefault();
    }
    const page = this.state.page;
    this.changePage(page === "" ? this.props.page : page);
  }

  getPaginationNumbers(current, min, max, range) {
    if (range > max) range = max;
    let pageNumbers, start, end;
    pageNumbers = [];
    start = current - Math.floor(range / 2);
    start = Math.max(start, min);
    start = Math.min(start, min + max - range);
    if (min < start) {
      range = range - 1;
    }

    end = start - 1 + range;
    let selectedStyle = {
      fontSize: "12px",
      padding: " 4px 10px",
      color: "var(--first)",
      border: "2px solid #a7cdb8",
    };
    if (min < start) {
      pageNumbers.push(
        <div
          className="pagesNumbers"
          key={min}
          onClick={() => {
            this.changePage(min - 1);
          }}
        >
          {min}
        </div>,
      );
    }
    for (let i = start; i <= end; i++) {
      let pageNumber = (
        <div
          className="pagesNumbers"
          style={i == current ? selectedStyle : null}
          key={i}
          onClick={() => {
            this.changePage(i - 1);
          }}
        >
          {i == start && min < start && "..."}
          {i}
          {i == end && end < max - 1 && "..."}
        </div>
      );

      pageNumbers.push(pageNumber);
    }
    if (end !== max) {
      pageNumbers.push(
        <div
          className="pagesNumbers"
          key={max}
          onClick={() => {
            this.changePage(max - 1);
          }}
        >
          {max}
        </div>,
      );
    }
    return pageNumbers;
  }
  getPaginationEntries() {
    let paginationObj = { initial: 0, to: 0, of: 0 };
    let initialEntry, toEntry, ofEntry;
    // initial  entry "1 out of" based on the current page and page size
    initialEntry = this.props.page * this.props.pageSize + 1;
    // if there is no entry it should be "0 out of 0"
    if (this.props.data.length == 0) {
      initialEntry = 0;
    }
    // based on page size unless page size is length then length , in that case it is based on length
    if (this.props.data.length < this.props.pageSize) {
      toEntry = this.props.data.length;
    } else {
      //with  pagesize and with according to the current page
      toEntry = (this.props.page + 1) * this.props.pageSize;
    }
    // limit that it should not be higher then length
    if (toEntry > this.props.data.length) {
      toEntry = this.props.data.length;
    }
    // based on total length
    ofEntry = this.props.data.length;

    paginationObj.initial = initialEntry;
    paginationObj.to = toEntry;
    paginationObj.of = ofEntry;

    return paginationObj;
  }

  render() {
    const {
      // Computed
      pages,
      // Props
      page,
      showPageSizeOptions,
      pageSizeOptions,
      pageSize,
      showPageJump,
      canPrevious,
      canNext,
      onPageSizeChange,
      className,
      PreviousComponent = defaultButtonPrev,
      NextComponent = defaultButtonNext,
    } = this.props;
    let min, max, pagesNumbers, range, paginationEntries;
    min = 1;
    max = this.props.pages;

    range = this.props.paginationRange || 6;
    pagesNumbers = this.getPaginationNumbers(this.props.page + 1, min, max, range);
    paginationEntries = this.getPaginationEntries();
    return (
      <div className="customPaginationClass" style={this.props.style}>
        <div className="paginationEntries">
          <div className="entriesContainer" style={themeService(paginationStyle.entriesContainer)}>
            Showing {paginationEntries.initial} to {paginationEntries.to} of {paginationEntries.of} entries
          </div>
        </div>
        <div className="paginationCustom" style={themeService(paginationStyle.paginationCustom)}>
          <div className="nextPrevButton">
            <PreviousComponent
              onClick={() => {
                if (!canPrevious) return;
                this.changePage(page - 1);
              }}
              disabled={!canPrevious}
            >
              {this.props.previousText}
            </PreviousComponent>
          </div>
          <div className="customCenter" style={themeService(paginationStyle.customCenter)}>
            {pagesNumbers}
          </div>
          <div style={themeService(paginationStyle.entriesContainerRetro)}>
            {paginationEntries.to} {languageService("of")} {paginationEntries.of}
          </div>
          <div className="nextPrevButton">
            <NextComponent
              onClick={() => {
                if (!canNext) return;
                this.changePage(page + 1);
              }}
              disabled={!canNext}
            >
              {this.props.nextText}
            </NextComponent>
          </div>
        </div>
      </div>
    );
  }
}
