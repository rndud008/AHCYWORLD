import React, { useContext, useEffect, useState } from "react";
import "../css/HompyMusic.css";
import { LoginContext } from "../../../webpage/components/login/context/LoginContextProvider";
import axios from "axios";
import api, { SERVER_HOST } from "../../../apis/api";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import '../css/HompyMusic.css';
import Swal from "sweetalert2";

const HompyMusic = () => {
  const { hompyId } = useParams(); // URL에서 hompyId 가져오기
  const { userInfo, hompyInfo, setHompyInfo } = useContext(LoginContext);
  const [musicItems, setMusicItems] = useState([]);
  const [myplayList, setMyPlayList] = useState([]);

  useEffect(() => {
    const playList =
      (hompyInfo.miniHompyBgm != null && hompyInfo.miniHompyBgm.split(",")) || [];
    let type = "배경음악";
    let musics = [];
    
    const userItemLits = async () => {
      try {
        const response = await axios({
          method: "GET",
          url: `${SERVER_HOST}/cart/${userInfo.id}/items`, // 로그인된 사용자의 아이템 가져오기
        });
        
        response.data.forEach((cart) => {
          if (cart.item.itemType === type) {
            musics.push(cart.item);
          }
        });
      
        setMusicItems(musics.filter((item) => (
          !playList.includes(`${item.sourceName}-${item.itemName}`)
        )));

        setMyPlayList(musics.filter((item) => (
          playList.includes(`${item.sourceName}-${item.itemName}`)
        )));
      } catch (error) {
        console.error("Error fetching user items:", error);
      }
    };
    
    userItemLits();
  }, [userInfo.id, hompyInfo]);

  const handleSaveBgm = async () => {
    try {
      let hompy = { ...hompyInfo }; // hompyInfo를 복사해서 사용

      // 음악 저장
      let playList = myplayList.map((item) => 
        `${item.sourceName}-${item.itemName}`
      ).join(",");

      hompy.miniHompyBgm = playList;

      const response = await api.post(`${SERVER_HOST}/hompy/${hompyId}`, hompy, {
        headers: {
          Authorization: "Bearer " + Cookies.get("accessToken"),
        },
      });

      const { data, status } = response;

      if (status === 200) {
        setHompyInfo(data); // hompyInfo를 업데이트
        Swal.fire({
          icon: "success",
          title: "성공!",
          text: "BGM 설정 완료!",
          confirmButtonText: "확인",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "실패",
          text: "업데이트 중 오류가 발생했습니다.",
          confirmButtonText: "확인",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "실패",
        text: "업데이트 중 오류가 발생했습니다.",
        confirmButtonText: "확인",
      });
    }
  };

  const bgmChangeValue = (music) => {
    setMyPlayList([...myplayList, music]);
    setMusicItems(musicItems.filter(item => (
      `${item.sourceName}-${item.itemName}` !== `${music.sourceName}-${music.itemName}`
    )));
  }

  const playChangeValue = (music) => {
    setMusicItems([...musicItems, music]);
    setMyPlayList(myplayList.filter(item => (
      `${item.sourceName}-${item.itemName}` !== `${music.sourceName}-${music.itemName}`
    )));
  }

  return (
  <>  
    <div className="hompyMusic-container">
      <div className="music-list">
        <h1>My Bgm List</h1>
        <div className="music-items">
          {musicItems &&
            musicItems.map((item) => (
              <div
                key={`${item.sourceName}-${item.itemName}`}
                className="music-item"
                onClick={() => bgmChangeValue(item)}
              >
                <span>
                  {item.sourceName} - {item.itemName}
                </span>
              </div>
            ))}
        </div>
      </div>

      <div className="music-list">
        <h1>My Play List</h1>
        <div className="music-items">
          {myplayList &&
            myplayList.map((item) => (
              <div
                key={`${item.sourceName}-${item.itemName}`}
                className="music-item"
                onClick={() => playChangeValue(item)}
              >
                <span>
                  {item.sourceName} - {item.itemName}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
    <div className="bgmsetting-btn-box">
      <button className="bgmsetting-btn" onClick={handleSaveBgm}>
        저장
      </button>
    </div>
  </>    
  );
};

export default HompyMusic;
