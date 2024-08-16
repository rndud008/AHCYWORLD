import React, { useContext, useEffect, useState } from 'react';
import '../css/HompyFont.css';
import { LoginContext } from '../../../webpage/components/login/context/LoginContextProvider';
import axios from 'axios';
import { SERVER_HOST } from '../../../apis/api';

const HompyFont = () => {
  const {userInfo} = useContext(LoginContext);
  const [fontItems, setFontItems] = useState([]);

  useEffect(()=>{
    let type = "글꼴";
    let minimis = [];
    const userItemLits = async () => {
      const response = await axios({
        method:'GET',
        url:`${SERVER_HOST}/cart/${userInfo.id}/items`
      })
        response.data.forEach(cart => {
          if(cart.item.itemType === type){
            minimis.push(cart.item);
          }
        });
        console.log(minimis);
        setFontItems(minimis);
    }
    userItemLits();
  },[])



  return (
    <div className='hompyFont-container'>
      <h1>글꼴 설정</h1>
    </div>
  );
};

export default HompyFont;