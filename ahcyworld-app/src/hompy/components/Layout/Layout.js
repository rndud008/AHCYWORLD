import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Left from './Left';
import Right from './Right';
import './Layout.css';

const Layout = ({hompy, user}) => {
  // console.log("유저:",user);
  // console.log("홈피:",hompy);
  if (!hompy || !user) {
    return <div>Loading...</div>; // hompy가 없을 때 로딩 중 표시
  }

  return (
    <div className="container-fluid p-0 position-relative layout-container">
      {/* 배경 이미지 */}
      <div 
        className="background-image"
        style={{ 
          backgroundImage: `url(/image/mainskin.png)`
        }}
      ></div>

       {/* TODAY | TOTAL */}
       <div className="visitor-info">
        TODAY {hompy.todayVisitor} &nbsp; | &nbsp; TOTAL {hompy.totalVisitor}
      </div>

      {/* 김세진님의 미니홈피 */}
      <div className="homepage-title">
        {hompy.title}
      </div>

      {/* 메인 컨텐츠 */}
      <div className="d-flex justify-content-center align-items-center min-vh-100">
          <div className="left-panel">
            <Left user={user} hompy={hompy}/>
          </div>
          <div className="right-panel">
            <Right hompy={hompy}/>
          </div>
        
      </div>
    </div>
  );
};

export default Layout;
