import React from "react";
import './Left.css';
import { TbMars } from "react-icons/tb";


const Left = () => {
  return (
    <>
    <div className="left-container">
      <img className="profile-img" src="/image/pro.png" alt="유저 이미지"/>
    
      <button className="imgedit-btn"><span className="arrow">&#9654;</span>&nbsp; EDIT</button>

      <div className="profile-msg">
      <textarea rows="10" cols="33" placeholder="여기에 텍스트를 입력하세요"></textarea>
    
      
      <button className="textedit-btn"><span className="arrow">&#9654;</span>&nbsp; EDIT</button>
      <hr />

        <div className="user-info">
          <span className="name">김세진<TbMars size="20" color="blue"/></span>
          <span className="birth">1997-12-26</span>
        </div>
        
        <button className="friend-btn">일촌신청확인</button>
        <select className="select">
          <option value={"option1"}>⭐️ 일촌 파도타기</option>
        </select>
      </div>
    </div>
    </>
  );
};

export default Left;
