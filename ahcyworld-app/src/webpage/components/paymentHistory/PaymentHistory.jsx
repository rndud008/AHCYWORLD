import React, { useContext, useEffect, useState } from "react";
import { LoginContext } from "../login/context/LoginContextProvider";
import axios from "axios";
import { SERVER_HOST } from "../../../apis/api";
import Cookies from "js-cookie";
import acorn from "../../../upload/acorn.png";
import "./MainPaymentHistory.css";
import { Button, ListGroup, Modal } from "react-bootstrap";

const PaymentHistory = ({ isOpen, onClose }) => {
    const { userInfo } = useContext(LoginContext);
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [loading, setLoading] = useState(true)
    const cookie = Cookies.get("accessToken");

    useEffect(() => {
        if (isOpen) {
            const fetchPaymentHistory = async () => {
                try {
                    const response = await axios.get(
                        `${SERVER_HOST}/cart/history`,
                        {
                            params: { id: userInfo.id },
                            headers: { Authorization: `Bearer ${cookie}` },
                        }
                    );
                    const history = response.data;

                    setPaymentHistory(history);
                } catch (error) {
                    console.error("결제내역 불러오기 실패", error);
                } finally{
                    setLoading(false);
                }
            };
            fetchPaymentHistory();
        }
    }, [isOpen, userInfo.id, cookie]);

    return (
        <>
            <Modal show={isOpen} onHide={onClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>결제 내역</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {paymentHistory.length > 0 ? (
                        <ListGroup>
                            {paymentHistory.map((payment) => (
                                <ListGroup.Item key={payment.id} className="custom-list-group-item">
                                    <p>
                                        <strong>결제일 : </strong>{" "}
                                        {new Date(
                                            payment.createAt
                                        ).toLocaleString()}
                                    </p>
                                    <p>
                                        <strong>상품 타입 : </strong>{" "}
                                        {payment.item.itemType}
                                    </p>
                                    <p>
                                        <strong>상품 이름 : </strong>{" "}
                                        {payment.item.itemName}
                                    </p>
                                    <p>
                                        <strong>가격 : </strong> {payment.item.price}{" "}
                                        <img src={acorn} alt="도토리" className="paymentHistoryAcorn"/>
                                    </p>
                                </ListGroup.Item>
                            ))}
                            <p className="remaining-acorns">
                                <strong>남은 도토리 개수 : </strong>{" "}
                                <span>{userInfo.acorn}<img src={acorn} alt="도토리" className="paymentHistoryAcorn"/></span>
                            </p>
                        </ListGroup>
                    ) : (
                        <p>결제 내역이 없습니다.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button className="textedit-btn" onClick={onClose}>
                        닫기
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default PaymentHistory;
