import React, { useEffect, useState } from "react";
import "./css/Right.css";
import axios from "axios";

const Right = ({ user }) => {
  const [minimi, setMinimi] = useState();
  const [miniRoom, setMiniRoom] = useState();

  const userId = user?.id;

  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:8070/hompy/${userId}`)
        .then((response) => {
          const hompyData = response.data;

          // 서버에서 받아온 이미지 파일 이름을 리액트 퍼블릭 폴더의 경로와 결합
          const userGender = hompyData.user && hompyData.user.gender ? hompyData.user.gender : "unknown";

          const minimiImagePath = hompyData.minimiPicture
            ? `http://localhost:8070${hompyData.minimiPicture}`
            : userGender === "MALE"
            ? `${process.env.PUBLIC_URL}/image/male.png`
            : `${process.env.PUBLIC_URL}/image/female.png`;

          const miniRoomImagePath = hompyData.miniRoom
            ? `http://localhost:8070${hompyData.miniRoom}`
            : `${process.env.PUBLIC_URL}/image/miniroom.png`;


          setMinimi(minimiImagePath);
          setMiniRoom(miniRoomImagePath);
        })
        .catch((error) => {
          console.error("데이터를 불러오지 못했습니다. 관리자에게 문의하세요.", error);
        });
    }
  }, [userId]);

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
        <div className="input-container">
          <input
            className="text-box"
            type="text"
            placeholder="일촌평 작성.."
          />
          <button className="submit-btn">등록</button>
        </div>
      </div>
    </div>
  );
};

export default Right;
