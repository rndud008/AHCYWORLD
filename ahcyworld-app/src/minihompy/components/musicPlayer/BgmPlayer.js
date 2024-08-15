import React, { useState, useRef, useCallback, useEffect } from "react";
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
import axios from "axios";
import { SERVER_HOST } from "../../../apis/api"; // SERVER_HOST 가져오기

const BgmPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef(null);
  const volumeRef = useRef(0.5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bgmList, setBgmList] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  useEffect(() => {
    // 배경음악 리스트 가져오기
    const fetchBgmList = async () => {
      try {
        const type = '배경음악';
        const response = await axios.get(`${SERVER_HOST}/item/${type}`, {
          params: {
            page: 1, // 첫 페이지
          },
        });
        setBgmList(response.data.items);
        if (response.data.items.length > 0) {
          audioRef.current.src = response.data.items[0].fileName;
        }
      } catch (error) {
        console.error("음악 목록을 가져오기 실패: ", error);
      }
    };

    fetchBgmList();
  }, []);

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

  const handleNextTrack = () => {
    if (bgmList.length > 0) {
      const nextIndex = (currentTrackIndex + 1) % bgmList.length;
      setCurrentTrackIndex(nextIndex);
      audioRef.current.src = bgmList[nextIndex].fileName;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePreviousTrack = () => {
    if (bgmList.length > 0) {
      const prevIndex = (currentTrackIndex - 1 + bgmList.length) % bgmList.length;
      setCurrentTrackIndex(prevIndex);
      audioRef.current.src = bgmList[prevIndex].fileName;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleTrackSelect = (index) => {
    setCurrentTrackIndex(index);
    const selectedTrack = bgmList[index];

    console.log("Current audio source:", selectedTrack.fileName);

    if (selectedTrack.fileName) {
      audioRef.current.src = selectedTrack.fileName;
      audioRef.current.play().catch(error => {
        console.error("Audio playback failed:", error);
      });
      setIsPlaying(true);
    } else {
      console.error("No valid audio source available.");
    }

    setIsModalOpen(false); // 모달을 닫음
  };

  return (
    <div className="bgm-player">
      {/* <div className="cover-image">
        {bgmList.length > 0 && (
          <img src={bgmList[currentTrackIndex].bgmImg} alt="Cover" />
        )} 
      </div> */}
      <div className="track-info">
        {bgmList&& bgmList.length > 0 && (
          <strong>{bgmList[currentTrackIndex].itemName} - {bgmList[currentTrackIndex].sourceName}</strong>
        )}
      </div>
      <audio ref={audioRef} src={ bgmList && bgmList.length > 0 ? bgmList[0].fileName : ""} onEnded={handleNextTrack}></audio>
      <div className="controls">
        <div className="controls-box">
          <button onClick={togglePlayPause}>
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <button onClick={stopPlayback}>
            <FaStop />
          </button>
          <button onClick={handlePreviousTrack}>
            <FaBackward />
          </button>
          <button onClick={handleNextTrack}>
            <FaForward />
          </button>
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
          <button onClick={toggleModal}>
            <FaList />
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-bgm">
          <div className="bgm-modal-content">
            <h2>BGM List</h2>
            <ol>
              {bgmList.map((track, index) => (
                <li key={index} onClick={() => handleTrackSelect(index)} className="bgm-list">
                  {track.itemName} - {track.sourceName}
                </li>
              ))}
            </ol>
            <button onClick={toggleModal} className="bgm-modal-btn">
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BgmPlayer;
