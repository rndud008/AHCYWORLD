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
                <div className="footer-links">
                    <h3>사이트 링크</h3>
                    <ul>
                        <li><a href="/">홈</a></li>
                        <li><a href="/">소개</a></li>
                        <li><a href="/">서비스</a></li>
                        <li><a href="/">공지사항</a></li>
                    </ul>
                </div>

                <div className="footer-social">
                    <h3>Social Media</h3>
                    <div className="social-icons">
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
            </div>

            <div className="footer-bottom">
                <p>© 2024 Cyworld Company. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
