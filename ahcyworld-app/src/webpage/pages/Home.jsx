import React, { useContext, useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { checkFriendShip, findFriendList, userList } from "../../apis/auth";
import Header from "../components/Header/Header";
// import AddFriendModal from "../components/friendShip/AddFriendModal";
import FriendRequestModal from "../../minihompy/components/friendShip/FriendRequestModal";
import AddFriendModal from "../../minihompy/components/friendShip/AddFriendModal";
import PaymentModal from "../payment/PaymentModal";
import styled from "styled-components";
import LoginForm from "../components/login/login/LoginForm";
import "./css/Home.css";
import { LoginContext } from "../components/login/context/LoginContextProvider";
import MyBox from "../components/mybox/MyBox";
import SlideImg from "../components/slideImg/SlideImg";
import News from "../components/news/News";
import BestItem from "../components/bestItem/BestItem";
import Footer from "../components/Footer/Footer";


const StyledLoginBox = styled.div`
    /* outline: 3px solid red; */
    width: 350px;
    height: 280px;
    margin-left: 30px;
    margin-top: 20px;
`;
const StyledMyBox = styled.div`
    /* outline: 1px solid #dad9d9; */
    width: 350px;
    height: 280px;
    margin-left: 30px;
    margin-top: 20px;
`;

const Home = ({ itemKind }) => {
    const { isLogin, logout, userInfo } = useContext(LoginContext);

    const [isFriendListVisible, setIsFriendListVisible] = useState(false);
    const [friends, setFriends] = useState([]);
    const [users, setUsers] = useState([]);
    const [friendShipStatus, setFriendShipStatus] = useState({});

    /* 모달 상태와 변경 */
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
 
    const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState(null);

    const [isFriendRequstModalOpen, setIsFriendRequestModalOpen] = useState(false);

    const openAddFriendModal = (friend) => {
        setSelectedFriend(friend);
        setIsAddFriendModalOpen(true);
    };

    const closeAddFriendModal = () => {
        setSelectedFriend(null);
        setIsAddFriendModalOpen(false);
    };

    

    /* 모달 상태와 변경 */

    const toggleFriendList = async () => {
        if (!isFriendListVisible) {
            try {
                const response = await findFriendList(userInfo.username);
                setFriends(response.data);
            } catch (error) {
                console.error("Error:", error);
            }
        }

        setIsFriendListVisible(!isFriendListVisible);
    };

    useEffect(() => {
        const fetchUsers = async () => {
            if (isLogin && userInfo.username) {
                try {
                    const response = await userList();
                    setUsers(response.data);

                    const statues = {};
                    for (const user of response.data) {
                        if (!userInfo.username || !(userInfo.username === undefined)) {
                            try {
                                const respon = await checkFriendShip(userInfo.username, user.name);
                                statues[user.name] = respon.data.friend;
                            } catch (error) {
                                console.error("checkFriendShip Error: ", error);
                                statues[user.name] = false;
                            }
                        }
                    }
                    setFriendShipStatus(statues);
                } catch (error) {
                    console.error("userList Error: ", error);
                }
            }
        };
        if (userInfo) {
            fetchUsers();
        } else return;

        localStorage.removeItem("openMenu");
        localStorage.removeItem("subMenu");
    }, [isAddFriendModalOpen, isLogin]);

    

    return (
        <div className='home-container'>
            <div className='content-container'>
                <div className='top-row'>
                    {isLogin ? (
                        <StyledMyBox>
                            <MyBox />
                        </StyledMyBox>
                    ) : (
                        <StyledLoginBox>
                            {" "}
                            <LoginForm />
                        </StyledLoginBox>
                    )}
                    <SlideImg className='slideImg' />
                </div>


                    <div className="new-section">
                        <News />
                    </div>

                {/* <div className="bottom-row"> */}
                    <div className="bestItem-section">
                        <BestItem />
                    {/* </div> */}
                </div>

                <Footer />
            </div>

            <br />
            <br />
             {/* {isLogin ? (
                    <>
                        <Button onClick={toggleFriendList}>
                            {isFriendListVisible ? "친구목록닫기" : "친구목록보기"}
                        </Button>
                        {isFriendListVisible && (
                            <div style={{ marginTop: "20px" }}>
                                {friends.length > 0 ? (
                                    <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
                                        {friends.map((friend) => (
                                            <li key={friend.id} style={{ marginBottom: "10px" }}>
                                                {friend.friendUser.name}
                                                <small>({friend.friendName})</small>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>친구 목록이 없습니다.</p>
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <></>
                )}
                <br />
                <br />
                <br />
                {users.map((friend) => (
                    <div key={friend.id}>
                        <Button>{friend.name}</Button>
                        {friendShipStatus[friend.name] === false && (
                            <Button onClick={() => openAddFriendModal(friend)}>일촌신청</Button>
                        )}
                    </div>
                ))}
                <AddFriendModal
                    isOpen={isAddFriendModalOpen}
                    onClose={closeAddFriendModal}
                    selectedFriend={selectedFriend}
                />  */}
        </div>
    );
};

export default Home;
