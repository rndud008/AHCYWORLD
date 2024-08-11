import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Left from "../../../minihompy/components/Layout/Left";
import Right from "../../../minihompy/components/Layout/Right";
import "./css/Layout.css";
import axios from "axios";
import { Outlet, useLocation, useParams } from "react-router-dom";
import { Container } from "react-bootstrap";
import Menu from "../menu/Menu";
import BgmPlayer from "../musicPlayer/BgmPlayer";
import BoardTypeList from "../post/BoardTypeList/BoardTypeList";
import { useDispatch, useSelector } from "react-redux";
import { HompyAction } from "../../../redux/actions/HompyAction";

const Layout = ({ hompy, user, children, showTitle = true, showVisitorInfo = true, LeftPanelComponent}) => {

    const [visitorInfo, setVisitorInfo] = useState({ todayVisitor: 0, totalVisitor: 0 });
    const [miniHompySkin, setMiniHompySkin] = useState();
    const userId = user?.id;
    const hompyId = hompy?.id;
    

  const { postName,setting } = useParams();
  const location = useLocation();
  const isSettingPage = location.pathname.includes('/setting'); // 셋팅페이지 경로감지

  useEffect(() => {
    // hompy가 존재하는지 확인 후에 visitorInfo를 업데이트
    if (hompy) {
      setVisitorInfo({
        todayVisitor: hompy.todayVisitor || 0,
        totalVisitor: hompy.totalVisitor || 0,
      });
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
    if (userId) {
      axios
        .get(`http://localhost:8070/hompy/${userId}`)
        .then((response) => {
          const hompyData = response.data;

          // 서버에서 받아온 이미지 파일 이름을 리액트 퍼블릭 폴더의 경로와 결합
          const hompySkinImagePath = hompyData.miniHompySkin
            ? `http://localhost:8070${hompyData.miniHompySkin}`
            : `${process.env.PUBLIC_URL}/image/mainskin.png`;

          setMiniHompySkin(hompySkinImagePath);
        })
        .catch((error) => {
          console.error(
            "데이터를 불러오지 못했습니다. 관리자에게 문의하세요.",
            error
          );
        });
    }
  }, [userId]);

  const handleClick = (e) => {
    e.preventDefault(); // a 태그의 기본 동작을 막습니다.

    // 새로운 창을 고정된 사이즈로 엽니다.
    window.open(
      "http://localhost:3000/", // 열고 싶은 URL
      "_blank", // 새로운 창을 엽니다.
      "width=800,height=600,menubar=no,toolbar=no,scrollbars=no,resizable=no" // 창의 크기 설정
    );
  };

  return (
    <div className="container-fluid p-0 position-relative layout-container">
      {/* 배경 이미지 */}
      <div
        className="background-image"
        style={{
          backgroundImage: `url(${miniHompySkin}`,
        }}
      >
          <div className="text1">
              {/* 컨테이너 아웃라인 */}
              <div className="text1-1">
                  {/* 컨테이너 내부라인 */}
                  <div>
                      <div className="text1-5">
                          {/* 방문자/ 타이틀 */}
                          <div className="visitor-info">
                              TODAY {visitorInfo.todayVisitor} &nbsp; | &nbsp; TOTAL{" "}
                              {visitorInfo.totalVisitor}
                          </div>
                          <div className="homepage-title">{hompy?.title}</div>
                      </div>
                  </div>
                  <div className="text1-6">
                      <div className="text1-3">
                          {/* <좌측> 프로필, 폴더, 관리 */}
                          {(postName === undefined && setting === undefined) && <Left user={user} hompy={hompy} />}
                          {(postName && setting === undefined) && <BoardTypeList />}
                          {(setting && postName === undefined) && <LeftPanelComponent />}
                      </div>
                      <div className="text1-4">
                          {/* <우측> 게시물 들  */}
                          {children || <Right hompy={hompy} user={user} />}
                          {/* children을 통해 오른쪽 컴포넌트를 대체 */}
                      </div>
                  </div>
              </div>
              <div className="text1-2">
                  {/* 메뉴 자리 */}
                  <Menu />
              </div>
          </div>
          <div className="text2">
              {/* Bgm 자리 */}
              <BgmPlayer />
          </div>
      </div>


      {/* TODAY | TOTAL */}
      {/* <div className="visitor-info">
        TODAY {visitorInfo.todayVisitor} &nbsp; | &nbsp; TOTAL{" "}
        {visitorInfo.totalVisitor}
      </div> */}

      {/*/!* TODAY | TOTAL 조건부 랜더링 (관리페이지에서 사용함) *!/*/}
      {/*{showVisitorInfo && (*/}
      {/*  <div className="visitor-info">*/}
      {/*    TODAY {visitorInfo?.todayVisitor} &nbsp; | &nbsp; TOTAL {visitorInfo?.totalVisitor}*/}
      {/*  </div>*/}
      {/*)}*/}

      {/* 김세진님의 미니홈피 조건부 랜더링 (관리페이지에서 사용함) */}
      {/*{showTitle && (*/}
      {/*  <div className="homepage-title">{hompy.title}</div>*/}
      {/*)}*/}

      {/* 김세진님의 미니홈피 */}
      {/* <div className="homepage-title">{hompy?.title}</div> */}

      {/* 메인 컨텐츠 */}
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="left-panel">
          {/* {postName === undefined && <Left user={user} hompy={hompy} />}
          {postName && <BoardTypeList />} */}
            {/*<>*/}
            {/*  {postName === undefined && <Left user={user} hompy={hompy} />}*/}
             {/* {(postName && setting === undefined) && <BoardTypeList />} */}
             {/* {(setting && postName === undefined) && <LeftPanelComponent />} */}
            {/*</>*/}
        </div>
        <div className="right-panel">
          {/* {children || <Right hompy={hompy} user={user} />} */}
          {/* children을 통해 오른쪽 컴포넌트를 대체 */}
        </div>
      </div>
    </div>
  );
};

export default Layout;
