import React, { useEffect, useState } from "react";
import Payment from "./Payment";
import "./css/PaymentModal.css";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { SERVER_HOST } from "../../apis/api";

const PaymentModal = ({ isOpen, onClose }) => {
    const navigator = useNavigate();
    const [user, setUser] = useState({
        name: "",
        tel: "",
        email: "",
    });
    const [acorns, setAcorns] = useState(0);

    if (!isOpen) {
        return null;
    } else {
        if (user.email === "") {
            axios({
                get: "get",
                url: `${SERVER_HOST}/user`,
                headers: {
                    Authorization: `Bearer ${Cookies.get("accessToken")}`,
                },
            }).then((response) => {
                const { data, status } = response;
                if (status === 200) {
                    setUser({ ...data });
                }
            });
        }
    }
    const changeValue = (e) => {
        setAcorns(e.target.value.trim());
    };
    return (
        <div className='modal-overlay'>
            <div className='modal-content'>
                <h2>모달 창</h2>
                <p>이것은 모달 창입니다.</p>
                <label for='name'>
                    <h5>
                        도토리 개수 <small>(필수)</small>
                    </h5>
                </label>
                <input type='text' class='form-control' placeholder='숫자를 입력하세요' onChange={changeValue} />
                <button onClick={() => Payment(user, acorns, navigator)}>결제하기</button>
                <button onClick={onClose}>닫기</button>
            </div>
        </div>
    );
};

export default PaymentModal;
