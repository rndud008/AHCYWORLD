import React, { useContext, useEffect, useState } from "react";
import PaymentModal from "../../payment/PaymentModal";
import { Modal, Button } from "react-bootstrap";
import { LoginContext } from "../context/LoginContextProvider";
import { checkFriendShip, findFriendList, userList } from "../apis/auth";
import Header from "../components/Header/Header";

const Home = () => {
    const { isLogin, logout, userInfo } = useContext(LoginContext);

    const [isFriendListVisible, setIsFriendListVisible] = useState(false);
    const [friends, setFriends] = useState([]);
    const [users, setUsers] = useState([]);
    const [friendShipStatus, setFriendShipStatus] = useState();

    /* 모달 상태와 변경 */
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    /* 모달 상태와 변경 */

    const toggleFriendList = async () => {
        if (!isFriendListVisible) {
            try {
                const response = await findFriendList(userInfo.username);
                // console.log("respons : ", response.data);
                setFriends(response.data);
            } catch (error) {
                console.error("Error:", error);
            }
        }

        setIsFriendListVisible(!isFriendListVisible);
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await userList();
                console.log(response.data);
                setUsers(response.data);
            } catch (error) {
                console.log("Error: ", error);
            }
        };

        fetchUsers();
    }, []);

    const isFriend = async (friendUsername) => {
        try {
            const response = await checkFriendShip(userInfo.username, friendUsername);
            const { friend } = response.data;
            console.log(friend);
            setFriendShipStatus((prev) => ({
                ...prev,
                [friendUsername]: friend,
            }));
        } catch (error) {
            console.error("isFriend Error: ", error);
        }
    };

    return (
        <>
            <Header />
            <h1>Home</h1>
            <button onClick={openModal}>모달 열기</button>
            <PaymentModal isOpen={isModalOpen} onClose={closeModal} />
            <br />
            <br />
            {isLogin ? (
                <>
                    <Button onClick={toggleFriendList}>{isFriendListVisible ? "친구목록닫기" : "친구목록보기"}</Button>
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
            {users.map((user) => (
                <Button key={user.id} onClick={() => isFriend(user.name)}>
                    {user.name}
                </Button>

            ))}
        </>
    );
};

export default Home;
