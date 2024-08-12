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

    const handleFriendRequestUpdate = (updateRequests) => {
        setFriendRequest(updateRequests);
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

    return (
        <div className='mybox-container'>
            <div className='top'>
                <div className="name-box">{isLogin ? <span>{userInfo.name}</span> : <span></span>}</div>

                <div className="btn-box">
                    <button onClick={openModal} className='acorn-btn'>
                        도토리 구매
                    </button>
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
                            오늘방문자<span>{hompyInfo.todayVisitor}</span>
                        </li>
                        <li>
                            총방문자<span>{hompyInfo.totalVisitor}</span>
                        </li>
                        <li className='friend-request' onClick={openFriendRequestModal}>
                            일촌신청<span>{friendRequest.length}</span>
                        </li>
                        <FriendRequestModal 
                        isOpen={isFriendRequstModalOpen} 
                        onClose={closeFriendRequestModal} 
                        onRequestUpdate={handleFriendRequestUpdate}
                        />
                        <li onClick={openModal} className='acorn-status'>
                            내 도토리
                            <img src={acorn} />
                            {isLogin ? <span>{userInfo.acorn}</span> : <span>0</span>}
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
