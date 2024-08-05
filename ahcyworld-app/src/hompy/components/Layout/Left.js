import React, { useEffect, useState } from "react";
import './Left.css';
import { PiGenderFemaleFill, PiGenderMaleFill } from "react-icons/pi";
import axios from "axios";

const Left = ({ user, hompy }) => {
  // user가 undefined인 경우 기본값으로 빈 객체를 설정합니다.
  const [statusMessage, setStatusMessage] = useState(user?.statusMessage || "");
  const [textEdit, setTextEdit] = useState(false);
  const [profilePicture, setProfilePicture] = useState(hompy?.profilePicture || "/image/default_img.png");
  const [selectedFile, setSelectedFile] = useState(null); // 선택된 파일 상태

  const userId = user?.id; // userId 가져오기

  const textEditClick = () => {
    if (textEdit) {
      // 파일 업로드와 상태 메시지 업데이트를 동시에 처리
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
        // 서버에서 반환된 업데이트된 데이터를 사용해 상태를 업데이트
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
      // 파일을 읽어서 이미지 미리보기를 제공
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    if (!userId) {
      console.error("Error: userId is undefined. Check if hompy object contains valid user data.");
      return;
    }
  
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
  
      axios.post(`http://localhost:8070/hompy/${userId}/profile-picture`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => {
        console.log("프로필 사진 업로드 성공:", response.data);
        setProfilePicture(response.data.profilePicture);
      })
      .catch(error => {
        console.error("프로필 사진 업로드 에러:", error);
      });
    }
  
    axios.post(`http://localhost:8070/hompy/${userId}/status-message`, { statusMessage }, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      console.log("상태 메시지 업데이트 성공:", response.data);
      setStatusMessage(response.data.statusMessage);
    })
    .catch(error => {
      console.error("상태 메시지 업데이트 에러:", error);
    });
  };
  

  // user가 정의되지 않은 경우 로딩 메시지 표시
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
