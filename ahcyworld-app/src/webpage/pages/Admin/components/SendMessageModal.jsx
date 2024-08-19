import React, { useContext, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { IoIosSend } from "react-icons/io";
import { LoginContext } from "../../../components/login/context/LoginContextProvider";
import { sendMessageToUser } from "../../../../apis/auth";
import * as Swal from "../../../../apis/alert";

const SendMessageModal = ({ isOpen, onClose, selectedUser }) => {
    const { userInfo } = useContext(LoginContext);
    const [message, setMessage] = useState("");
    const [title, setTitle] = useState("");

    const handleMessage = (e) => {
        setMessage(e.target.value);
    };

    const handleTitle = (e) => {
        setTitle(e.target.value);
    };

    const sendMessage = async () => {
        const senderId = userInfo.id;
        const receiverId = selectedUser.id;
        
        try {
            const response = await sendMessageToUser(title, message, senderId, receiverId);

            if (response.status === 201) {
                Swal.alert("메세지를 전송완료", "메세지 전송 완료, 사용자 목록으로 돌아갑니다.", "success", () => {
                    onClose();
                });
            }
        } catch (error) {
            console.error("sendMessageToUser: ", error);
        }
    };

    return (
        <Modal show={isOpen} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{selectedUser.name}님 에게 메세지 보내기</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>제목:</p>
                <Form.Control type='text' value={title} onChange={handleTitle} />
            </Modal.Body>
            <Modal.Body>
                <p>내용: </p>
                <Form.Control type='text' value={message} onChange={handleMessage} />
            </Modal.Body>
            <Modal.Footer>
                <Button variant='danger' onClick={onClose}>
                    닫기
                </Button>
                <Button variant='outline-primary' onClick={sendMessage}>
                    <IoIosSend />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default SendMessageModal;
