import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Left from "../../../minihompy/components/Layout/Left";
import Right from "../../../minihompy/components/Layout/Right";
import "./css/Layout.css";
import axios from "axios";
import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";
import Menu from "../menu/Menu";
import BgmPlayer from "../musicPlayer/BgmPlayer";

const Layout = ({ hompy, user, children }) => {

    const [visitorInfo, setVisitorInfo] = useState({ todayVisitor: 0, totalVisitor: 0 });
    const userId = user?.id;

    console.log(userId)

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
                    const response = await axios.post(`http://localhost:8070/hompy/${userId}/visit`);
                    setVisitorInfo({
                        todayVisitor: response.data.todayVisitor || 0,
                        totalVisitor: response.data.totalVisitor || 0,
                    });
                    // 사용자가 처음 방문한 경우에만 방문자 수 증가 API를 호출하고, 
                    // 그 후에 sessionStorage.setItem을 사용해 방문 사실을 기록
                    sessionStorage.setItem(`hasVisited_${userId}`, 'true');
                } catch (error) {
                    console.error("Error increasing visit count:", error);
                }
            }
        };
        increaseVisitCount();
    }, [user]);

    return (
        <div className='container-fluid p-0 position-relative layout-container'>
            {/* 배경 이미지 */}
            <div
                className='background-image'
                style={{
                    backgroundImage: `url(${process.env.PUBLIC_URL}/image/mainskin.png)`,
                }}
            ></div>


            {/* TODAY | TOTAL */}
            <div className='visitor-info'>
                TODAY {visitorInfo.todayVisitor} &nbsp; | &nbsp; TOTAL {visitorInfo.totalVisitor}
            </div>

            {/* 김세진님의 미니홈피 */}
            <div className='homepage-title'>{hompy.title}</div>

                {/* Menu 컴포넌트 */}
                {/* <Menu userId={userId} /> */}

                {/* BGM Player 컴포넌트 */}
                {/* <BgmPlayer /> */}

            {/* 메인 컨텐츠 */}
            <div className='d-flex justify-content-center align-items-center min-vh-100'>
                <div className='left-panel'>
                    <Left user={user} hompy={hompy} />
                </div>
                <div className='right-panel'>
                {children || <Right hompy={hompy} user={user} />} {/* children을 통해 오른쪽 컴포넌트를 대체 */}
                </div>
            </div>

            
        </div>
    );
};

export default Layout;
