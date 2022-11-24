/* eslint eqeqeq: 0 */
import React, { Component } from "react";
import "components/Common/audioFile.css";

class AudioComponent extends Component {
  componentDidUpdate(prevProps, prevState) {
    if (this.props.paths !== prevProps.paths) {
      this.reloadAudio();
    }
  }
  reloadAudio() {
    this.refs.myAudioControl01.pause();
    this.refs.myAudioControl01.load();
  }

  render() {
    return (
      <audio controls className="audioFile" ref="myAudioControl01">
        <source src={this.props.paths} type="audio/mp3" />
        <p>
          Your browser doesn't support HTML5 audio. Here is a <a href={this.props.paths}>link to the audio</a> instead.
        </p>
      </audio>
    );
  }
}

export default AudioComponent;
