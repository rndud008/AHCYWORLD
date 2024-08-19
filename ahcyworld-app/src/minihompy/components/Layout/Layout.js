import React, { useContext, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Left from "../../../minihompy/components/Layout/Left";
import Right from "../../../minihompy/components/Layout/Right";
import "./css/Layout.css";
import axios from "axios";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import Menu from "../menu/Menu";
import BgmPlayer from "../musicPlayer/BgmPlayer";
import BoardTypeList from "../post/BoardTypeList/BoardTypeList";
import { hompyInfo } from "../../../apis/auth";
import { LoginContext } from "../../../webpage/components/login/context/LoginContextProvider";
import { Button } from "react-bootstrap";
import api, { SERVER_HOST } from "../../../apis/api";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";

const Layout = ({ hompy, user, children, LeftPanelComponent }) => {
  const [visitorInfo, setVisitorInfo] = useState({
    todayVisitor: 0,
    totalVisitor: 0,
  });
  const [miniHompySkin, setMiniHompySkin] = useState();
  const [hompyTitle, setHompyTitle] = useState();
  const [show,setShow] = useState(false);

  const { hompyInfo, setHompyInfo } = useContext(LoginContext);
  const { postName } = useParams();
  const location = useLocation();
  const isSettingPage = location.pathname.includes("/setting"); // 셋팅페이지 경로감지

  const hompyId = hompy?.id;
  const userId = user?.id;
  const userCheck = parseInt(hompyId) === hompyInfo.id;
  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    // hompy가 존재하는지 확인 후에 visitorInfo를 업데이트
    if (hompy) {
      setVisitorInfo({
        todayVisitor: hompy.todayVisitor || 0,
        totalVisitor: hompy.totalVisitor || 0,
      });
      setHompyTitle(hompy.title);
    }
  }, [hompy]);

  useEffect(() => {
    // 미니홈피에 방문 시 방문자 수 증가 API 호출
    const increaseVisitCount = async () => {
      // sessionStorage.getItem을 사용해 해당 사용자가 이미 방문했는지 확인
      const hasVisited = sessionStorage.getItem(`hasVisited_${userId}`);

      if (userId && !hasVisited) {
        try {
          const response = await axios.post(
            `http://localhost:8070/hompy/${hompyId}/visit`
          );
          setVisitorInfo({
            todayVisitor: response.data.todayVisitor || 0,
            totalVisitor: response.data.totalVisitor || 0,
          });
          // 사용자가 처음 방문한 경우에만 방문자 수 증가 API를 호출하고,
          // 그 후에 sessionStorage.setItem을 사용해 방문 사실을 기록
          sessionStorage.setItem(`hasVisited_${userId}`, "true");
        } catch (error) {
          console.error("Error increasing visit count:", error);
        }
      }
    };
    increaseVisitCount();
  }, [user]);

  useEffect(() => {
    if (hompyId) {
      axios
        .get(`http://localhost:8070/hompy/${hompyId}`)
        .then((response) => {
          const hompyData = response.data;
          // 서버에서 받아온 이미지 파일 이름을 리액트 퍼블릭 폴더의 경로와 결합
          const hompySkinImagePath = `${process.env.PUBLIC_URL}/image/${hompyData.miniHompySkin}`;
          setMiniHompySkin(hompySkinImagePath);
        })
        .catch((error) => {
          console.error(
            "데이터를 불러오지 못했습니다. 관리자에게 문의하세요.",
            error
          );
        });
    }

    if(hompyInfo.id === undefined){
      alert('로그인이 필요합니다')
      console.log('location',location)
      return navigate('/')
  }
  }, [userId, hompyInfo]);

  const hompyTitleChangeValue = (e) => {
    const { value } = e.target;
    setHompyTitle(value)
  };

  const buttonShow =()=>{
    if(userCheck){
      setShow(true);
    }
  }

  const outFocus = ()=>{

    setTimeout(()=>{
      setShow(false);
    },100)
  }

  const hompyTitleUpdate = async() =>{

    const valid = hompyTitleValidation(hompyTitle);
    let hompy = hompyInfo;
    hompy.title = hompyTitle

    if(!valid) return alert('제목은 공란일수 없습니다.');

    const response = await api.post(`${SERVER_HOST}/hompy/${hompyId}`,hompy,{
      headers:{
        Authorization: `Bearer ${Cookies.get("accessToken")}`,
      }
    })

    const {data, status} = response;

    if(status ===  200){
      setHompyInfo(data);
      setShow(false);
    }
  
  }

  function hompyTitleValidation(hompyTitle){
    let valid =true;

    if(!hompyTitle || hompyTitle.trim()===""){
      valid = false;
    }

    return valid;
  }



  return (
    <>
      {/* 배경 이미지 */}
      {hompyInfo.id &&
      <div
        className="background-image"
        style={{
          backgroundImage: `url(${miniHompySkin})`,
          fontFamily: `${hompyInfo.miniHompyFont}`
        }}
      >
        {/* 컨테이너 아웃라인 */}
        <div className="container-fluid p-0 position-relative outline-container">
          <img src="/image/outerbox.png" className="outline-image" />
          <div className="inline-container">
            {/* 컨테이너 내부라인 */}
            <div>
              <div className="visitAndtitle">
                {/* 방문자 */}
                <div className="visitor-info">
                  TODAY {visitorInfo?.todayVisitor} &nbsp; | &nbsp; TOTAL{" "}
                  {visitorInfo?.totalVisitor}
                </div>
                {/* 미니홈피 타이틀 */}
                <div className={`homepage-title `}>
                  <input
                    value={hompyTitle}
                    onChange={hompyTitleChangeValue}
                    onClick={buttonShow}
                    onBlur={outFocus}
                    className={
                      (!userCheck && "homepage-title-outline") ||
                      (userCheck && "homepage-title-cursor")
                    }
                    readOnly={!userCheck ? true : undefined}
                  />
                  {show && <button className="hompy-title-btn" onClick={hompyTitleUpdate}>수정</button>}
                </div>
              </div>
            </div>
            <div className="maincontent">
              <div className="left-content">
                {/* <좌측> 프로필, 폴더, 관리 */}
                {isSettingPage ? (
                  LeftPanelComponent ? (
                    <LeftPanelComponent />
                  ) : null
                ) : (
                  <>
                    {postName === undefined && (
                      <Left user={user} hompy={hompy} />
                    )}
                    {postName && <BoardTypeList />}
                  </>
                )}
              </div>

              {/* <우측> 게시물 들  */}
              {/* children을 통해 오른쪽 컴포넌트를 대체 */}
              <div className="right-content">
                {children || <Right hompy={hompy} user={user} />}
              </div>
            </div>
          </div>

          {/* 메뉴 자리 */}
          <div className="menubar">
            <Menu />
          </div>
        </div>

        <div className="bgmbox">
          {/* Bgm 자리 */}
          <BgmPlayer />
        </div>
      </div>
      }
    </>
  );
};

export default Layout;
