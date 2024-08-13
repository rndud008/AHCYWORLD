import React, { useEffect, useState } from "react";
import "./css/Right.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../apis/api";
import { boardNameCheck } from "../post/utils/postUtils";
import Cookies from "js-cookie";

const Right = ({ user }) => {
  const { hompyId } = useParams();
  const [minimi, setMinimi] = useState();
  const [miniRoom, setMiniRoom] = useState();
  const [recentlyPost, setRecentlyPost] = useState();
  const [infoTable, setInfoTable] = useState();
  const navigate = useNavigate();

  const userId = user?.id;

  useEffect(() => {
    if (hompyId) {
      axios
        .get(`http://localhost:8070/hompy/${hompyId}`)
        .then((response) => {
          const hompyData = response.data;

          // 서버에서 받아온 이미지 파일 이름을 리액트 퍼블릭 폴더의 경로와 결합
          const userGender =
            hompyData.user && hompyData.user.gender
              ? hompyData.user.gender
              : "unknown";

          const minimiImagePath =
            userGender === "MALE"
              ? `${process.env.PUBLIC_URL}/image/${hompyData.minimiPicture}`
              : `${process.env.PUBLIC_URL}/image/${hompyData.minimiPicture}`;

          const miniRoomImagePath = `${process.env.PUBLIC_URL}/image/${hompyData.miniRoom}`;

          setMinimi(minimiImagePath);
          setMiniRoom(miniRoomImagePath);
        })
        .catch((error) => {
          console.error(
            "데이터를 불러오지 못했습니다. 관리자에게 문의하세요.",
            error
          );
        });
    }
  }, [userId]);

  useEffect(() => {
    miniHomePyRecentlyPost();
    miniHomePyInfoTable();
  }, [hompyId]);

  const miniHomePyRecentlyPost = async () => {
    if (hompyId) {
      const response = await api.get(
        `http://localhost:8070/${hompyId}/recentlypost`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );

      const { data, status } = response;

      if (status === 200) {
        setRecentlyPost(data);
      }
    }
  };

  const miniHomePyInfoTable = async () => {
    if (hompyId) {
      const response = await api.get(
        `http://localhost:8070/${hompyId}/infotable`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      console.log("miniHomePyInfoTable", response);
      const { data, status } = response;
      
      if (status === 200) {
        setInfoTable(data);
      }
    }
  };

  const subjectClick = (postName,folderId) =>{
    navigate(`/hompy/${hompyId}/${boardNameCheck(postName)}/${folderId}`)
  }

  return (
    <div className="right-container">
      <div className="content-section">
        {/* 업데이트 뉴스 */}
        <div className="news-section">
          <p className="head-p">Updated news</p>
          <hr className="divider" />
          <ul className="news-list">
            {recentlyPost &&
              recentlyPost.map((item) => (
                <>
                  <li className="newListItem" onClick={() => subjectClick(item.folder.boardType.name,item.folder.id)}>
                    <span>{item.folder.boardType.name}</span>
                    <span >{item.subject}</span>
                  </li>
                </>
              ))}
          </ul>
        </div>

        {infoTable && (
          <div className="info-table">
            {/* 업데이트 목록 게시판 테이블 */}
            <table>
              <tbody>
                <tr>
                  <td>
                    다이어리{" "}
                    <span className="count">
                      {infoTable.todayDiary}/{infoTable.totalDiary}{" "}
                      {infoTable.todayDiary !== 0 && (
                        <span className="new-icon">N</span>
                      )}
                    </span>
                  </td>
                  <td>
                    사진첩{" "}
                    <span className="count">
                      {infoTable.todayPhoto}/{infoTable.totalPhoto}{" "}
                      {infoTable.todayPhoto !== 0 && (
                        <span className="new-icon">N</span>
                      )}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    게시판{" "}
                    <span className="count">
                      {infoTable.todayBoard}/{infoTable.totalBoard}{" "}
                      {infoTable.todayBoard !== 0 && (
                        <span className="new-icon">N</span>
                      )}
                    </span>
                  </td>
                  <td>
                    방명록{" "}
                    <span className="count">
                      {infoTable.todayGuestBook}/{infoTable.totalGuestBook}{" "}
                      {infoTable.todayGuestBook !== 0 && (
                        <span className="new-icon">N</span>
                      )}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    동영상{" "}
                    <span className="count">
                      {infoTable.todayVideo}/{infoTable.totalVideo}{" "}
                      {infoTable.todayVideo !== 0 && (
                        <span className="new-icon">N</span>
                      )}
                    </span>
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
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
          <img src={minimi} alt="Character" className="miniroom-character" />
        </div>
      </div>

      {/* 일촌평 */}
      <div className="friend-msg">
        <span className="friends-msg">일촌평</span>
        <div className="input-container">
          <input className="text-box" type="text" placeholder="일촌평 작성.." />
          <button type="submit" className="friend-board-btn">
            등록
          </button>
        </div>
      </div>
    </div>
  );
};

export default Right;
