import React, { Component } from "react";
import { languageService } from "Language/language.service";
import { Button } from "reactstrap";
import { getServerEndpoint } from "utils/serverEndpoint";
class AssetDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    let imgName = ""; //this.props.assetsData[0].images[3];
    let paths = getServerEndpoint() + "assetImages/default.jpg";
    //" + "/" + imgName;
    let imgComp = this.props.assetsData[0].images.map((img, index) => {
      let imgName1 = "";
      if (img) {
        imgName1 = img.imgName1;
        //imgName = img.imgName1[0];
      }
      let paths1 = getServerEndpoint() + "assetImages/" + imgName1;
      return (
        <div key={index} style={{ display: "inline-block", width: "100px", height: "100px", overflow: "hidden", marginRight: "5px" }}>
          <img src={paths1} style={{ display: "block", width: "100%" }} alt={imgName1} />
        </div>
      );
    });

    return (
      <React.Fragment>
        <div className="media" key={imgName}>
          <img src={paths} style={{ display: "block", marginLeft: "auto", marginRight: "auto" }} alt={imgName} />
        </div>

        <div className="asset-detail" style={{ display: "block", maxWidth: "360px", border: "1px solid red" }}>
          <div>
            <div className="rowsOfImgs">{imgComp}</div>
          </div>
        </div>
        <div className="scrollbar" style={{ height: "100%", overflowY: "auto", overflowX: "hidden" }}>
          <div className="asset-detail" style={{ minWidth: "370px" }}>
            <ul>
              <li>
                <h4 className="detail heading">{this.props.assetsData[0].name}</h4>
              </li>
              <li>
                <label className="heading">{languageService("Asset Id")} :</label>
                <span className="detail">{this.props.assetsData[0].unitId}</span>
              </li>
              <li>
                <label className="heading">{languageService("Start(milepost)")} :</label>
                <span className="detail">{this.props.assetsData[0].start}</span>
              </li>
              <li>
                <label className="heading">{languageService("End(milepost)")} :</label>
                <span className="detail">{this.props.assetsData[0].end}</span>
              </li>
              <li>
                <label className="heading">{languageService("Length(milepost)")} :</label>
                <span className="detail">{this.props.assetsData[0].assetLength}</span>
              </li>
            </ul>
            <Button>View</Button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default AssetDetail;
