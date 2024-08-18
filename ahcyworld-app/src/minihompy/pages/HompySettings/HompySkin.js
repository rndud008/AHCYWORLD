import React, { useContext, useEffect, useState } from 'react';
import '../css/HompySkin.css';
import axios from 'axios';
import api, { SERVER_HOST } from '../../../apis/api';
import { LoginContext } from '../../../webpage/components/login/context/LoginContextProvider';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie'


const HompySkin = () => {
  const {hompyId} = useParams();
  const {userInfo, hompyInfo, setHompyInfo} = useContext(LoginContext);
  const [skinItems, setSkinItems] = useState([]);
  const [selectedSkin, setSelectedSkin] = useState(hompyInfo.miniHompySkin);

  useEffect(()=>{
    let type = "스킨";
    let skins = [{
      itemName: "기본",
      fileName: "background.png",
      itemType: "스킨"
    }];
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
        setSkinItems(skins);
    }
    userItemLits();
  },[]);

  const handleSkinSelect = (item) => {
    setSelectedSkin(item);
  }

  const handleSaveSkin = async () => {
    let hompy = hompyInfo;
    hompy.miniHompySkin = selectedSkin;

    const response = await api.post(`${SERVER_HOST}/hompy/${hompyId}`, hompy, {
      headers: {
        'Authorization':'Bearer ' +Cookies.get('accessToken')
      }
    })

    const {data , status} = response;

    if(status === 200) {

      setHompyInfo(data)
    }
  };

  return (
  <>
    <div className="hompySkin-container">
    {skinItems.map((item, index) => (
      <div key={index} className="skin-item">
        <input
          type="radio"
          name="skin"
          id={`skin-${index}`}
          checked={selectedSkin === item.fileName}
          onChange={() => handleSkinSelect(item.fileName)}
        />
          <img
            className="hompyskin-setting-img"
            src={`${process.env.PUBLIC_URL}/image/${item.fileName}`}
            alt={item.itemName}
          />
          <span className="hompyskin-name">{item.itemName}</span>
      </div>
    ))}
  </div>

    <div className='hompyskin-btn-container'>
      <button className="hompyskin-save-btn" onClick={handleSaveSkin}>저장</button>
    </div> 
</>  
  );
};

export default HompySkin;