import React, { useContext, useEffect, useState } from "react";
import "../css/MiniRoom.css";
import { LoginContext } from "../../../webpage/components/login/context/LoginContextProvider";
import axios from "axios";
import api, { SERVER_HOST } from "../../../apis/api";
import "../css/MiniRoom.css";
import { Button } from "react-bootstrap";
import { ServerStyleSheet } from "styled-components";
import { useParams } from "react-router-dom";
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';


const MiniRoom = () => {
  const { userInfo, hompyInfo,setHompyInfo } = useContext(LoginContext);
  const {hompyId} = useParams();
  const [miniRoomItems, setMiniRoomItems] = useState([]);
  const [miniRoom, setMiniRoom] = useState(hompyInfo.miniRoom || 'miniroom.png');

  useEffect(() => {
    let type = "스토리룸";
    let miniRooms = [];
    const userItemLits = async () => {
      const response = await axios({
        method: "GET",
        url: `${SERVER_HOST}/cart/${userInfo.id}/items`,
      });
      response.data.forEach((cart) => {
        if (cart.item.itemType === type) {
          miniRooms.push(cart.item);
        }
      });
      setMiniRoomItems(miniRooms);
    };
    userItemLits();
  }, []);

  const updateMiniRoom = async() =>{
    let hompy = hompyInfo;
    hompy.miniRoom = miniRoom;

  try {
    const response = await api.post(`${SERVER_HOST}/hompy/${hompyId}`,hompy,{
      headers:{
        'Authorization':'Bearer ' +Cookies.get('accessToken')
      },
    });
    
    const {data , status} = response;

    if (status === 200) {
      setHompyInfo(data);
      Swal.fire({
        icon: 'success',
        title: '성공!',
        text: '미니룸이 변경되었습니다.',
        confirmButtonText: '확인'
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: '실패',
        text: '업데이트 중 오류가 발생했습니다.',
        confirmButtonText: '확인'
      });
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: '실패',
      text: '업데이트 중 오류가 발생했습니다.',
      confirmButtonText: '확인'
    });
  }
};


  return (
    <div className="miniRoom-container">
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
            <div key={item.id}>
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
    </div>
      <div className="miniroom-btn-container">
        <button className="miniroom-save-btn" onClick={updateMiniRoom}>저장</button>
      </div>
    </div>
  );
};

export default MiniRoom;
