import React, { Component } from "react";
import CustomFilter from "./CustomFilter";
import { themeService } from "../../../theme/service/activeTheme.service";
import { commonFilterStyles } from "./styles/CommonFilterStyle";

class CustomFilters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filters: [],
      displayText: "",
    };

    this.handleFilterClick = this.handleFilterClick.bind(this);
  }

  componentDidMount() {
    this.setState({
      filters: this.props.filters,
    });
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    return { filters: nextProps.filters, displayText: nextProps.displayText };
  }

  // componentDidUpdate(prevProps, prevState)
  // {
  //}

  handleFilterClick(filter, index) {
    if (this.props.exclusive && filter.state) {
      let f1 = [...this.props.filters];
      for (let fs of f1) {
        if (fs.text != filter.text) {
          fs.state = false;
        }
      }

      this.setState({ filters: f1 });
    }

    this.props.handleClick(filter, index);
  }
  render() {
    let styles = getStyles();

    let filters = this.state.filters;
    let comp = [];
    if (filters && filters.length) {
      if (this.props.showDisplayText) {
        comp.push(
          <div style={themeService(styles.textStyle)} key="00">
            {this.state.displayText}
          </div>,
        );
      }
      let length = filters.length;
      comp = [
        ...comp,
        filters.map((filter, index) => {
          let id = filter.id ? filter.id : filter.text;
          return (
            <div style={{ display: "inline-block", cursor: "pointer" }} key={id}>
              <CustomFilter filter={filter} handleClick={this.handleFilterClick} index={index} />
              {index !== length - 1 && <div style={themeService(commonFilterStyles.divider)}> | </div>}
            </div>
          );
        }),
      ];
    }
    return comp;
  }
}
export default CustomFilters;
let getStyles = (props, state) => {
  let commonStyle = commonFilterStyles.textFilterStyle;
  return { textStyle: commonStyle };
};
