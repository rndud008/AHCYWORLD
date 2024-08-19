import React, { useContext, useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { addFriend } from "../../../apis/auth";
import * as Swal from "../../../apis/alert";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../../webpage/components/login/context/LoginContextProvider";

const AddFriendModal = ({ isOpen, onClose, selectedFriend }) => {
    const navigate = useNavigate();

    const { userInfo,hompyInfo } = useContext(LoginContext);

    const [friendType1, setFriendType1] = useState("");
    const [friendType2, setFriendType2] = useState("");
    const [message, setMessage] = useState("");

    const friend = selectedFriend || {};

    const handleFriendType1 = (e) => {
        setFriendType1(e.target.value);
    };
    const handleFriendType2 = (e) => {
        setFriendType2(e.target.value);
    };
    const handleMessage = (e) => {
        setMessage(e.target.value);
    };

    const sendFriendRequest = async () => {
        const username = userInfo.username;
        const friendUseraname = friend.username;

        try {
            const response = await addFriend(friendType1, friendType2, message, userInfo.username, friend.username);

            if (response) {
                Swal.alert("일촌신청을 보냈습니다.", "상대방이 수락하면 일존이 맺어집니다~!", "success", () => {
                    onClose();
                    // navigate(`/hompy/${hompyInfo.id}`)
                });
            }
        } catch (error) {
            console.error("sendFriendRequest Error: ", error);
        }

        setFriendType1("");
        setFriendType2("");
        setMessage("");

    };

    return (
        <Modal show={isOpen} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>일촌신청</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    {friend ? friend.name : ""} 님을 {userInfo ? userInfo.name : ""} 님의
                    <Form.Control type='text' value={friendType1} onChange={handleFriendType1} />
                    으로
                </p>
                <p>
                    {userInfo ? userInfo.name : ""} 님을 {friend ? friend.name : ""} 님의
                    <Form.Control type='text' value={friendType2} onChange={handleFriendType2} />
                    으로 일촌 맺고 싶어요
                </p>
            </Modal.Body>
            <Modal.Body>
                <p>예) 상대방을 나의 멋진 선배로 나를 상대방의 예쁜 후배로</p>
            </Modal.Body>
            <Modal.Body>
                <Form.Control type='text' value={message} onChange={handleMessage} style={{ height: "80px" }} />
            </Modal.Body>
            <Modal.Footer>
                <Button variant='primary' onClick={sendFriendRequest}>
                    일촌신청
                </Button>
                <Button variant='secondary' onClick={onClose}>
                    닫기
                </Button>
            </Modal.Footer>
         </Modal>
    );
};

export default AddFriendModal;
