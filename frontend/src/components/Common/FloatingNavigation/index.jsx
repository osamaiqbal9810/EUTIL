import React, { Component } from "react";
import { arrowUp2 } from "react-icons-kit/icomoon/arrowUp2";
import { arrowDown2 } from "react-icons-kit/icomoon/arrowDown2";
import { Icon } from "react-icons-kit";
import { topNavigationStyle } from "./style/index";
import { themeService } from "theme/service/activeTheme.service";

class FloatingNavigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rightValue: "-32px",
    };
    this.topHit = this.topHit.bind(this);
    this.bottomHit = this.bottomHit.bind(this);
    this.toggleRight = this.toggleRight.bind(this);
  }
  toggleRight() {
    this.state.rightValue == "-32px" ? this.setState({ rightValue: 0 }) : this.setState({ rightValue: "-32px" });
  }
  topHit() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
  bottomHit() {
    //document.getElementById("bottom");
    //let bottom = window.innerHeight;
    if (document.body.contains(document.getElementById("mainContent"))) {
      let bottom = document.getElementById("mainContent").offsetHeight;
      window.scrollTo(0, bottom);
    }
  }
  render() {
    return (
      <React.Fragment>
        <div
          className={!localStorage.getItem("touch-device") ? "nav-wrapper touch" : "nav-wrapper"}
          style={{ ...themeService(topNavigationStyle.navWrapper), right: this.state.rightValue }}
          onClick={!localStorage.getItem("touch-device") ? this.toggleRight : null}
        >
          <div className="top-nav" onClick={this.topHit}>
            {" "}
            <Icon size={"16"} icon={arrowUp2} />
          </div>
          <div className="bottom-nav" onClick={this.bottomHit}>
            {" "}
            <Icon size={"16"} icon={arrowDown2} />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default FloatingNavigation;
