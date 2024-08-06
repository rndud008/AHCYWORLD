import React, { useEffect, useState } from "react";
import './Left.css';
import { PiGenderFemaleFill, PiGenderMaleFill } from "react-icons/pi";
import axios from "axios";

const Left = ({ user, hompy }) => {
  const [statusMessage, setStatusMessage] = useState(hompy?.statusMessage || "");
  const [textEdit, setTextEdit] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [profileEdit, setProfileEdit] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const userId = user?.id;

  // 상태 메시지
  const updateStatusMessage = () => {
    console.log("Updating status message with:", statusMessage);
    if (userId) {
      axios.post(`http://localhost:8070/hompy/${userId}/statusMessage`, {statusMessage}, {
        headers: {
          'Content-Type':'application/json'
        },
      })
      .then(response => {
        console.log("상태 메시지 업데이트 성공", response.data);
        setStatusMessage(response.data.statusMessage);
        setTextEdit(false);
      })
      .catch (error => {
        console.error("상태 메시지 업데이트 실패", error);
      });
    }
  };

// 프로필 사진 업데이트 함수
const updateProfileImg = () => {
  if (userId && selectedFile) {
    const formData = new FormData();
    formData.append('file', selectedFile);

    axios.post(`http://localhost:8070/hompy/${userId}/profileImg`, formData, {
      headers: {
        'Content-Type':'multipart/form-data',
      },
    })
    .then(response => {
      console.log("프로필 사진 업로드 성공", response.data);
      setProfilePicture(response.data.profilePicture);
      setProfileEdit(false);
    })
    .catch(error => {
      console.error("프로필 사진 업로드 실패", error);
    });
  }
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
    return <div>Loading user data...</div>
  }

  return (
    <div className="left-container">
      <img className="profile-img" src={profilePicture}  alt="유저 이미지"/>
      <input 
        type="file" 
        id="fileInput" 
        style={{ display: 'none' }} 
        onChange={handleFileChange} 
      />
      <button className="imgedit-btn"
        onClick={() => {
          if (profileEdit) {
            updateProfileImg();
          } else {
            document.getElementById('fileInput').click();
          }
          setProfileEdit(!profileEdit);
        }}
      >
        <span className="arrow">&#9654;</span>&nbsp; {profileEdit ? 'OK' : 'EDIT'}
      </button>

      <div className="profile-msg">
        <textarea 
          rows="10" 
          cols="33" 
          placeholder="자기소개가 없습니다."
          value={statusMessage}
          readOnly={!textEdit}
          onChange={textChange}
        /> 
      <button className="textedit-btn" onClick={() => {
        if (textEdit) {
          updateStatusMessage();
        } 
        setTextEdit(!textEdit);
      }}>
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
