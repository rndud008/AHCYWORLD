import React, { useEffect, useState } from 'react';
import '../css/MenuSetting.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { BlockPicker, ChromePicker, CirclePicker, SketchPicker, SwatchesPicker } from 'react-color';
import {HompyAction} from "../../../redux/actions/HompyAction"
import { useDispatch, useSelector } from "react-redux";


const MenuSetting = () => {
  const {hompyId} = useParams();
  const [menuColor, setMenuColor] = useState("#147DAF");
  const [textColor, setTextColor] = useState("#fff");
  const [borderColor, setBorderColor] = useState("#000000");
  const [menuStatus, setMenuStatus] = useState({
    photo: "visible",
    board: "visible",
    video: "visible",
    guestbook: "visible",
  });

  const menuLabels = {
    photo: "사진첩",
    board: "게시판",
    video: "동영상",
    guestbook: "방명록",
  };

  const dispatch = useDispatch();

  // 메뉴색상 바꾸기
  useEffect(() => {
    // 메뉴의 기존 설정
    axios.get(`http://localhost:8070/hompy/${hompyId}/menu-settings`)
    .then(response => {
      // 백엔드에서 가져온 값이 없을 경우 기본값 유지
      setMenuColor(response.data.menuColor || "#147DAF");
      setTextColor(response.data.menuText || "#fff");
      setBorderColor(response.data.menuBorder || "#000000");

      if (response.data.menuStatus) {
        const statusArray = response.data.menuStatus.split(',');
        const statusObject = {
          photo: statusArray[0] || "visible",
          board: statusArray[1] || "visible",
          video: statusArray[2] || "visible",
          guestbook: statusArray[3] || "visible",
        };
        setMenuStatus(statusObject);
      }
    })
      .catch(error => {
        console.error("메뉴 설정 불러오기 에러: ", error);
      });
  }, [hompyId]);

  const handleSaveSettings = () => {
    // menuStatus 객체를 문자열로 변환
    const statusString = Object.values(menuStatus)
    .filter(value => value !== undefined && value !== '').join(',');

    const settings = {
      menuColor: menuColor,
      menuText: textColor,
      menuBorder: borderColor,
      menuStatus: statusString, 
    };
    axios.post(`http://localhost:8070/hompy/${hompyId}/menu-settings`, settings)
      .then(response => {
        Swal.fire({
          title: '저장완료!',
          text: '설정이 성공적으로 저장되었습니다!',
          icon: 'success',
          confirmButtonText: '확인'
        });
        setMenuColor(settings.menuColor);
        setTextColor(settings.menuText);
        setBorderColor(settings.menuBorder);
        setMenuStatus({
          photo: statusString.split(',')[0],
          board: statusString.split(',')[1],
          video: statusString.split(',')[2],
          guestbook: statusString.split(',')[3],
        });
        
        dispatch(HompyAction.findByHompyIdAxios(hompyId));
      })
      .catch(error => {
        console.error("설정 저장 오류: ", error);
        Swal.fire({
          title: '저장실패!',
          text: '설정 저장 중 오류가 발생했습니다!',
          icon: 'error',
          confirmButtonText: '확인'
        });
      });
  };

  const toggleStatus = (menu) => {
    setMenuStatus(prevState => ({
      ...prevState,
      [menu]: prevState[menu] === "visible" ? "invisible" : "visible"
    }));
  };

  
  return (
    <div className='MenuSetting-container'>
      <div className='menu-visibility'>
        {Object.keys(menuLabels).map(menu => (
          <div key={menu} className='menusetting-item'>
            <button className='menusetting-button' style={{ backgroundColor: menuColor, color: textColor, borderColor: borderColor }}>
              {menuLabels[menu]}
            </button>
            <div className='visibility-options'>
              <label>
                <input 
                  type="radio" 
                  name={menu} 
                  value="visible" 
                  checked={menuStatus[menu] === "visible"} 
                  onChange={() => toggleStatus(menu)} 
                />
                &nbsp; 공개
              </label>
              <label>
                <input 
                  type="radio" 
                  name={menu} 
                  value="invisible" 
                  checked={menuStatus[menu] === "invisible"} 
                  onChange={() => toggleStatus(menu)} 
                />
                &nbsp; 비공개
              </label>
            </div>
          </div>
        ))}
      </div>

      <div className='menu-color'>
        <div className='color-picker'>
          <h4>바탕 색상</h4>
          <SketchPicker
            color={menuColor}
            onChangeComplete={(color) => setMenuColor(color.hex)}
          />
        </div>
        <div className='color-picker'>
          <h4>글씨 색상</h4>
          <SketchPicker 
            color={textColor}
            onChangeComplete={(color) => setTextColor(color.hex)}
          />
        </div>  
        <div className='color-picker'>
          <h4>테두리 색상</h4>
          <SketchPicker 
            color={borderColor}
            onChangeComplete={(color) => setBorderColor(color.hex)}
          />
        </div>  
      </div>

      <button className='menusave-button' onClick={handleSaveSettings}>
        저장
      </button>
    </div>
  );
};

export default MenuSetting;