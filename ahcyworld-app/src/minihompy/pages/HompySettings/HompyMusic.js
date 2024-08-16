import React, { useContext, useEffect, useState } from 'react';
import '../css/HompyMusic.css';
import { LoginContext } from '../../../webpage/components/login/context/LoginContextProvider';
import axios from 'axios';
import { SERVER_HOST } from '../../../apis/api';

const HompyMusic = () => {
  const {userInfo} = useContext(LoginContext);
  const [musicItems, setMusicItems] = useState([]);

  useEffect(()=>{
    let type = "배경음악";
    let musics = [];
    const userItemLits = async () => {
      const response = await axios({
        method:'GET',
        url:`${SERVER_HOST}/cart/${userInfo.id}/items`
      })
        response.data.forEach(cart => {
          if(cart.item.itemType === type){
            musics.push(cart.item);
          }
        });
        console.log(musics);
        setMusicItems(musics);
    }
    userItemLits();
  },[])


  return (
    <div className='hompyMusic-container'>
      <h1>음악 설정</h1>
    </div>
  );
};

export default HompyMusic;