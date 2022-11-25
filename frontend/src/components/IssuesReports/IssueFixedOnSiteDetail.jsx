import React, { Component } from "react";
import { getServerEndpoint } from "utils/serverEndpoint";
import { languageService } from "../../Language/language.service";
import { ic_arrow_back } from "react-icons-kit/md/ic_arrow_back";
import SvgIcon from "react-icons-kit";
import _ from "lodash";
import { themeService } from "../../theme/service/activeTheme.service";
import { basicColors, retroColors, electricColors } from "../../style/basic/basicColors";
class IssueFixedOnSiteDetail extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedImg: "", showMultipleImgs: true };
    this.handleBackButton = this.handleBackButton.bind(this);
    this.handleSingleImgFromMultiple = this.handleSingleImgFromMultiple.bind(this);
  }

  handleSingleImgFromMultiple(img) {
    this.setState({
      selectedImg: img,
      showMultipleImgs: false,
      showBackButton: true,
    });
  }

  handleBackButton() {
    this.setState({
      showMultipleImgs: true,
      showBackButton: false,
    });
  }
  render() {
    let imgSelect = null;
    if (this.props.issue) {
      let imgs = _.filter(this.props.issue.imgList, (img) => {
        return img.tag == "after";
      });
      let imgComp = imgs.map((img, index) => {
        let imgName = "";
        if (img) {
          imgName = img.imgName;
        }
        let paths = getServerEndpoint() + "thumbnails/" + imgName;
        //  console.log(paths)
        return (
          <div className="colsImgs" key={index}>
            <img
              src={paths}
              style={{
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
              }}
              alt={imgName}
              onClick={(e) => {
                this.handleSingleImgFromMultiple(imgName);
              }}
            />
          </div>
        );
      });
      imgSelect = (
        <div
          style={{
            padding: "10px",
            transitionDuration: " 0.4s",
            background: "#f7f7f7",
            border: " 1px solid #e0e0e0",
            display: "inline-block",
            //    transform: "rotate(" + this.state.rotateIndex + "deg)",
          }}
        >
          <img
            src={getServerEndpoint() + "applicationresources/" + this.state.selectedImg}
            style={{
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
              border: "1px solid #e3e9ef",
              maxWidth: "100%",
              maxHeight: "100%",
            }}
          />
        </div>
      );

      if (this.state.showMultipleImgs) {
        imgSelect = <div className="rowsOfImgs">{imgComp}</div>;
      }
    }

    if (this.props.issue.marked) {
      return (
        <React.Fragment>
          <React.Fragment>
            <div style={{ ...defaultStyle, padding: "15px 0px", display: "inline-block" }}>{languageService("Fix Type")}: </div>

            <div style={{ ...defaultStyle, fontSize: "12px", padding: "5px 5px 0px", display: "inline-block" }}>
              {this.props.issue.fixType}
            </div>
          </React.Fragment>
          <React.Fragment>
            <div>
              <div style={{ ...defaultStyle, padding: "15px 0px", display: "inline-block" }}>{languageService("Fix Images")}</div>
              {this.state.showBackButton && (
                <div style={{ ...defaultStyle, display: "inline-block" }} onClick={this.handleBackButton}>
                  <SvgIcon
                    size={25}
                    icon={ic_arrow_back}
                    style={{
                      marginRight: "5px",
                      marginLeft: "5px",
                      verticalAlign: "middle",
                      cursor: "pointer",
                    }}
                  />
                </div>
              )}
            </div>

            {imgSelect}
          </React.Fragment>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        {this.props.issue.remedialActionItems.map((ra) => (
          <React.Fragment key={ra.id}>
            <div style={{ ...defaultStyle, padding: "15px 0px", display: "inline-block" }}>{languageService(ra.desc)}: </div>
            <div style={{ ...defaultStyle, fontSize: "12px", padding: "5px 5px 0px", display: "inline-block" }}>{ra.value}</div> <br />
          </React.Fragment>
        ))}
      </React.Fragment>
    );
  }
}
let defaultStyle = themeService({
  default: { fontSize: "14px", color: basicColors.first },
  retro: { fontSize: "14px", color: retroColors.second },
  electric: { fontSize: "14px", color: electricColors.second },
});
export default IssueFixedOnSiteDetail;
