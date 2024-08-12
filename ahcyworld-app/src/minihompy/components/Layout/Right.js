import React, { useEffect, useState } from "react";
import "./css/Right.css";
import axios from "axios";
import { useParams } from "react-router-dom";

const Right = ({ user }) => {
  const {hompyId} = useParams();
  const [minimi, setMinimi] = useState();
  const [miniRoom, setMiniRoom] = useState();
  const [comment, setComment] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [canWriteComment, setCanWriteComment] = useState(false);

  const userId = user?.id;

  useEffect(() => {
    if (hompyId) {
      axios
        .get(`http://localhost:8070/hompy/${hompyId}`)
        .then((response) => {
          const hompyData = response.data;

          console.log("미니홈피 소유자 ID:", hompyData.user.id);
          console.log("현재 로그인된 사용자 ID:", user.id);

          // 미니홈피 소유자 ID와 현재 로그인된 사용자 ID 비교
          if (hompyData.user.id === user.id) {
            setCanWriteComment(false);
            console.log("자신의 미니홈피입니다.");
          } else {
            axios
              .get(`http://localhost:8070/cyworld/cy/guestbook/friends/check/${hompyId}`, {
                params: { username: user.username },
              })
              .then((response) => {
                console.log('일촌 관계 확인 결과:', response.data.isFriend);
                setCanWriteComment(response.data.isFriend);
              })
              .catch((error) => {
                console.error("일촌 관계 확인 실패:", error);
              });
          }

          // 서버에서 받아온 이미지 파일 이름을 리액트 퍼블릭 폴더의 경로와 결합
          const userGender = hompyData.user && hompyData.user.gender ? hompyData.user.gender : "unknown";
          const minimiImagePath = 
              userGender === "MALE"
            ? `${process.env.PUBLIC_URL}/image/${hompyData.minimiPicture}`
            : `${process.env.PUBLIC_URL}/image/${hompyData.minimiPicture}`;
          const miniRoomImagePath = `${process.env.PUBLIC_URL}/image/${hompyData.miniRoom}`;

          setMinimi(minimiImagePath);
          setMiniRoom(miniRoomImagePath);
        })
        .catch((error) => {
          console.error("데이터를 불러오지 못했습니다. 관리자에게 문의하세요.", error);
        });
    }
  }, [hompyId, user]);

  // 일촌평
  const handleCommentChange = (event) => {
    setComment(event.target.value);
    setErrorMessage(""); // 입력이 변경될 때 에러 메시지를 초기화
  }

  const handleCommentSubmit = () => {
    if (comment.trim() === "") {
      setErrorMessage("일촌평 내용을 입력해주세요.");
      return;
    }

    // 일촌평 저장
    axios
    .post(`http://localhost:8070/cyworld/cy/guestbook/saveIlchonpyung`, {
      user: { id: userId },
      hompy: { id: hompyId },
      content: comment,
    })
    .then((response) => {
      console.log("일촌평 작성 성공!", response.data);
      setComment(""); // 일촌평 작성 후 입력 필드 초기화
      setErrorMessage("");
    })
    .catch((error) => {
      console.log("일촌평 작성 실패..", error);
      if (error.response && error.response.data) {
        console.error("서버 응답:", error.response.data);
      }
      setErrorMessage("일촌 관계가 아닙니다. 일촌평을 작성할 수 없습니다.");
    });
  }

  return (
    <div className="right-container">
      <div className="content-section">
        {/* 업데이트 뉴스 */}
        <div className="news-section">
          <p className="head-p">Updated news</p>
          <hr className="divider" />
          <ul className="news-list">
            <li>
              <span>[스크랩]</span> 단체 사진-
            </li>
            <li>
              <span>[스크랩]</span> 하늘공원 갔었습니다^^
            </li>
            <li>
              <span>[스크랩]</span> 하늘공원
            </li>
            <li>
              <span>[스크랩]</span> 하늘공원
            </li>
            <li>
              <span>[스크랩]</span> 하늘공원
            </li>
          </ul>
        </div>

        {/* 업데이트 목록 게시판 테이블 */}
        <div className="info-table">
          <table>
            <tbody>
              <tr>
                <td>
                  다이어리{" "}
                  <span className="count">
                    0/0 <span className="new-icon">N</span>
                  </span>
                </td>
                <td>
                  사진첩{" "}
                  <span className="count">
                    0/0 <span className="new-icon">N</span>
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  게시판{" "}
                  <span className="count">
                    0/0 <span className="new-icon">N</span>
                  </span>
                </td>
                <td>
                  방명록{" "}
                  <span className="count">
                    0/0 <span className="new-icon">N</span>
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  동영상{" "}
                  <span className="count">
                    0/0 <span className="new-icon">N</span>
                  </span>
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 미니룸 */}
      <div className="miniroom-section">
        <span className="miniroom-tabs">Mini Room</span>
        <div className="miniroom">
          <img
            src={miniRoom}
            alt="Miniroom Background"
            className="miniroom-bg-image"
          />
          <img
            src={minimi}
            alt="Character"
            className="miniroom-character"
          />
        </div>
      </div>

      {/* 일촌평 */}
       <div className="friend-msg">
        <span className="friends-msg">일촌평</span>
        {canWriteComment && (
          <div className="input-container">
            <input
              className="text-box"
              type="text"
              placeholder="일촌평 작성.."
              value={comment}
              onChange={handleCommentChange}
            />
            <button type="submit" className="friend-board-btn" onClick={handleCommentSubmit}>
              등록
            </button>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </div>
        )}
        {!canWriteComment && (
          ""
        )}
      </div>
    </div>
  );
};

export default Right;
