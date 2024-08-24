import React from "react";
import "./Footer.css";
import logo from "../../../upload/Acyworld_LOGO.png"; // 로고 파일 경로에 맞게 수정

const Footer = () => {
    return (
        <footer className="footer-container">
            <div className="footer-content">
                <div className="footer-logo">
                    <img src={logo} alt="Cyworld Logo" />
                </div>
                <div className="footer-info">
                    <p>
                        상호: (주)AhCyworld <br/>
                        사업자등록번호: 312-05-15823 <br/>
                        통신판매업신고번호: 제0123-서울강남-0178호<br/>
                        전화: 010-5678-4321 | 팩스: 02-862-1200 | 이메일: spring@mail.com<br/>
                        주소: 서울 강남구 테헤란로26길 12 제일비전타워 13층
                    </p>
                </div>
                <div className="footer-links">
                    <ul>
                        <li><a href="/">홈</a></li>
                        <li><a href="/">소개</a></li>
                        <li><a href="/">서비스</a></li>
                        <li><a href="/">공지사항</a></li>
                    </ul>
                </div>
                <div className="footer-policy">
                    <ul>
                        <li><a href="/">이용약관</a></li>
                        <li><a href="/">개인정보처리방침</a></li>
                    </ul>
                </div>
                <div className="footer-social">
                    <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img src="/image/facebook.png" alt="Facebook" />
                    </a>
                    <a
                        href="https://twitter.com"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img src="/image/twitter.png" alt="Twitter" />
                    </a>
                    <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img src="/image/instagram.png" alt="Instagram" />
                    </a>
                </div>
            </div>

            <div className="footer-bottom">
                <p>Copyright © AhCyworld</p>
            </div>
        </footer>
    );
};

export default Footer;
