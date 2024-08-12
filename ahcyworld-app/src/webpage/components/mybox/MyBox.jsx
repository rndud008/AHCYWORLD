import React, { useContext, useEffect, useState } from "react";
import "./MyBox.css";
import { LoginContext } from "../login/context/LoginContextProvider";
import PaymentModal from "../../payment/PaymentModal";
import acorn from "../../../upload/acorn.png"
import { getLogedUser } from "../../../apis/auth";
const MyBox = () => {
    const { isLogin, userInfo, hompyInfo } = useContext(LoginContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [logedUser, setLogedUser] = useState({});

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        // console.log("유저 정보: ", userInfo);
    }, []);

    const minimiPicture = `${process.env.PUBLIC_URL}/image/${hompyInfo.minimiPicture}`;

    return (
        <div className='mybox-container'>
            <div className='top'>
                {isLogin ? <span>{userInfo.name}의 아싸e월드</span> : <span> ...의 아싸e월드</span>}
                <button onClick={openModal} className='acorn-btn'>
                    도토리 구매
                </button>
                <PaymentModal isOpen={isModalOpen} onClose={closeModal} />
            </div>
            <div className='middle'>
                <div className='minimi-box'>
                    <img
                        src={minimiPicture}
                        alt='미니홈피 이미지'
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                </div>
                <div className='info-box'>
                    <ul>
                        <li>
                            오늘방문자<span></span>
                        </li>

                        <li>
                            새게시물<span>0</span>
                        </li>
                        <li>
                            일촌신청<span>0</span>
                        </li>
                        <li>
                            내 도토리
                            <img src={acorn} />
                            {/* <span>{userInfo.acorn}</span> */}
                        </li>
                    </ul>
                </div>
            </div>
            <div className='bottom'>
                <button className='hompy-btn'>내 미니홈피</button>
            </div>
        </div>
    );
};

export default MyBox;
