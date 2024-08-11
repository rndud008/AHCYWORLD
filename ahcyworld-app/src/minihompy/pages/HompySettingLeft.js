import React, { useState } from 'react';
import "./css/HompySettingLeft.css";
import { FiMenu, FiSettings,FiCornerDownRight } from "react-icons/fi";

const HompySettingLeft = ({setActiveMenu}) => {

  const [selectedMenu, setSelectedMenu] = useState("basicInfo");

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
    setActiveMenu(menu);
  };


  return (
    <div className='settingLeft_container'>
      <div className='setting-title'>
        <div className='setting-icon'>
          <FiSettings className='fisetting'/> 
          <h2 className='setting-h2'>SETTING</h2>
        </div>
      </div>

      {/* 기본메뉴설정 */}
      <div className='setting-menu'>
        <div className='setmenu-title'>

          <div className='setmenu-icon'>
            <FiMenu /> 
            <h4 className='setmenu-h4'>메뉴관리</h4>
          </div>

          <div className='selectsetmenu' onClick={() => setActiveMenu("basicInfo")}>
              <FiCornerDownRight />
              <h5 className='select-h5'>기본정보</h5>          
          </div>
          <div className='selectsetmenu' onClick={() => setActiveMenu("menu")}>
              <FiCornerDownRight />
              <h5 className='select-h5'>메뉴</h5>          
          </div>
          <div className='selectsetmenu' onClick={() => setActiveMenu("friendShip")}>
              <FiCornerDownRight />
              <h5 className='select-h5'>일촌관리</h5>          
          </div>

          <div className='setmenu-icon'>
            <FiMenu /> 
            <h4 className='setmenu-h4'>아이템 설정관리</h4>
          </div>

          <div className='selectsetmenu' onClick={() => setActiveMenu("hompySkin")}>
              <FiCornerDownRight />
              <h5 className='select-h5'>미니홈피 스킨</h5>          
          </div>
          <div className='selectsetmenu' onClick={() => setActiveMenu("hompyFont")}>
              <FiCornerDownRight />
              <h5 className='select-h5'>글꼴 설정</h5>          
          </div>
          <div className='selectsetmenu' onClick={() => setActiveMenu("miniRoom")}>
              <FiCornerDownRight />
              <h5 className='select-h5'>미니룸 설정</h5>          
          </div>
          <div className='selectsetmenu' onClick={() => setActiveMenu("minimi")}>
              <FiCornerDownRight />
              <h5 className='select-h5'>미니미 설정</h5>          
          </div>
          <div className='selectsetmenu' onClick={() => setActiveMenu("hompyMusic")}>
              <FiCornerDownRight />
              <h5 className='select-h5'>음악 설정</h5>          
          </div>

        </div>
      </div>
    </div>
  );
};

export default HompySettingLeft;