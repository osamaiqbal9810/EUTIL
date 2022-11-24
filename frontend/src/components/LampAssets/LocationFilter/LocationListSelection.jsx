import React, { Component } from "react";
import CheckRowElements from "components/Common/CheckRowElements/CheckRowElements";
import _ from "lodash";
class LocationListSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allLines: [],
    };

    this.handleLineRowClick = this.handleLineRowClick.bind(this);
    this.getAllLinesFilter = this.getAllLinesFilter.bind(this);
  }
  componentDidMount() {
    this.props.setAllLineGetMethod(this.getAllLinesFilter);
    this.setState({
      allLines: this.props.lineAssetsToShow,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.lineAssetsToShow !== this.props.lineAssetsToShow) {
      this.setState({
        allLines: this.props.lineAssetsToShow,
      });
    }
  }
  handleLineRowClick(line) {
    let allLines = _.cloneDeep(this.state.allLines);
    let resultIndex = _.findIndex(allLines, { _id: line._id });
    if (resultIndex > -1) {
      allLines[resultIndex].showDataOf = !allLines[resultIndex].showDataOf;
      this.setState({
        allLines: allLines,
      });
    }
  }

  getAllLinesFilter() {
    this.props.setFilterLines(this.state.allLines);
  }

  render() {
    return <CheckRowElements data={this.state.allLines} onRowClick={this.handleLineRowClick} textPropInObj="unitId" keyPropInObj="_id" />;
  }
}

export default LocationListSelection;
