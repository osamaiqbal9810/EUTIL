/* eslint eqeqeq: 0 */
import React, { Component } from "react";
import AudioComponent from "./AudioComponent";
import { getServerEndpoint } from "utils/serverEndpoint";
import SvgIcon from "react-icons-kit";
import { ic_keyboard_arrow_left } from "react-icons-kit/md/ic_keyboard_arrow_left";
import { ic_keyboard_arrow_right } from "react-icons-kit/md/ic_keyboard_arrow_right";
class IssueAudios extends Component {
  constructor(props) {
    super(props);
    this.state = {
      indexToShow: "",
      nextPrevButtons: false,
    };
    this.handlePrevNext = this.handlePrevNext.bind(this);
  }
  componentDidMount() {
    // console.log(this.props.audios);
    let indexToShow, nextPrevButtons;
    indexToShow = "";
    nextPrevButtons = false;
    if (this.props.audios && this.props.audios.length > 0) {
      nextPrevButtons = this.props.audios.length > 1 ? true : false;
      indexToShow = 0;
    }
    this.setState({
      indexToShow: indexToShow,
      nextPrevButtons: nextPrevButtons,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    let indexToShow, nextPrevButtons;
    indexToShow = "";
    nextPrevButtons = false;
    if (this.props.audios !== prevProps.audios) {
      if (this.props.audios && this.props.audios.length > 0) {
        nextPrevButtons = this.props.audios.length > 1 ? true : false;
        indexToShow = 0;
      }
      this.setState({
        indexToShow: indexToShow,
        nextPrevButtons: nextPrevButtons,
      });
    }

  }


  handlePrevNext(action) {
    let indexToShow;
    indexToShow = this.state.indexToShow;
    if (action == 1) {
      if (this.props.audios && indexToShow < this.props.audios.length - 1) {
        indexToShow++;
      }
    } else {
      if (indexToShow) {
        indexToShow--;
      }
    }
    this.setState({
      indexToShow: indexToShow,
    });
  }
  render() {
    //console.log(this.state.indexToShow);

    let audioName = this.props.audios[this.state.indexToShow] ? this.props.audios[this.state.indexToShow].voiceName : "";
    let paths = "http://" + getServerEndpoint() + "audio/" + audioName;
    let sideText = this.state.nextPrevButtons ? this.state.indexToShow + 1 + "/" + this.props.audios.length : "";
    return (
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            display: "inline-block",
            minWidth: "20px",
            verticalAlign: "super",
          }}
        >
          {sideText}
        </div>
        {this.state.nextPrevButtons && (
          <div
            style={{ display: "inline-block", minWidth: "10px" }}
            onClick={e => {
              this.handlePrevNext(0);
            }}
          >
            <SvgIcon size={20} icon={ic_keyboard_arrow_left} />
          </div>
        )}
        <div style={{ display: "inline-block" }}>
          {/* <div style={{ textAlign: 'center' }}>{indexToShow} </div> */}
          <AudioComponent paths={paths} />
        </div>
        {this.state.nextPrevButtons && (
          <div
            style={{ display: "inline-block" }}
            onClick={e => {
              this.handlePrevNext(1);
            }}
          >
            <SvgIcon size={20} icon={ic_keyboard_arrow_right} />
          </div>
        )}
      </div>
    );
  }
}

IssueAudios.defaultProps = {
  audios: []
};

export default IssueAudios;
