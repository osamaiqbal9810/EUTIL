import React, { Component } from "react";

import { Link, Route } from "react-router-dom";
import { LandStyle } from "style/components/TopBarView";
import options from "components/Language/option";
import _ from "lodash";
class LangSelectionAreaTopBar extends Component {
  render() {
    let lang = {};
    lang = _.filter(options.options, (option) => {
      return option.value === this.props.language;
    });
    return (
      <div>
        <Link to={"/lang"} className="linkStyleTable" style={LandStyle}>
          {/* {this.props.language == "en" ? "English" : "Español"} */}
          {lang[0].name}
        </Link>
      </div>
    );
  }
}

export default LangSelectionAreaTopBar;
