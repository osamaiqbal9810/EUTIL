import React, { Component } from "react";
import DropDownItem from "./DropDownItem";
import { Icon } from "react-icons-kit";
import { caretDown } from "react-icons-kit/fa/caretDown";
class DropDownWrapper extends Component {
  constructor(props) {
    super(props);

    this.state = { showChild: false };
    this.handelClick = this.handelClick.bind(this);
  }

  handelClick() {
    //this.setState({ showChild: !this.state.showChild });
  }
  render() {
    let result = this.props.locations
      ? this.props.locations.map((loc) => {
          return (
            <li class={this.state.showChild ? "parent" : "parent show"}>
              <span
                className="d-Label"
                data-toggle="dropdown"
                class="dropdown-toggle"
                key={loc.id}

                //   onMouseEnter={this.handelOver}
                //   onMouseLeave={this.handelOut}
              >
                {loc.title}
              </span>
              {loc.children && (
                <span className="menu-button" role="button" onClick={() => this.handelClick()}>
                  <Icon size={20} icon={caretDown} />
                </span>
              )}
              {loc.children && <DropDownItem loc={loc.children} showChild={this.state.showChild} onSelectItem={this.props.onSelectItem} />}
            </li>
          );
        })
      : null;
    return result;
  }
}

export default DropDownWrapper;
