import React, { useState, useRef, useCallback } from "react";
import {
  FaPlay,
  FaPause,
  FaBackward,
  FaForward,
  FaStop,
  FaList,
  FaVolumeUp,
  FaVolumeMute,
} from "react-icons/fa";
import "./BgmPlayer.css";
import { useNavigate } from "react-router-dom";

const BgmPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef(null);
  const volumeRef = useRef(0.5);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const stopPlayback = useCallback(() => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
  }, []);

  const handleVolumeChange = (event) => {
    const newVolume = event.target.value;
    volumeRef.current = newVolume;
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  return (
    <div className="bgm-player">
      <div className="cover-image">
        <img src="/image/male.png" alt="Cover" />
      </div>
      <div className="track-info">
        <strong>Sweetbox - Life Is Cool</strong>
      </div>
      <audio ref={audioRef} src="/image/music.mp3"></audio>
      <div className="controls">
        <div className="controls-box">
          <button onClick={togglePlayPause}>
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <button onClick={stopPlayback}>
            <FaStop />
          </button>
          <button>
            <FaBackward />
          </button>
          <button>
            <FaForward />
          </button>
          <div className="time-info">
          <span>00:02 / 04:26</span>
          </div>
        </div>
        <div className="controls-box">
          
          <div className="volume-control">
            {volume > 0 ? <FaVolumeUp /> : <FaVolumeMute />}
            <input
              type="range"
              value={volume}
              min="0"
              max="1"
              step="0.01"
              onChange={handleVolumeChange}
            />
          </div>
          <button>
            <FaList />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BgmPlayer;
