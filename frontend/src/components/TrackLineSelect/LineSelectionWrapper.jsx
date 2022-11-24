import React, { Component } from "react";
import TrackLineSelect from "./TrackLineSelect";
import Diagnostics from "components/diagnostics/index";
import { CRUDFunction } from "reduxCURD/container";
import { curdActions } from "reduxCURD/actions";
import { getAssetLines } from "reduxRelated/actions/assetHelperAction";
import { setSelectedLine } from "reduxRelated/actions/lineSelectionAction";
import { siteOptionsTexts, timpsOptionsTexts} from "components/SetupPage/options";
import AssetsNotFound from "../AssetsNotFound/index";
import { versionInfo } from "../MainPage/VersionInfo";
class LineSelectionWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ComponentToShow: false,
      linesForCanvas: { lines: [] },
      LineSelection: null,
    };

    this.onLineClick = this.onLineClick.bind(this);
  }

  componentDidMount() {
    this.props.getAssetLines();
  }

  onLineClick(lineObj) {
    // this.setState({
    //   ComponentShow: true
    // })
    let optionsTexts = versionInfo.isSITE() ? siteOptionsTexts: timpsOptionsTexts;
    this.props.setSelectedLine(lineObj);
    if (this.props.match) {
      let caller = this.props.match.params.caller;
      let subcaller = this.props.match.params.subcaller;
      let append = subcaller != undefined ? "/" + subcaller : "";

      if (caller) {
        let setupOp = false;
        optionsTexts.forEach(element => {
          if (element.path == caller || element.path + "s" == caller) {
            this.props.history.push(`/setup/${caller}` + append);
            setupOp = true;
          }
        }, this);
        if (!setupOp) {
          this.props.history.push("/" + caller + append);
        }
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.lineAssets !== prevProps.lineAssets &&
      this.props.assetHelperActionType !== prevProps.assetHelperActionType &&
      this.props.assetHelperActionType == "GET_LINE_ASSETS_SUCCESS"
    ) {
      let linesForCanvas = { lines: [] };
      if (this.props.lineAssets.length > 0) {
        this.props.lineAssets.forEach((line, index) => {
          let sysattr, points, strokeWidth, tension;
          sysattr = line.systemAttributes;
          if (sysattr) {
            points = sysattr.points ? JSON.parse(sysattr.points) : [];
            strokeWidth = sysattr.strokeWidth ? parseInt(sysattr.strokeWidth) : 5;
            tension = sysattr.tension ? parseInt(sysattr.tension) : 0.1;

            let lineObj = {
              objectId: line._id,
              tooltipText: sysattr ? sysattr.tooltipText : "",
              object: {
                stroke: sysattr ? sysattr.stroke : "black",
                strokeWidth: strokeWidth,
                tension: tension,
                points: points,
              },
              lineObj: line,
            };
            linesForCanvas.lines.push(lineObj);
          }
        });
      }
      //console.log(linesForCanvas);
      this.setState({
        linesForCanvas: linesForCanvas,
        LineSelection: <TrackLineSelect lines={linesForCanvas} onClick={this.onLineClick} />,
      });
    } else if (
      this.props.lineAssets.length <= 0 &&
      this.state.ComponentToShow == false &&
      this.props.assetHelperActionType == "GET_LINE_ASSETS_SUCCESS"
    ) {
      this.setState({
        LineSelection: <AssetsNotFound AssetName="Lines" />,
        ComponentToShow: true,
      });
      console.log("No Line");
    }
    // console.log(">>" + this.props.lineAssets.length, this.props.lineAssets.length <= 0);
    //console.log("::" + this.props.ComponentToShow);
    // console.log("<<" + this.props.assetHelperActionType, this.props.assetHelperActionType == "GET_LINE_ASSETS_SUCCESS");
  }

  render() {
    let CompRender = this.state.LineSelection;
    return (<div>{CompRender}</div>);
  }
}

let actionOptions = {
  create: true,
  update: true,
  read: true,
  delete: true,
  others: { getAssetLines, setSelectedLine },
};

let variables = {
  assetHelperReducer: {
    lineAssets: [],
  },
};

let LineSelectionWrapperConstructor = CRUDFunction(LineSelectionWrapper, "lineSelectionWrapper", actionOptions, variables, [
  "assetHelperReducer",
]);
export default LineSelectionWrapperConstructor;

// const objLines = {
//   lines: [
//     {
//       objectId: 'OrangeLine',
//       tooltipText: 'Orange Line Tooltip text',
//       object: {
//         stroke: 'orange',
//         strokeWidth: 5,
//         tension: 0.1,
//         points: [
//           { x: 474, y: 271 },
//           { x: 474, y: 296 },
//           { x: 475, y: 344 },
//           { x: 475, y: 384 },
//           { x: 473, y: 443 },
//           { x: 474, y: 487 },
//           { x: 473, y: 517 },
//           { x: 475, y: 563 },
//           { x: 475, y: 583 }
//         ]
//       }
//     },

//     {
//       objectId: 'BlueLine',
//       tooltipText: 'Blue Line Tooltip text',
//       object: {
//         stroke: 'blue',
//         strokeWidth: 5,
//         tension: 0.1,
//         points: [
//           { x: 207, y: 460 },
//           { x: 261, y: 459 },
//           { x: 326, y: 459 },
//           { x: 407, y: 459 },
//           { x: 469, y: 460 },
//           { x: 538, y: 459 },
//           { x: 558, y: 458 },
//           { x: 561, y: 424 },
//           { x: 562, y: 357 },
//           { x: 609, y: 313 },
//           { x: 609, y: 283 }
//         ]
//       }
//     },
//     {
//       objectId: 'PurpleLine',
//       tooltipText: 'Purple Line Tooltip text',
//       object: {
//         stroke: 'purple',
//         strokeWidth: 5,
//         tension: 0.1,
//         points: [{ x: 206, y: 457 }, { x: 182, y: 432 }, { x: 127, y: 375 }, { x: 127, y: 365 }, { x: 200, y: 286 }, { x: 234, y: 250 }]
//       }
//     }
//   ]
// }
