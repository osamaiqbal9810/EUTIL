import React, { Component } from "react";
import AudioStyledComponent from "./AudioStyledComponent";
import { getServerEndpoint } from "utils/serverEndpoint";
class AudioArea extends Component {
  componentDidMount() {
    console.log(this.props.audio);
  }
  render() {
    let audioComps = this.props.audio
      ? this.props.audio.map(voice => {
          let path = "http://" + getServerEndpoint() + "audio/" + voice.voiceName;
          return <AudioStyledComponent key={voice.voiceName} voice={voice.voiceName} paths={path} />;
        })
      : null;
    return <div style={{ display: "inline-block" }}> {audioComps}</div>;
  }
}

export default AudioArea;
