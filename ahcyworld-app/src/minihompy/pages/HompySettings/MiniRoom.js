import React, { useContext, useEffect, useState } from "react";
import "../css/MiniRoom.css";
import { LoginContext } from "../../../webpage/components/login/context/LoginContextProvider";
import axios from "axios";
import api, { SERVER_HOST } from "../../../apis/api";
import "./MiniRoom.style.css";
import { Button } from "react-bootstrap";
import { ServerStyleSheet } from "styled-components";
import { useParams } from "react-router-dom";
import Cookies from 'js-cookie';

const MiniRoom = () => {
  const { userInfo, hompyInfo,setHompyInfo } = useContext(LoginContext);
  const {hompyId} = useParams();
  const [miniRoomItems, setMiniRoomItems] = useState([]);
  const [miniRoom, setMiniRoom] = useState(hompyInfo.miniRoom || 'miniroom.png');

  useEffect(() => {
    let type = "스토리룸";
    let miniRooms = [];
    const userItemLits = async () => {
      console.log("호출시작");
      const response = await axios({
        method: "GET",
        url: `${SERVER_HOST}/cart/${userInfo.id}/items`,
      });
      response.data.forEach((cart) => {
        if (cart.item.itemType === type) {
          miniRooms.push(cart.item);
        }
      });
      console.log(miniRooms);
      setMiniRoomItems(miniRooms);
    };
    userItemLits();
  }, []);

  const updateMiniRoom = async() =>{
    

    let hompy = hompyInfo;
    hompy.miniRoom = miniRoom;

    const response = api.post(`${SERVER_HOST}/hompy/${hompyId}`,hompy,{
      headers:{
        'Authorization':'Bearer ' +Cookies.get('accessToken')
      }
    })
    
    const {data , status} = response;

    if(status === 200){
      setHompyInfo(data)
    }
    
  }


  return (
    <div className="miniRoom-container">
      <div>
        <h1>미니룸 설정</h1>
      </div>

      <div className="afterSelectSetting">
        <img 
        className="storyRoomSetting"
        src={`/image/${miniRoom}`} />
      </div>
      <div className="selectSettingList">
        <div className="beforeSelectSetting">
          <div>
            <img onClick={() =>setMiniRoom('miniroom.png')} src={`/image/miniroom.png`} />{" "}
            <input
              type="radio"
              id="default"
              name="miniroom"
              value={"miniroom.png"}
              onChange={(e) => setMiniRoom(e.target.value)}
              checked={'miniroom.png'===miniRoom}
            />{" "}
            <label htmlFor="default">기본 미니룸</label>
          </div>

          {miniRoomItems && miniRoomItems.map(item => (
            <div>
            <img onClick={() =>setMiniRoom(item.fileName)} src={`/image/${item.fileName}`} />{" "}
            <input
              type="radio"
              id={item.id}
              name="miniroom"
              value={item.fileName}
              onChange={(e) => setMiniRoom(e.target.value)}
              checked={item.fileName===miniRoom}
            />{" "}
            <label htmlFor={item.id}>{item.itemName}</label>
          </div>
          ))}
         
        </div>
        <button onClick={updateMiniRoom}>변경</button>
      </div>
    </div>
  );
};

export default MiniRoom;
