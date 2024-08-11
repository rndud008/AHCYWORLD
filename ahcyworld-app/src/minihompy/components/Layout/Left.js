import React, { useEffect, useState } from "react";
import "./css/Left.css";
import { PiGenderFemaleFill, PiGenderMaleFill } from "react-icons/pi";
import axios from "axios";
import { useParams } from "react-router-dom";

const Left = ({ user, hompy }) => {
  const {hompyId} = useParams();
  const [statusMessage, setStatusMessage] = useState(hompy?.statusMessage || "");
  const [textEdit, setTextEdit] = useState(false);
  const [profilePicture, setProfilePicture] = useState();
  const [profileEdit, setProfileEdit] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const userId = user?.id;


  // 서버로 부터 최신정보 받아오기
  // 수정해야함
  useEffect(() => {
    if (hompyId) {
      axios.get(`http://localhost:8070/hompy/${hompyId}`)
        .then(response => {
          const hompyData = response.data;
          setStatusMessage(hompyData.statusMessage || "");
          if (hompyData.profilePicture) {
            const imageUrl = `http://localhost:8070/hompy/profileImg/${hompyData.profilePicture.split("/").pop()}`;
            setProfilePicture(imageUrl);
          }
        })
        .catch(error => {
          console.error("데이터 불러오기 실패", error);
        });
    }
  }, [hompyId]);

  // 홈피에 대한 것을 가져와야함


  // 상태 메시지
  const updateStatusMessage = () => {
    if (userId) {
      axios
        .post(
          `http://localhost:8070/hompy/${hompyId}/statusMessage`,
          { statusMessage },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          console.log("상태 메시지 업데이트 성공", response.data);
          setTextEdit(false);
        })
        .catch((error) => {
          console.error("상태 메시지 업데이트 실패", error);
        });
    }
  };

  const updateProfileImg = () => {
    if (userId && selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      axios
        .post(`http://localhost:8070/hompy/${hompyId}/profileImg`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log("프로필 사진 업로드 성공", response.data);
          const imageUrl = `http://localhost:8070/hompy/profileImg/${response.data.profilePicture.split("/").pop()}`;
          setProfilePicture(imageUrl);
          setProfileEdit(false);
        })
        .catch((error) => {
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

  return (
    <div className="left-container">
      <img
        className="profile-img"
        src={profilePicture || "default_profileImg.png"}
        alt="유저 이미지"
      />
      <input
        type="file"
        id="fileInput"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <button
        className="imgedit-btn"
        onClick={() => {
          if (profileEdit) {
            updateProfileImg();
          } else {
            document.getElementById("fileInput").click();
          }
          setProfileEdit(!profileEdit);
        }}
      >
        <span className="arrow">&#9654;</span>&nbsp; {profileEdit ? "OK" : "EDIT"}
      </button>

      <div className="profile-msg">
        <textarea
          className="no-resize"
          rows="8"
          cols="33"
          placeholder="자기소개가 없습니다."
          value={statusMessage}
          readOnly={!textEdit}
          onChange={textChange}
        />
        <button
          className="textedit-btn"
          onClick={() => {
            if (textEdit) {
              updateStatusMessage();
            }
            setTextEdit(!textEdit);
          }}
        >
          <span className="arrow">&#9654;</span>&nbsp; {textEdit ? "OK" : "EDIT"}
        </button>
        <hr />

        {user ? (
          <div className="user-info">
            <span className="name">
              {user.name}
              {user.gender === "MALE" ? (
                <PiGenderMaleFill className="gender" />
              ) : (
                <PiGenderFemaleFill className="gender" />
              )}
            </span>
            <span className="birth">{user.birthDay}</span>
          </div>
        ) : (
          <p>Loading...</p>
        )}

        <button className="friend-btn">일촌신청확인</button>
        <select className="select">
          <option value={"option1"}>⭐️ 일촌 파도타기</option>
        </select>
      </div>
    </div>
  );
};

export default Left;
