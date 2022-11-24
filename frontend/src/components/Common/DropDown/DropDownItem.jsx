import React, { Component } from "react";

class DropDownItem extends Component {
  state = {};
  render() {
    let locations =
      this.props.loc &&
      this.props.loc.map((loc) => {
        let childrenExist = loc.children && loc.children.length > 0 ? "-> " : "";
        return (
          <li class="parent" id={loc.id} key={loc.title + loc.id}>
            <span
              className="dropdown-item"
              id={loc.id}
              onClick={(e) => {
                this.props.onSelectItem(loc);
              }}
            >
              {childrenExist}
              {loc.title}
            </span>
            {loc.children && <DropDownItem loc={loc.children} onSelectItem={this.props.onSelectItem} />}
          </li>
        );
      });
    return <ul class="child scrollbar">{locations}</ul>;
  }
}

export default DropDownItem;
