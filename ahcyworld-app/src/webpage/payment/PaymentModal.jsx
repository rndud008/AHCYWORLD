import React, { useContext, useEffect, useState } from "react";
import Payment from "./Payment";
import "./css/PaymentModal.css";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { SERVER_HOST } from "../../apis/api";
import { LoginContext } from "../components/login/context/LoginContextProvider";

const PaymentModal = ({ isOpen, onClose }) => {
    const { userInfo } = useContext(LoginContext)
    const [isDisabled, setIsDisabled] = useState(true)
    const navigator = useNavigate();
    const [user, setUser] = useState({
        name: "",
        tel: "",
        email: "",
    });
    const [friends, setFriends] = useState([]);
    const [friendData, setFriendData] = useState("");
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

            axios({
                method: "GET",
                url: `${SERVER_HOST}/friend/myfriends`,
                params: { username: userInfo.username }
            }).then(response => {
                setFriends(response.data);

            })
        }
    }
    const changeValue = (e) => {
        setAcorns(e.target.value.trim());
    };

    const checkBoxChange = (e) => {
        e.target.checked === false ? checkfalse() : setIsDisabled(false);
    }

    const checkfalse = () => {
        setIsDisabled(true);
        setFriendData("");

    }

    const selectFriend = (e) => {
        const friend = friends.find(x => x.friendUser.id === parseInt(e.target.value));
        setFriendData(friend);
    }

    const closePayModal = () => {
        onClose();
        setIsDisabled(true);
        setFriendData("");
    }
    return (
        <div className='payment-modal-overlay'>
            <div className='payment-modal-content'>
                <h2>도토리 충전</h2>
                <hr />
                <div>
                    <input type="checkbox" style={{ display: "inline" }} onChange={checkBoxChange} />
                    <p style={{ display: "inline" }}>친구에게 선물</p>
                </div>
                <select disabled={isDisabled} value={friendData} onChange={selectFriend}>
                    <option value={""} disabled>친구선택</option>
                    {friends.map(friend => <option key={friend.id} value={friend.friendUser.id}>{friend.friendName} ({friend.friendUser.name})</option>)}

                </select>
                <br />


                <h5>구매 전 도토리 개수: {user.acorn} 도토리</h5>
                <h5>
                    충전할 도토리 개수 <small>(필수)</small>
                </h5>

                <input type='text' className='form-control' placeholder='숫자를 입력하세요' onChange={changeValue} />
                <button onClick={() => Payment(user, acorns, navigator, friendData)}>결제하기</button>
                <button onClick={() => closePayModal()}>닫기</button>
            </div>
        </div>
    );
};

export default PaymentModal;
