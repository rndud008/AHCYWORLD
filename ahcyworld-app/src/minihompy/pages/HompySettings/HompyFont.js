import React, { useContext, useEffect, useState } from 'react';
import '../css/HompyFont.css';
import { LoginContext } from '../../../webpage/components/login/context/LoginContextProvider';
import axios from 'axios';
import api, { SERVER_HOST } from '../../../apis/api';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie'

const HompyFont = () => {
  const {hompyId} = useParams();
  const {userInfo, hompyInfo, setHompyInfo} = useContext(LoginContext);
  const [fontItems, setFontItems] = useState([]);

  console.log("font", fontItems);
  console.log("hompyupyp", hompyInfo);

  useEffect(()=>{
    let type = "글꼴";
    let fonts = [{
      itemName: "기본",
      sourceName: "Arial",
      itemType: "글꼴"
    }];
    const userItemLits = async () => {
      const response = await axios({
        method:'GET',
        url:`${SERVER_HOST}/cart/${userInfo.id}/items`
      })
        response.data.forEach(cart => {
          if(cart.item.itemType === type){
            fonts.push(cart.item);
          }
        });
        console.log(fonts);
        setFontItems(fonts);
    }
    userItemLits();
  },[])

  const handleFontSave = async (fontName) => {
    let hompy = hompyInfo;
    hompy.miniHompyFont = fontName;

    const response = await api.post(`${SERVER_HOST}/hompy/${hompyId}`, hompy, {
      headers: {
        'Authorization':'Bearer ' +Cookies.get('accessToken')
      }
    })

    const {data , status} = response;
    console.log("sta", status);
    if(status === 200) {
      console.log("data", data);
      setHompyInfo(data)
    }
  }


  return (
    <>
    <div className='hompyFont-container'>
      <h1>글꼴 설정</h1>
      {fontItems && fontItems.map((font) => (
              <div>
                <input
                  className="fontStyle"
                  type="text"
                  style={{
                    fontFamily: `${font.sourceName}, cursive`,
                    textAlign: "center",
                  }}
                  value="AhCyWorld"
                  readOnly
                />
            <button onClick={() => handleFontSave(font.sourceName)}>저장</button>
              </div>
            ))}
    </div>
    </>
  );
};

export default HompyFont;