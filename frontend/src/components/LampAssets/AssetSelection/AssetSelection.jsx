import React, { Component, useState } from "react";
import DualListBox from "react-dual-listbox";
import "react-dual-listbox/lib/react-dual-listbox.css";
import { ic_chevron_left } from "react-icons-kit/md/ic_chevron_left";
import { ic_chevron_right } from "react-icons-kit/md/ic_chevron_right";
//import { ic_chevron_up } from "react-icons-kit/md/ic_chevron_up";
//import { ic_chevron_down } from "react-icons-kit/md/ic_chevron_down";
import { languageService } from "../../../Language/language.service";
import SvgIcon from "react-icons-kit";
import _ from "lodash";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText,
} from "reactstrap";
import { Icon } from "react-icons-kit";

class AssetsSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [],
      selected: props.selected || [],
    };
    //this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {
    //console.log(this.props.options);
    //this.setState({ options: this.props.options });
    let stateObj = {};
    if (prevProps.options != this.props.options) {
      stateObj = { options: this.props.options };
    }
    if (prevProps.selected !== this.props.selected) {
      stateObj = {
        ...stateObj,
        ...{ selected: this.props.selected },
      };
    }
    if (!_.isEmpty(stateObj)) {
      this.setState(stateObj);
    }
  }

  componentWillReceiveProps(nextProps) {}

  onChange = selected => {
    //console.log(selected);
    this.props.selectedValues(selected) ;
    this.setState({ selected });
    if (this.props.onAssetChange) {
      this.props.onAssetChange(selected);
    }
  };

  render() {
    const options = this.props.options || [];

    const options1 = [
      {
        label: "Track",
        options: [
          { value: "track1", label: "Track 1" },
          { value: "track2", label: "Track 2" },
        ],
      },
      {
        label: "Rails",
        options: [
          { value: "rail1", label: "Rail-N" },
          { value: "rail2", label: "Rail-S" },
        ],
      },
      {
        label: "Signals",
        options: [
          { value: "s1", label: "Signal 1" },
          { value: "s2", label: "Signal 2" },
          { value: "s3", label: "Signal 3" },
          { value: "s4", label: "Signal 4" },
        ],
      },
    ];
    let icons = {
      moveLeft: <SvgIcon key="left" size={20} icon={ic_chevron_left} />,
      moveAllLeft: [
        <SvgIcon
          key="leftAll1"
          size={20}
          icon={ic_chevron_left}
          style={{ verticalAlign: "middle", height: "100%", marginRight: "-7px", padding: "0px" }}
        />,
        <SvgIcon
          key="leftAll2"
          size={20}
          icon={ic_chevron_left}
          style={{ verticalAlign: "middle", height: "100%", marginLeft: "-7px", padding: "0px" }}
        />,
      ],
      moveRight: <SvgIcon key="right" size={20} icon={ic_chevron_right} />,
      moveAllRight: [
        <SvgIcon
          size={20}
          key="rightAll1"
          icon={ic_chevron_right}
          style={{ verticalAlign: "middle", height: "100%", marginRight: "-7px", padding: "0px" }}
        />,
        <SvgIcon
          size={20}
          key="rightAll2"
          icon={ic_chevron_right}
          style={{ verticalAlign: "middle", height: "100%", marginLeft: "-7px", padding: "0px" }}
        />,
      ],
      moveDown: <SvgIcon size={20} icon={ic_chevron_right} />,
      moveUp: <SvgIcon size={20} icon={ic_chevron_left} />,
    };
    const { selected } = this.state;

    return (
      <div>
        <DualListBox
          showHeaderLabels={this.props.showHeadersLabels ? true : false}
          lang={{ availableHeader: this.props.availableHeader, selectedHeader: this.props.selectedHeader }}
          options={this.props.options || []}
          selected={selected}
          onChange={this.onChange}
          icons={icons}
        />
      </div>
    );
  }
}
export default AssetsSelection;
