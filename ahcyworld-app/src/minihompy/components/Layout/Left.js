import React, { useContext, useEffect, useState } from "react";
import "./css/Left.css";
import { PiGenderFemaleFill, PiGenderMaleFill } from "react-icons/pi";
import axios from "axios";
import { useParams } from "react-router-dom";
import FriendRequestModal from "../friendShip/FriendRequestModal";
import { hompyInfo, userInfo } from "../../../apis/auth";
import { LoginContext } from "../../../webpage/components/login/context/LoginContextProvider";

const Left = ({ user, hompy }) => {
  const { hompyId } = useParams();
  const [statusMessage, setStatusMessage] = useState(
    hompy?.statusMessage || ""
  );
  const [textEdit, setTextEdit] = useState(false);
  const [profilePicture, setProfilePicture] = useState();
  const [profileEdit, setProfileEdit] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState("option1");

  const { hompyInfo,userInfo } = useContext(LoginContext);

  const friendIdList = friends.map((item) => {
    return item.friendUser.id;
  });

  console.log("check", friendIdList);

  const userId = user?.id;

  // 미니홈피 일촌신청 확인 모달
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // 서버로 부터 최신정보 받아오기
  useEffect(() => {
    if (hompyId) {
      axios
        .get(`http://localhost:8070/hompy/${hompyId}`)
        .then((response) => {
          const hompyData = response.data;
          setStatusMessage(hompyData.statusMessage || "");
          if (hompyData.profilePicture) {
            const profilePicturePath = hompyData.profilePicture.replaceAll(
              /\\/g,
              "//"
            );
            const imageUrl = `http://localhost:8070/hompy/profileImg/${profilePicturePath
              .split("/")
              .pop()}`;
            setProfilePicture(imageUrl);
          }
        })
        .catch((error) => {
          console.error("데이터 불러오기 실패", error);
        });
    }
  }, [hompyId]);

  // 일촌 신청 목록 불러오기
  useEffect(() => {
    const fetchFriendList = async () => {
      if (user?.username) {
        // user 객체가 존재하고, 그 안에 username이 있을 경우 실행
        try {
          const response = await axios.get(
            `http://localhost:8070/friend/myfriends`,
            {
              params: { username: user.username },
            }
          );

          // 서버로부터 친구 목록 데이터를 가져옴
          // response.data에 친구 목록이 포함되어 있음
          const friendsWithHompyId = await Promise.all(
            response.data.map(async (friend) => {
              try {
                // 각 친구의 userId(friend.friendUser.id)를 사용하여 해당 유저의 hompyId를 조회
                const hompyResponse = await axios.get(
                  `http://localhost:8070/hompy/user/${friend.friendUser.id}`
                );

                // hompyId를 친구 데이터에 추가하여 반환
                return { ...friend, hompyId: hompyResponse.data };
              } catch (hompyError) {
                console.error(
                  `Failed to fetch hompyId for user ${friend.friendUser.id}:`,
                  hompyError
                );

                // hompyId를 가져오지 못한 경우 null로 설정
                return { ...friend, hompyId: null };
              }
            })
          );

          // 모든 친구의 hompyId를 포함한 데이터를 상태로 설정
          setFriends(friendsWithHompyId);
        } catch (error) {
          console.error("친구 목록 불러오기 실패", error);
        }
      }
    };

    fetchFriendList();
  }, [user?.username]);

  // 일촌 신청 목록 업데이트 처리
  const handleFriendRequestUpdate = (updateRequests) => {
    setFriendRequests(updateRequests);
  };

  // 일촌 파도타기 클릭시 해당 일촌의 미니홈피로 이동
  const handleFriendSelect = (event) => {
    const selectedHompyId = event.target.value;
    if (selectedHompyId !== "option1") {
      const miniHompyUrl = `http://localhost:3000/hompy/${encodeURIComponent(
        selectedHompyId
      )}`;

      // 새 창 열기 설정
      window.open(
        miniHompyUrl, // 열고 싶은 URL
        "_blank", // 새로운 창을 엽니다.
        "width=800,height=600,menubar=no,toolbar=no,scrollbars=no,resizable=no" // 창의 크기 설정
      );

      // 일촌 선택 후 기본값으로 되돌리기
      setSelectedFriend("option1");
    }
  };

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
          const profilePicturePath = response.data.profilePicture.replaceAll(
            /\\/g,
            "//"
          );
          const imageUrl = `http://localhost:8070/hompy/profileImg/${profilePicturePath
            .split("/")
            .pop()}`;

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

  console.log(profilePicture);

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
      {hompyInfo.id === parseInt(hompyId) && (
        <>
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
            <span className="arrow">&#9654;</span>&nbsp;{" "}
            {profileEdit ? "OK" : "EDIT"}
          </button>
        </>
      )}

      <div className="profile-msg">
        <textarea
          className="no-resize"
          rows="7"
          cols="33"
          placeholder="자기소개가 없습니다."
          value={statusMessage}
          readOnly={!textEdit}
          onChange={textChange}
        />
        {hompyInfo.id === parseInt(hompyId) && (
          <>
            <button
              className="textedit-btn"
              onClick={() => {
                if (textEdit) {
                  updateStatusMessage();
                }
                setTextEdit(!textEdit);
              }}
            >
              <span className="arrow">&#9654;</span>&nbsp;{" "}
              {textEdit ? "OK" : "EDIT"}
            </button>
          </>
        )}
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
        {hompyInfo.id === parseInt(hompyId) && (
          <>
            <button className="friend-btn" onClick={handleOpenModal}>
              일촌신청확인
            </button>
            <FriendRequestModal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              onRequestUpdate={handleFriendRequestUpdate}
            />
          </>
        )}

        {/* 일촌 목록을 select 요소에 표시 */}
        {(hompyInfo.id === parseInt(hompyId) ||
          friendIdList.some((item) => item === userInfo.id)) && (
          <>
            <select
              className="select"
              value={selectedFriend}
              onChange={handleFriendSelect}
            >
              <option value={"option1"}>⭐️ 일촌 파도타기</option>
              {friends.length > 0 ? (
                friends.map((friend) => (
                  <option key={friend.id} value={friend.hompyId}>
                    {friend.friendUser.name} ({friend.friendName})
                  </option>
                ))
              ) : (
                <option disabled>일촌 목록이 없습니다.</option>
              )}
            </select>
          </>
        )}
      </div>
    </div>
  );
};

export default Left;
