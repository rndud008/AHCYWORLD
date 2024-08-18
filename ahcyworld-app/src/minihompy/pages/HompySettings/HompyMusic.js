import React, { useContext, useEffect, useState } from "react";
import "../css/HompyMusic.css";
import { LoginContext } from "../../../webpage/components/login/context/LoginContextProvider";
import axios from "axios";
import api, { SERVER_HOST } from "../../../apis/api";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";

const HompyMusic = () => {
  const { hompyId } = useParams();
  const { userInfo, hompyInfo, setHompyInfo } = useContext(LoginContext);
  const [musicItems, setMusicItems] = useState([]);
  const [myplayList, setMyPlayList] = useState();

  console.log("hompyinfo", hompyInfo);

  useEffect(() => {
    const playList =
    (hompyInfo.miniHompyBgm != null && hompyInfo.miniHompyBgm.split(",")) || (hompyInfo.miniHompyBgm == null && []);
    let type = "배경음악";
    let musics = [];
    const userItemLits = async () => {
      const response = await axios({
        method: "GET",
        url: `${SERVER_HOST}/cart/${userInfo.id}/items`,
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
    };
    userItemLits();
  }, []);

  const handleSaveBgm = async () => {
    let hompy = hompyInfo;

    // 음악 저장
    let playList = myplayList.map((item) => 
    {return `${item.sourceName}-${item.itemName}`}
    ).join(",");

    hompy.miniHompyBgm = playList;
    

    const response = await api.post(`${SERVER_HOST}/hompy/${hompyId}`, hompy, {
      headers: {
        Authorization: "Bearer " + Cookies.get("accessToken"),
      },
    });

    const { data, status } = response;
    console.log("sta", status);
    if (status === 200) {
      console.log("data", data);
      setHompyInfo(data);
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

  // console.log("playList", myplayList);

  return (
    <div className="hompyMusic-container">
      <div className="mybgmList">
        <h1>bgm-List</h1>
      {musicItems &&
        musicItems.map((item) => (
          <div onClick={() => bgmChangeValue(item)} style={{ fontSize: 30 }}>
            <span>
              {item.sourceName} - {item.itemName}
            </span>
          </div>
        ))}
      </div>
   
      <div className="myplayList">
        <h1>play-List</h1>
      {myplayList &&
        myplayList.map((item) => (
          <div onClick={() => playChangeValue(item)} style={{ fontSize: 30 }}>
            <span>
              {item.sourceName} - {item.itemName}
            </span>
          </div>
        ))}
      </div>
      <button onClick={handleSaveBgm}>저장</button>
    </div>
  );
};

export default HompyMusic;
