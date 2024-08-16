import React, { useContext, useEffect, useState } from 'react';
import '../css/MiniRoom.css';
import { LoginContext } from '../../../webpage/components/login/context/LoginContextProvider';
import axios from 'axios';
import { SERVER_HOST } from '../../../apis/api';

const MiniRoom = () => {

  const {userInfo} = useContext(LoginContext);
  const [miniRoomItems, setMiniRoomItems] = useState([]);

  useEffect(()=>{
    let type = "스토리룸";
    let miniRooms = [];
    const userItemLits = async () => {
      const response = await axios({
        method:'GET',
        url:`${SERVER_HOST}/cart/${userInfo.id}/items`
      })
        response.data.forEach(cart => {
          if(cart.item.itemType === type){
            miniRooms.push(cart.item);
          }
        });
        console.log(miniRooms);
        setMiniRoomItems(miniRooms);
    }
    userItemLits();
  },[])

  return (
    <div className='miniRoom-container'>
      <h1>미니룸 설정</h1>
    </div>
  );
};

export default MiniRoom;