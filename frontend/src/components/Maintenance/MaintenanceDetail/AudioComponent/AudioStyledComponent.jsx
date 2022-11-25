import React, { Component } from "react";
import "components/Common/audioFile.css";
//import { playCircleO } from "react-icons-kit/fa/playCircleO";
import { play3 } from "react-icons-kit/icomoon/play3";
//import { pauseCircleO } from "react-icons-kit/fa/pauseCircleO";
import { pause2 } from "react-icons-kit/icomoon/pause2";

import SvgIcon from "react-icons-kit";
import { themeService } from "../../../../theme/service/activeTheme.service";
import { basicColors, retroColors, electricColors } from "../../../../style/basic/basicColors";
class AudioComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      onOff: false,
      currentTime: "",
      totalDuration: "",
    };
    this.updateCurrentTime = this.updateCurrentTime.bind(this);
    this.setTotalDuration = this.setTotalDuration.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }
  reloadAudio() {
    this.refs.myAudioControl02.pause();
    this.refs.myAudioControl02.load();
  }
  handleButtonClick() {
    if (this.state.onOff) {
      this.refs.myAudioControl02.pause();
    } else {
      this.refs.myAudioControl02.play();
    }
    this.setState({
      onOff: !this.state.onOff,
    });
  }
  componentDidMount() {
    numberTimeFormat(78);
  }

  updateCurrentTime(currentTime) {
    let str = currentTime.toString().split(".");
    let time = numberTimeFormat(str[0]);
    this.setState({
      currentTime: time,
      onOff: currentTime >= this.refs.myAudioControl02.duration ? !this.state.onOff : this.state.onOff,
    });
  }

  setTotalDuration(duration) {
    let str = duration.toString().split(".");
    let time = numberTimeFormat(str[0]);
    this.setState({
      totalDuration: time,
    });
  }
  render() {
    //console.log(this.refs.myAudioControl02.currentTime());

    return (
      <div style={{ display: "inline-block" }}>
        <audio
          className="audioFile"
          ref="myAudioControl02"
          onTimeUpdate={(e) => {
            this.updateCurrentTime(this.refs.myAudioControl02.currentTime);
          }}
          onLoadedMetadata={(e) => {
            this.setTotalDuration(this.refs.myAudioControl02.duration);
          }}
        >
          <source src={this.props.paths} type="audio/mp3" />

          <p>
            Your browser doesn't support HTML5 audio. Here is a <a href={this.props.paths}>link to the audio</a> instead.
          </p>
        </audio>
        <div>
          <AudioControlsComp
            icon={this.state.onOff ? pause2 : play3}
            currentTime={this.state.currentTime}
            handleButtonClick={this.handleButtonClick}
            totalDuration={this.state.totalDuration}
          />
        </div>
      </div>
    );
  }
}

export default AudioComponent;

const AudioControlsComp = (props) => {
  // let bothTime = props.totalDuration ? props.totalDuration : "0:00";
  let currentTime = props.currentTime ? props.currentTime : "0:00";
  return (
    <div
      style={themeService({
        default: { padding: "10px", background: "rgba(227, 233, 239, 1)", marginRight: "5px" },
        retro: { padding: "10px", background: retroColors.fifth, marginRight: "5px" },
        electric: { padding: "10px", background: electricColors.fifth, marginRight: "5px" },
      })}
    >
      <div
        onClick={props.handleButtonClick}
        style={themeService({
          default: {
            textAlign: "center",
            cursor: "pointer",
            color: basicColors.first,
            border: "2px solid",
            padding: "4px 5px 0px 6px",
            backgroundColor: "rgb(255, 255, 255)",
            borderRadius: "50%",
            boxShadow: "rgb(255, 255, 255) 0px 0px 0px 2px",
            width: "33px",
            margin: "0 auto",
          },
          retro: {
            textAlign: "center",
            cursor: "pointer",
            color: retroColors.second,
            border: "2px solid",
            padding: "4px 5px 0px 6px",
            backgroundColor: "rgb(255, 255, 255)",
            borderRadius: "50%",
            boxShadow: "rgb(255, 255, 255) 0px 0px 0px 2px",
            width: "33px",
            margin: "0 auto",
          },
          electric: {
            textAlign: "center",
            cursor: "pointer",
            color: electricColors.second,
            border: "2px solid",
            padding: "4px 5px 0px 6px",
            backgroundColor: "rgb(255, 255, 255)",
            borderRadius: "50%",
            boxShadow: "rgb(255, 255, 255) 0px 0px 0px 2px",
            width: "33px",
            margin: "0 auto",
          },
        })}
      >
        <SvgIcon icon={props.icon} size={20} />
      </div>
      <div
        style={themeService({
          default: { color: basicColors.first },
          retro: { color: retroColors.second },
          electric: { color: electricColors.second },
        })}
      >
        {currentTime} / {props.totalDuration}
      </div>
    </div>
  );
};

function numberTimeFormat(seconds) {
  let time = seconds;
  let time_mod = seconds % 60;
  if (time_mod === seconds) {
    time = seconds.toString().length > 1 ? "0:" + time_mod : "0:0" + time_mod;
  } else if (time_mod === 0) {
    time = seconds / 60 + ":00";
  } else {
    let mins = (seconds - time_mod) / 60;
    // mins = mins.toString().length > 1 ? mins : "0" + mins;
    time = time_mod.toString().length > 1 ? mins + ":" + time_mod : mins + ":0" + time_mod;
  }
  return time;
}
