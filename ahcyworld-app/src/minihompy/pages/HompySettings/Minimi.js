import React, { useContext, useEffect, useState } from 'react';
import '../css/Minimi.css';
import { LoginContext } from '../../../webpage/components/login/context/LoginContextProvider';
import axios from 'axios';
import { SERVER_HOST } from '../../../apis/api';

const Minimi = () => {

  const {userInfo} = useContext(LoginContext);
  const [minimiItems, setMinimiItems] = useState([]);

  useEffect(()=>{
    let type = "미니미";
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
        setMinimiItems(minimis);
    }
    userItemLits();
  },[])


  return (
    <div className='minimi-container'>
      <h1>미니미 설정</h1>
    </div>
  );
};

export default Minimi;