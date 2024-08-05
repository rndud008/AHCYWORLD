import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Left from './Left';
import Right from './Right';
import './Layout.css';

const Layout = () => {
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
        TODAY 0 &nbsp; | &nbsp; TOTAL 0
      </div>

      {/* 김세진님의 미니홈피 */}
      <div className="homepage-title">
        김세진님의 미니홈피
      </div>

      {/* 메인 컨텐츠 */}
      <div className="d-flex justify-content-center align-items-center min-vh-100">
          <div className="left-panel">
            <Left />
          </div>
          <div className="right-panel">
            <Right />
          </div>
        
      </div>
    </div>
  );
};

export default Layout;
