import React, { useContext, useEffect, useState } from "react";
import "./MyBox.css";
import { LoginContext } from "../login/context/LoginContextProvider";
import PaymentModal from "../../payment/PaymentModal";
import acorn from "../../../upload/acorn.png";
import { getLogedUser, myFriendRequests } from "../../../apis/auth";
import FriendRequestModal from "../../../minihompy/components/friendShip/FriendRequestModal";
const MyBox = () => {
    const { isLogin, logout, userInfo, hompyInfo } = useContext(LoginContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [friendRequest, setFriendRequest] = useState([]);
    const [isFriendRequstModalOpen, setIsFriendRequestModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const openFriendRequestModal = () => {
        setIsFriendRequestModalOpen(true);
    };

    const closeFriendRequestModal = () => {
        setIsFriendRequestModalOpen(false);
    };

    useEffect(() => {
        // console.log(hompyInfo);
        const fetchFriendRequests = async () => {
            try {
                const response = await myFriendRequests(userInfo.username);
                // console.log(userInfo.username);
                // console.log(response.data);
                // console.log(response.data.length);
                setFriendRequest(response.data);
            } catch (error) {
                console.error("myFriendRequests Error: ", error);
            }
        };

        fetchFriendRequests();
    }, [isLogin, userInfo, isFriendRequstModalOpen]);

    const minimiPicture = `${process.env.PUBLIC_URL}/image/${hompyInfo.minimiPicture}`;

    const openMinihompy = () => {
        window.open(
            `http://localhost:3000/hompy/${hompyInfo.id}`, // 열고 싶은 URL
            "_blank", // 새로운 창을 엽니다.
            "width=800,height=600,menubar=no,toolbar=no,scrollbars=no,resizable=no" // 창의 크기 설정
        );
    };

    return (
        <div className='mybox-container'>
            <div className='top'>
                <div className='name-box'>{isLogin ? <span>{userInfo.name}</span> : <span></span>}</div>

                <div className='topbtn-box'>
                    <PaymentModal isOpen={isModalOpen} onClose={closeModal} />
                    <button onClick={() => logout()} className='logout-btn'>
                        로그아웃
                    </button>
                </div>
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
                            <span>오늘방문자</span>
                            <span>{hompyInfo.todayVisitor}</span>
                        </li>
                        <li>
                            <span>총방문자</span>
                            <span>{hompyInfo.totalVisitor}</span>
                        </li>
                        <li className='friend-request' onClick={openFriendRequestModal}>
                            <span>일촌신청</span>
                            <span>{friendRequest.length}</span>
                        </li>
                        <FriendRequestModal isOpen={isFriendRequstModalOpen} onClose={closeFriendRequestModal} />
                        <li className='acorn-status'>
                            <span className='my-acorn'>
                                <img src={acorn} alt='' />
                                <span>{userInfo.acorn}</span>
                            </span>
                            <button className='acorn-btn' onClick={openModal}>
                                충전
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            <div className='bottom'>
                <button className='hompy-btn' onClick={() => openMinihompy(hompyInfo.id)}>
                    내 미니홈피
                </button>
            </div>
        </div>
    );
};

export default MyBox;
