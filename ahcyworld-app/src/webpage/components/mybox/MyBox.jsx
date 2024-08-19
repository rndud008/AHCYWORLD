import React, { useContext, useEffect, useState } from "react";
import "./MyBox.css";
import { LoginContext } from "../login/context/LoginContextProvider";
import PaymentModal from "../../payment/PaymentModal";
import acorn from "../../../upload/acorn.png";
import { getLogedUser, getMessageFromAdmin, myFriendRequests } from "../../../apis/auth";
import FriendRequestModal from "../../../minihompy/components/friendShip/FriendRequestModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { SERVER_HOST } from "../../../apis/api";
import { Modal } from "react-bootstrap";
import UpdateUser from "./UpdateUser";
import * as Swal from "../../../apis/alert";
import MessageModal from "../Message/MessageModal";
import PaymentHistory from "../paymentHistory/PaymentHistory";
const MyBox = () => {
    const { isLogin, logout, userInfo, setUserInfo, hompyInfo } = useContext(LoginContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [friendRequest, setFriendRequest] = useState([]);
    const [friendRequestCnt, setFriendRequestCnt] = useState(0);
    const [messageCnt, setMessageCnt] = useState(0);
    const [isFriendRequstModalOpen, setIsFriendRequestModalOpen] = useState(false);

    // 내 정보 수정
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    // 알림 모달창
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

    const [isPaymentHistoryOpen, setIsPaymentHistoryOpen] = useState(false);

    // 메시지 모달
    const openMessageModal = () => {
        setIsMessageModalOpen(true);
    };

    const closeMessageModal = () => {
        setIsMessageModalOpen(false);
    };
    // 메시지 모달

    const navigate = useNavigate();

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

    const handleFriendRequestUpdate = (updateRequests) => {
        setFriendRequest(updateRequests);
    };

    const openEditModal = () => {
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
    };

    const openPaymentHistoryModal = () => {
        setIsPaymentHistoryOpen(true);
    };

    const closePaymentHistoryModal = () => {
        setIsPaymentHistoryOpen(false);
    };

    const handleCarts = () => {
        navigate(`/cart/${userInfo.id}`);
    };

    useEffect(() => {
        const fetchFriendRequests = async () => {
            try {
                const response = await myFriendRequests(userInfo.username);
                setFriendRequest(response.data);
                let requestCnt = 0;

                response.data.forEach((request) => {
                    console.log("보낸사람 이름: ", request.senderName);
                    if (request.senderName !== userInfo.username) {
                        setFriendRequest(request);
                        requestCnt++;
                    }
                });

                setFriendRequestCnt(requestCnt);
            } catch (error) {
                console.error("myFriendRequests Error: ", error);
            }
        };

        fetchFriendRequests();
    }, [isLogin, userInfo, isFriendRequstModalOpen, isMessageModalOpen]);

    useEffect(() => {
        const fetchMessage = async () => {
            try {
                let msgCount = 0;
                const response = await axios({
                    method: "GET",
                    url: `${SERVER_HOST}/payment/acorn/gift/${userInfo.id}`,
                });
                msgCount += response.data.length;

                const messageResponse = await getMessageFromAdmin(userInfo.id);
                msgCount += messageResponse.data.length;

                setMessageCnt(msgCount);
            } catch (error) {
                console.error("에러!!", error);
            }
        };
        fetchMessage();
    }, [isMessageModalOpen]);

    const minimiPicture = `${process.env.PUBLIC_URL}/image/${hompyInfo.minimiPicture || "default_img.png"}`;

    const openMinihompy = () => {
        window.open(
            `http://localhost:3000/hompy/${hompyInfo.id}`, // 열고 싶은 URL
            "_blank", // 새로운 창을 엽니다.
            "width=1700,height=850,menubar=no,toolbar=no,scrollbars=no,resizable=no" // 창의 크기 설정
        );
    };

    return (
        <div className='mybox-container'>
            <div className='top'>
                <div className='name-box'>{isLogin ? <span>{userInfo.name}</span> : <span></span>}</div>

                <div className='btn-box'>
                    <button onClick={openEditModal} className='user-btn'>
                        내 정보 수정
                    </button>
                </div>
                <UpdateUser isEditModalOpen={isEditModalOpen} closeEditModal={closeEditModal} />
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
                            <span>{friendRequestCnt}</span>
                        </li>
                        <FriendRequestModal
                            isOpen={isFriendRequstModalOpen}
                            onClose={closeFriendRequestModal}
                            onRequestUpdate={handleFriendRequestUpdate}
                        />
                        <li className='acorn-status'>
                            <span className='my-acorn'>
                                <img src={acorn} alt='' />
                                <span>{userInfo.acorn}</span>
                            </span>
                            <button className='acorn-btn' onClick={openModal}>
                                충전
                            </button>
                        </li>
                        {/* </li> */}
                    </ul>
                </div>
            </div>

            <div className='box-container'>
                <div className='top-buttons-container'>
                    <button className='hompy-btn' onClick={openMessageModal}>
                        알림 {messageCnt}
                    </button>
                    <MessageModal isOpen={isMessageModalOpen} onClose={closeMessageModal} />
                    <button className='hompy-btn' onClick={() => openMinihompy(hompyInfo.id)}>
                        내 미니홈피
                    </button>
                </div>
                <div className='bottom-buttons-container'>
                    <button className='payCart-button' onClick={openPaymentHistoryModal}>
                        결제내역
                    </button>
                    <button className='payCart-button' onClick={() => handleCarts()}>
                        장바구니
                    </button>
                </div>
            </div>
            <PaymentHistory isOpen={isPaymentHistoryOpen} onClose={closePaymentHistoryModal} />
        </div>
    );
};

export default MyBox;
