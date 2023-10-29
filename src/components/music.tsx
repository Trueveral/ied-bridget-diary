import React from "react";
import ReactAudioPlayer from "react-audio-player";

function BackgroundMusic() {
  return (
    <ReactAudioPlayer
      src="your-background-music.mp3"
      autoPlay
      controls={false} // 如果您不希望显示控件
    />
  );
}

export default BackgroundMusic;
