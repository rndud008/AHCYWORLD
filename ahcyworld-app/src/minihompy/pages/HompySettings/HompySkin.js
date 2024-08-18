import React, { useContext, useEffect, useState } from 'react';
import '../css/HompySkin.css';
import axios from 'axios';
import { SERVER_HOST } from '../../../apis/api';
import { LoginContext } from '../../../webpage/components/login/context/LoginContextProvider';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';


const HompySkin = () => {
  const {hompyId} = useParams();
  const {userInfo} = useContext(LoginContext);
  const [skinItems, setSkinItems] = useState([]);
  const [selectedSkin, setSelectedSkin] = useState(null);

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
  },[userInfo.id]);

  const handleSkinSelect = (item) => {
    setSelectedSkin(item);
  }

  const handleSaveSkin = async () => {
    if (selectedSkin) {
      try {
        const response = await axios.post(`${SERVER_HOST}/hompy/${hompyId}/hompyskin`, null, {
          params: {
            skinName: selectedSkin.fileName
          }
        });
        if (response.status === 200) {
          Swal.fire({
            title: '성공!',
            text: '스킨이 성공적으로 저장되었습니다!',
            icon: 'success',
            confirmButtonText: '확인'
          });

          setSelectedSkin({ skinName: response.data.miniHompySkin });
        }
      } catch (error) {
        console.error("Error saving skin:", error);
        Swal.fire({
          title: '실패!',
          text: '스킨 저장에 실패했습니다. 다시 시도해주세요.',
          icon: 'error',
          confirmButtonText: '확인'
        });
      }
    } else {
      Swal.fire({
        title: '알림',
        text: '저장할 스킨을 선택하세요.',
        icon: 'warning',
        confirmButtonText: '확인'
      });
    }
  }

  return (
  <>
    <div className="hompySkin-container">
    {skinItems.map((item, index) => (
      <div key={index} className="skin-item">
        <input
          type="radio"
          name="skin"
          id={`skin-${index}`}
          checked={selectedSkin === item}
          onChange={() => handleSkinSelect(item)}
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