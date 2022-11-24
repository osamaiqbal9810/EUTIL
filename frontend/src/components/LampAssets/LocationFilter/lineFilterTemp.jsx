import React, { Component } from "react";
import CommonModal from "components/Common/CommonModal";
import LocationListSelection from "./LocationListSelection";
import CustomFilters from "components/Common/Filters/CustomFilters";
class LineFilterTemp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locationFilters: [{ text: "Location's", state: false, logic: 2 }],
    };
    this.handleFilterClick = this.handleFilterClick.bind(this);
    this.handleSubmitModalClick = this.handleSubmitModalClick.bind(this);
    this.setFilterLines = this.setFilterLines.bind(this);
  }

  componentDidMount() {
    if (this.props.locationFilter) {
      let locFilters = [{ text: "Location's", state: true, logic: 2 }];
      this.setState({
        locationFilters: locFilters,
      });
    }
  }
  handleFilterClick(filter, index) {
    if (filter.logic == 2) {
      if (filter.state) {
        this.setState({
          lineSelectionDialog: true,
        });
        this.openModelMethod();
      } else {
        this.props.clearLineFilter();
      }
    }
  }

  handleSubmitModalClick() {
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
      this.props.showLocationAsset(linesArray, this.props.locationAssetType);
    }
  }
  render() {
    return (
      <React.Fragment>
        <CommonModal
          handleSubmitClick={this.handleSubmitModalClick}
          headerText="Select Location(s)"
          handleCancelClick={() => {}}
          setModalOpener={method => {
            this.openModelMethod = method;
          }}
        >
          <LocationListSelection
            lineAssetsToShow={this.props.lineAssetsToShow}
            setAllLineGetMethod={method => {
              this.getLineFilterMethod = method;
            }}
            setFilterLines={this.setFilterLines}
          />
        </CommonModal>
        <CustomFilters handleClick={this.handleFilterClick} filters={this.state.locationFilters} exclusive displayText={""} />
      </React.Fragment>
    );
  }
}

export default LineFilterTemp;
