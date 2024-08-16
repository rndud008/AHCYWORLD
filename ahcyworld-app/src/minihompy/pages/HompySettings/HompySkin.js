import React, { useContext, useEffect, useState } from 'react';
import '../css/HompySkin.css';
import axios from 'axios';
import { SERVER_HOST } from '../../../apis/api';
import { LoginContext } from '../../../webpage/components/login/context/LoginContextProvider';


const HompySkin = () => {
  const {userInfo} = useContext(LoginContext);
  const [skinItems, setSkinItems] = useState([]);

  useEffect(()=>{
    let type = "스킨";
    let skins = [];
    const userItemLits = async () => {
      const response = await axios({
        method:'GET',
        url:`${SERVER_HOST}/cart/${userInfo.id}/items`
      })
        response.data.forEach(cart => {
          if(cart.item.itemType === type){
            skins.push(cart.item);
          }
        });
        console.log(skins);
        setSkinItems(skins);
    }
    userItemLits();
  },[])

  return (
    <div className='hompySkin-container'>
      <h1>스킨 설정</h1>
    </div>
  );
};

export default HompySkin;