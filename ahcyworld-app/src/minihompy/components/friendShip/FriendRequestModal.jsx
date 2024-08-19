import React, { useContext, useEffect, useState } from "react";
import { Button, ListGroup, Modal } from "react-bootstrap";
import { friendShipResponse, myFriendRequests } from "../../../apis/auth";
import { LoginContext } from "../../../webpage/components/login/context/LoginContextProvider";

const FriendRequestModal = ({ isOpen, onClose, onRequestUpdate }) => {
    const { userInfo } = useContext(LoginContext);
    const [friendRequests, setFriendRequests] = useState([]);
    const [updatedRequests, setUpdatedRequests] = useState([]);

    useEffect(() => {
        const fetchFriendRequests = async () => {
            try {
                const response = await myFriendRequests(userInfo.username);
                // console.log('friend wating.',response)

                setFriendRequests(response.data);
                setUpdatedRequests(response.data);
                onRequestUpdate(response.data); // 미니홈피와 myBox 일촌신청 연동
            } catch (error) {
                console.error("myFriendRequests Error: ", error);
            }
        };
        fetchFriendRequests();
    }, []);

    const friendShipStatus = async (requestId, reply) => {
        try {
            await friendShipResponse(requestId, reply);
            setUpdatedRequests(updatedRequests.filter((request) => request.id !== requestId));
        } catch (error) {
            console.error("friendShipResponse Error: ", error);
        }
    };

 
    return (
        <Modal show={isOpen} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>받은 일촌신청 목록</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {updatedRequests.length > 0 ? (
                    <ListGroup>
                        {updatedRequests.map(
                            (request) =>
                                request.senderName !== userInfo.username && (
                                    <ListGroup.Item key={request.id}>
                                        <div>
                                            {request.friendUser.name}님께서 {request.user.name}님과
                                            <br />
                                            일촌맺기를 희망합니다.
                                        </div>
                                        <div style={{ border: "3px solid black", height: "100px" }}>
                                            {request.message}
                                        </div>
                                        <div>
                                            {request.user.name}({request.userName}) - {request.friendUser.name}(
                                            {request.friendName})
                                            <br />
                                            <Button onClick={() => friendShipStatus(request.id, "true")}>
                                                수락
                                            </Button>{" "}
                                            <Button onClick={() => friendShipStatus(request.id, "false")}>거절</Button>
                                        </div>
                                    </ListGroup.Item>
                                )
                        )}
                    </ListGroup>
                ) : (
                    <p>받은 일촌 신청이 없습니다.</p>
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

export default FriendRequestModal;
