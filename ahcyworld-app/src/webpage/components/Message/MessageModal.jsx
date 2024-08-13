import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Button, ListGroup, Modal } from 'react-bootstrap';
import { SERVER_HOST } from '../../../apis/api';
import { LoginContext } from '../login/context/LoginContextProvider';
import { alert } from '../../../apis/alert';

const MessageModal = ({ isOpen, onClose }) => {
    const [updateMessage, setUpdateMessage] = useState([]);
    const [isReloading,setIsReloading] = useState(false);
    const { userInfo } = useContext(LoginContext);


    useEffect(() => {
        if (isOpen) {
            console.log(userInfo.id);
            const paymentData = async () => {
                try {
                    const paymentResponse = await axios({
                        method: "GET",
                        url: `${SERVER_HOST}/payment/acorn/gift/${userInfo.id}`,
                    });
                    console.log(paymentResponse.data)
                    setUpdateMessage(paymentResponse.data);
                    setIsReloading(false);
                } catch (error) {
                    console.error("Failed to fetch payment data:", error);
                }
            };
            paymentData();
        }
    }, [isOpen,isReloading]);

    if (!isOpen){
        return null;
    }


    const addAcorn = async (id) => {
        try{
            const response = await axios({
                method: "POST",
                url:`${SERVER_HOST}/payment/acorn/gift/success`,
                params: {id: id}
            })
            console.log("도토리 추가 성공!")
            setIsReloading(true);
            window.location.reload();
            
        } catch(error){
            console.log("도토리 추가 실패",error);
        }
    }

    const acceptGift = (id) => {
        alert("받기 성공!","도토리가 추가되었습니다.","success",()=>addAcorn(id))
    }

    return (
        <Modal show={isOpen} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>메시지 목록</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {updateMessage.length > 0 ? (
                    <ListGroup>
                        {updateMessage.map((message) => (
                            <ListGroup.Item key={message.id}>
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <div>
                                        {message.user.name}님께서 도토리 {message.acornCnt}를 선물하셨습니다
                                    </div>
                                    <div style={{display: 'inline-block', textAlign: 'right'}}>
                                        <Button onClick={() => acceptGift(message.id)}>받기</Button>{" "}
                                    </div>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                ) : (
                    <p>받은 메시지가 없습니다.</p>
                )}
                <hr />
            </Modal.Body>
            <Modal.Footer>
                <Button variant='secondary' onClick={onClose}>
                    닫기
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default MessageModal;