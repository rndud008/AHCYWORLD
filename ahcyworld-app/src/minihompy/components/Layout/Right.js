import React, { useContext, useEffect, useState } from "react";
import "./css/Right.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import api, { SERVER_HOST } from "../../../apis/api";
import { boardNameCheck } from "../post/utils/postUtils";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { HompyAction } from "../../../redux/actions/HompyAction";
import { hompyInfo, userInfo } from "../../../apis/auth";
import { LoginContext } from "../../../webpage/components/login/context/LoginContextProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FriendAction } from "../../../redux/actions/FriendAction";
import * as Swal from "../../../apis/alert"

const Right = ({ user,hompy }) => {
  const { hompyId } = useParams();
  const { userInfo,hompyInfo } = useContext(LoginContext);
  const [minimi, setMinimi] = useState();
  const [miniRoom, setMiniRoom] = useState();
  const [recentlyPost, setRecentlyPost] = useState();
  const [infoTable, setInfoTable] = useState();
  const [friendReview, setFriendReview] = useState();
  const [friendReviewList, setFriendReviewList] = useState();
  const friendList = useSelector(state => state.friend.hompyFriendList)
  const friendIdList = friendList.map(item => item.friendUser.id);

  const dispatch = useDispatch();
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
    if (hompyId) {
      miniHomePyRecentlyPost();
      miniHomePyInfoTable();
      dispatch(HompyAction.findByHompyIdAxios(hompyId));
    }

    if (user) {
      friendReviewListAxios();
      dispatch(FriendAction.findByHompyFriendListAixos(user.username))
      setFriendReview({
        guestBookName: "friendReview",
        hompy: hompy,
        user: userInfo,
      })
    }

  }, [hompyId, user]);

  const miniHomePyRecentlyPost = async () => {
    if (hompyId) {
      const response = await api.get(`${SERVER_HOST}/${hompyId}/recentlypost`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });

      const { data, status } = response;

      if (status === 200) {
        setRecentlyPost(data);
      }
    }
  };

  const miniHomePyInfoTable = async () => {
    if (hompyId) {
      const response = await api.get(`${SERVER_HOST}/${hompyId}/infotable`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });

      const { data, status } = response;

      if (status === 200) {
        setInfoTable(data);
      }
    }
  };

  const subjectClick = (postName, folderId) => {
    navigate(`/hompy/${hompyId}/${boardNameCheck(postName)}/${folderId}`);
  };

  const friendReviewValue = (e) => {
    const { value, name } = e.target;

    setFriendReview({ ...friendReview, [name]: value });
  };

  const friendReviewCreate = async () => {

    if(!friendIdList.some(item => item === userInfo.id)) return Swal.alert("작성실패","일촌관계만 작성가능합니다.","warning")

    try{
      const response = await api.post(
        `${SERVER_HOST}/cyworld/cy/guestbook/save`,
        friendReview
      );

      const {data,status} = response;
      if(status === 200){
        setFriendReviewList([...friendReviewList,data])
      }
      
    }catch (e){
      return Swal.alert("작성실패","일촌관계만 작성가능합니다.","warning")
    }

  };

  const friendReviewListAxios = async () => {
    const action = "friendReview";
    if (user) {
      const username = user.username;

      const response = await api.get(
        `${SERVER_HOST}/cyworld/cy/guestbook/list/${hompyId}`,
        {
          params: { action, username },
        }
      );
      const { data, status } = response;

      if (status === 200) {
        setFriendReviewList(data);
      }
    }
  };

  const activeEnter = (e) =>{
    if(e.key === "Enter"){
      friendReviewCreate();
    }
  }

  const friendReviewDelete = async(id)=>{

    if(!window.confirm('삭제하시겠습니까?')) return;

    const username = userInfo.username;
    const response = await api.delete(`${SERVER_HOST}/cyworld/cy/guestbook/delete/${id}`,{
      params:{username}
    })

    const {data,status} = response;

    if(status === 200){
      setFriendReviewList(friendReviewList.filter(item => item.id !== id));
      alert('삭제완료.');
    }
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
                  <li
                    className="newListItem"
                    onClick={() =>
                      subjectClick(item.folder.boardType.name, item.folder.id)
                    }
                  >
                    <span>[{item.folder.boardType.name}]&nbsp;&nbsp;</span>
                    <span>{item.subject}</span>
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
          <input
            name="content"
            className="text-box"
            onChange={friendReviewValue}
            onKeyDown={(e) => activeEnter(e)}
            type="text"
            placeholder="일촌평 작성.."
            onenter
          />
          <button
            type="button"
            onClick={friendReviewCreate}
            className="friend-board-btn"
          >
            등록
          </button>
        </div>
        <div className="friend-review-container">
          {(friendList && friendReviewList?.length > 0) && friendReviewList.map((item) => (
            <div>
              <span>{item.content} </span>
              <span>{item.user.name} </span>
              <span>({friendList.find(item2 => item.user.id === item2.friendUser.id)?.friendName}) </span>
              {(userInfo.id === item.user.id || hompyInfo.id === parseInt(hompyId)) && (
                <span className="friendReviewDelete" onClick={() =>friendReviewDelete(item.id)}>
                  <FontAwesomeIcon icon={faTrashCan} />
                </span>
              )}
            </div>
          )) || <div className="friend-review-container-not">작성된 방명록이 없습니다.</div>}
        </div>
      </div>
    </div>
  );
};

export default Right;
