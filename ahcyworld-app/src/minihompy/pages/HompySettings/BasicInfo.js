import React from 'react';
import '../css/BasicInfo.css';

const BasicInfo = ({user}) => {
  return (
    <>
      <div className='BasicInfo-container'>
        <div className='basicinfo'>
          <h3><label>아이디</label></h3>
          <input type='text' value={user.username} readOnly/>
        </div>
        <div className='basicinfo'>
          <h3><label>이메일</label></h3>
          <input type='text' value={user.email} readOnly/>
        </div>
        <div className='basicinfo'>
          <h3><label>이름</label></h3>
          <input type='text' value={user.name} readOnly/>
        </div>
        <div className='basicinfo'>
          <h3><label>생년월일</label></h3>
          <input type='text' value={user.birthDay} readOnly/>
        </div>
        <div className='basicinfo'>
          <h3><label>성별</label></h3>
          <input type='text' value={user.gender} readOnly/>
        </div>
        <div className='basicinfo'>
          <h3><label>보유 도토리</label></h3>
          <input type='text' value={user.acorn} readOnly/>
        </div>
      </div>
    </>
      
  );
};

export default BasicInfo;