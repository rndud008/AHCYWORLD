import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Button, ListGroup, Modal } from "react-bootstrap";
import { SERVER_HOST } from "../../../apis/api";
import { LoginContext } from "../login/context/LoginContextProvider";
import { alert } from "../../../apis/alert";
import { getMessageFromAdmin, readMessage } from "../../../apis/auth";
import "./MessageModal.css";

const MessageModal = ({ isOpen, onClose }) => {
    const { userInfo } = useContext(LoginContext);
    const [updateMessage, setUpdateMessage] = useState([]);
    const [isReloading, setIsReloading] = useState(false);
    const [messageList, setMessageList] = useState([]);
    const [listChoice, setListChoice] = useState(null);

    useEffect(() => {
        if (isOpen) {
            const fetchPaymentData = async () => {
                try {
                    const paymentResponse = await axios({
                        method: "GET",
                        url: `${SERVER_HOST}/payment/acorn/gift/${userInfo.id}`,
                    });
                    setUpdateMessage(paymentResponse.data);
                    setIsReloading(false);
                } catch (error) {
                    console.error("Failed to fetch payment data:", error);
                }
            };
            const fetchMessageFromAdmin = async () => {
                const userId = userInfo.id;
                try {
                    const messageResponse = await getMessageFromAdmin(userId);
                    setMessageList(messageResponse.data);
                    return messageResponse.data;
                } catch (error) {
                    console.error("getMessageFromAdin Error: ", error);
                }
            };

            fetchPaymentData();
            fetchMessageFromAdmin();
        }
    }, [isOpen, isReloading, listChoice]);

    const handleClose = () => {
        setListChoice(null);
        onClose();
    };

    if (!isOpen) {
        return null;
    }

    const addAcorn = async (id) => {
        try {
            const response = await axios({
                method: "POST",
                url: `${SERVER_HOST}/payment/acorn/gift/success`,
                params: { id: id },
            });
            setIsReloading(true);
            window.location.reload();
        } catch (error) {
            console.error("도토리 추가 실패", error);
        }
    };

    const acceptGift = (id) => {
        alert("받기 성공!", "도토리가 추가되었습니다.", "success", () => addAcorn(id));
    };

    const checkMessage = async (id) => {
        try {
            await readMessage(id);
            setMessageList((prevList) => prevList.filter((msg) => msg.id !== id));

            alert("메시지 확인 완료.", "", "success");
            setIsReloading(true);
        } catch (error) {
            console.error("readMessage Error: ", error);
        }
    };

    const toggleListChoice = (choice) => {
        setListChoice((prevChoice) => (prevChoice === choice ? null : choice));
    };

    return (
        <Modal show={isOpen} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>메시지 목록</Modal.Title>
            </Modal.Header>
            <div className='message-btn-box'>
                <Button variant="outline-primary" className='msg-btn' onClick={() => toggleListChoice("gift")}>
                    선물함
                </Button>
                <Button variant="outline-primary" className='msg-btn' onClick={() => toggleListChoice("message")}>
                    메시지
                </Button>
            </div>

            {listChoice === "gift" && (
                <div>
                    {updateMessage.length > 0 ? (
                        <ListGroup>
                            {updateMessage.map((acornMessage) => (
                                <ListGroup.Item key={acornMessage.id}>
                                    <div className='acorn-message'>
                                        <div>
                                            {acornMessage.user.name}님께서 도토리 {acornMessage.acornCnt}를
                                            선물하셨습니다
                                        </div>
                                        <div style={{ textAlign: "right" }}>
                                            <Button onClick={() => acceptGift(acornMessage.id)}>받기</Button>
                                        </div>
                                    </div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    ) : (
                        <p>받은 도토리 메시지가 없습니다.</p>
                    )}
                </div>
            )}

            {listChoice === "message" && (
                <div>
                    {messageList.length > 0 ? (
                        <ListGroup>
                            {messageList.map((message) => (
                                <ListGroup.Item key={message.id}>
                                    <div className='msg-from-admin'>
                                        <div>
                                            <div className='msg-header'>
                                                {message.sender.name}님이 메시지를 보냈습니다.
                                            </div>
                                            내용:
                                            <div className='msg-body'>{message.message}</div>
                                        </div>
                                        <div style={{ textAlign: "right" }}>
                                            <Button onClick={() => checkMessage(message.id)}>확인</Button>
                                        </div>
                                    </div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    ) : (
                        <p>받은 메시지가 없습니다.</p>
                    )}
                </div>
            )}

            <Modal.Footer>
                <Button variant='secondary' onClick={handleClose}>
                    닫기
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default MessageModal;
