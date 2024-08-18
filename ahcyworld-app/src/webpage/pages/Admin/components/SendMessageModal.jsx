import React, { useContext, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { IoIosSend } from "react-icons/io";
import { LoginContext } from "../../../components/login/context/LoginContextProvider";
import { sendMessageToUser } from "../../../../apis/auth";
import * as Swal from "../../../../apis/alert";
import "../css/SendMessageModal.css";

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
        <Modal show={isOpen} onHide={onClose} className="custom-modal">
            <Modal.Header closeButton className="custom-modal-header">
                <Modal.Title>{selectedUser.name}님에게 메세지 보내기</Modal.Title>
            </Modal.Header>
            <Modal.Body className="custom-modal-body">
                <div className="custom-modal-field">
                    <p>제목:</p>
                    <Form.Control
                        type="text"
                        value={title}
                        onChange={handleTitle}
                        className="custom-input"
                    />
                </div>
                <div className="custom-modal-field">
                    <p>내용:</p>
                    <Form.Control
                        as="textarea"
                        rows={5}
                        value={message}
                        onChange={handleMessage}
                        className="custom-input message-content"
                    />
                </div>
            </Modal.Body>
            <Modal.Footer className="custom-modal-footer">
                <Button variant="outline-danger" onClick={onClose} className="custom-btn">
                    닫기
                </Button>
                <Button variant="outline-primary" onClick={sendMessage} className="custom-btn">
                    <IoIosSend />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default SendMessageModal;
