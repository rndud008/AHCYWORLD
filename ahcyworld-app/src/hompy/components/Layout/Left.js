import React, { useState } from "react";
import './Left.css';
import { PiGenderFemaleFill, PiGenderMaleFill } from "react-icons/pi";
import axios from "axios";

const Left = ({ user, hompy }) => {
  const [statusMessage, setStatusMessage] = useState(hompy?.statusMessage || "");
  const [textEdit, setTextEdit] = useState(false);
  const [profilePicture, setProfilePicture] = useState(`${process.env.PUBLIC_URL}/image/default_img.png`);
  const [selectedFile, setSelectedFile] = useState(null);

  const userId = user?.id;

  const textEditClick = () => {
    if (textEdit && userId) {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('file', selectedFile);
      }
      formData.append('statusMessage', statusMessage);

      axios.post(`http://localhost:8070/hompy/${userId}/profile`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => {
        console.log("업로드 성공:", response.data);
        setProfilePicture(response.data.profilePicture);
        setStatusMessage(response.data.statusMessage);
      })
      .catch(error => {
        if (error.response) {
          console.error("업로드 에러 응답 데이터:", error.response.data);
          console.error("업로드 에러 상태 코드:", error.response.status);
          console.error("업로드 에러 헤더:", error.response.headers);
        } else if (error.request) {
          console.error("요청이 전송되었으나 응답을 받지 못했습니다:", error.request);
        } else {
          console.error("에러 설정 중 발생:", error.message);
        }
        console.error("전체 에러 설정:", error.config);
      });
    }
    setTextEdit(!textEdit);
  };

  const textChange = (event) => {
    setStatusMessage(event.target.value);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="left-container">
      <img className="profile-img" src={profilePicture} alt="유저 이미지"/>
      <input 
        type="file" 
        id="fileInput" 
        style={{ display: 'none' }} 
        onChange={handleFileChange} 
      />
      <button className="imgedit-btn" onClick={() => document.getElementById('fileInput').click()}><span className="arrow">&#9654;</span>&nbsp; EDIT</button>

      <div className="profile-msg">
        <textarea 
          rows="10" 
          cols="33" 
          placeholder="자기소개가 없습니다."
          value={statusMessage}
          readOnly={!textEdit}
          onChange={textChange}
        /> 
        <button className="textedit-btn" onClick={textEditClick}>
          <span className="arrow">&#9654;</span>&nbsp; {textEdit ? 'OK' : 'EDIT'}
        </button>
        <hr />

        <div className="user-info">
          <span className="name">
            {user.name}
            {user.gender === "MALE" ? (<PiGenderMaleFill className="gender" />)
            : (<PiGenderFemaleFill className="gender" />)}
          </span>
          <span className="birth">{user.birthDay}</span>
        </div>
        
        <button className="friend-btn">일촌신청확인</button>
        <select className="select">
          <option value={"option1"}>⭐️ 일촌 파도타기</option>
        </select>
      </div>
    </div>
  );
};

export default Left;
