import React, { useContext, useEffect, useState } from "react";
import Payment from "./Payment";
import "./css/PaymentModal.css";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { SERVER_HOST } from "../../apis/api";
import { LoginContext } from "../components/login/context/LoginContextProvider";
import acorn from "../../upload/acorn.png"

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
    const [friendData, setFriendData] = useState({
        friendUser: {
            id: ""
        }
    });
    const [acorns, setAcorns] = useState("");
    const [isPayedDisabled, setIsPayedDisabled] = useState(true)
    const [isZeroAcorn, setIsZeroAcorn] = useState(false);
    const [directText,setDirctText] = useState(false);

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
        const resetFriendData = {
            friendUser : {
                id: ""
            }
        }
        setFriendData(resetFriendData);
    }
    const pay = () => {
        if (parseInt(acorns) > 0) {
            Payment(user, acorns, navigator, friendData);
            setIsZeroAcorn(false);
        } else {
            setIsZeroAcorn(true);
            return;
        }

    }

    const selectFriend = (e) => {
        const friend = friends.find(x => x.friendUser.id === parseInt(e.target.value));
        setFriendData(friend);
    }

    const closePayModal = () => {
        onClose();
        console.log(acorns);
        setIsDisabled(true);
        setIsPayedDisabled(true);
        setFriendData("");
        setAcorns(0);
        setIsZeroAcorn(false);
        const resetFriendData = {
            friendUser : {
                id: ""
            }
        }
        setFriendData(resetFriendData);

    }

    return (
        <div className='payment-modal-overlay'>
            <div className='payment-modal-content'>
                <h2 style={{ fontWeight: 'bold' }}>도토리 충전 <img className="payment-acorn-img" src={acorn} alt=""></img></h2>
                <hr />
                <div>
                    <input type="checkbox" style={{ display: "inline" }} onChange={checkBoxChange} />
                    <p style={{ display: "inline" }}>친구에게 선물</p>
                </div>
                <select disabled={isDisabled} value={friendData.friendUser.id} onChange={selectFriend} style={{ width: '100%' }}>
                    <option value={""} disabled>친구선택</option>
                    {friends.map(friend => <option key={friend.id} value={friend.friendUser.id}>{friend.friendName} ({friend.friendUser.name})</option>)}

                </select>


                <h5 style={{ marginTop: "40px" }}>구매 전 도토리: {user.acorn} <img className="payment-small-acorn-img" src={acorn} alt=""></img></h5>
                <br />
                <h5>
                    상품 선택 <small>(필수)</small>
                </h5>


                <div style={{ border: '4px solid #E66E28' }}>
                    <table style={{ marginLeft: '10px' }}>
                        <tbody>
                            <tr style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', gap: '40px' }}>
                                <td className="form-check">
                                    <input style={{ fontSize: '20px' }} className="form-check-input" type="radio" id='acorn100' name="acorn" onChange={(e) => { changeValue(e); setIsPayedDisabled(true); setDirctText(true); }} value='100' />
                                    <label style={{ fontSize: '20px', width: '70px' }} className="form-check-label" htmlFor="acorn100">100개</label>
                                </td>
                                <td className="form-check">
                                    <input style={{ fontSize: '20px' }} className="form-check-input" type="radio" id='acorn300' name="acorn" onChange={(e) => { changeValue(e); setIsPayedDisabled(true); setDirctText(true); }} value='300' />
                                    <label style={{ fontSize: '20px', width: '70px' }} className="form-check-label" htmlFor="acorn300">300개</label>
                                </td>
                                <td className="form-check">
                                    <input style={{ fontSize: '20px' }} className="form-check-input" type="radio" id='acorn500' name="acorn" onChange={(e) => { changeValue(e); setIsPayedDisabled(true); setDirctText(true); }} value='500' />
                                    <label style={{ fontSize: '20px', width: '70px' }} className="form-check-label" htmlFor="acorn500">500개</label>
                                </td>
                            </tr>
                            <tr style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', gap: '40px' }}>
                                <td className="form-check">
                                    <input style={{ fontSize: '20px' }} className="form-check-input" type="radio" id='acorn1000' name="acorn" onChange={(e) => { changeValue(e); setIsPayedDisabled(true); setDirctText(true); }} value='1000' />
                                    <label style={{ fontSize: '20px', width: '70px' }} className="form-check-label" htmlFor="acorn1000">1000개</label>
                                </td>
                                <td className="form-check">
                                    <input style={{ fontSize: '20px' }} className="form-check-input" type="radio" id='acorn5000' name="acorn" onChange={(e) => { changeValue(e); setIsPayedDisabled(true); setDirctText(true); }} value='5000' />
                                    <label style={{ fontSize: '20px', width: '70px' }} className="form-check-label" htmlFor="acorn5000">5000개</label>
                                </td>
                                <td className="form-check">
                                    <input style={{ fontSize: '20px' }} className="form-check-input" type="radio" id='acorn10000' name="acorn" onChange={(e) => { changeValue(e); setIsPayedDisabled(true); setDirctText(true); }} value='10000' />
                                    <label style={{ fontSize: '20px', width: '80px' }} className="form-check-label" htmlFor="acorn10000">10000개</label>
                                </td>
                            </tr>
                            <tr style={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
                                <td style={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
                                    <input style={{ fontSize: '20px', marginRight: '5px' }} className="form-check-input" type="radio" id='acorntext' name="acorn" onChange={() => { setIsPayedDisabled(false); setDirctText(false); setAcorns(""); }} />
                                    <label style={{ fontSize: '20px', width: '140px' }} className="form-check-label" htmlFor="acorntext">직접입력:</label>
                                    <input type='text' className='form-control' placeholder='숫자를 입력하세요' {...(directText ? {value: ""} : {})} onChange={(e) => { changeValue(e) }} disabled={isPayedDisabled} />
                                    <div style={{ fontSize: '20px' }}>개</div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {isZeroAcorn && (<div><span className="text-danger">1개이상의 도토리</span></div>)}

                <h5 style={{ marginTop: "40px" }}>구매 후 도토리: {(user.acorn + (parseInt(acorns) ? parseInt(acorns) : 0))} <img className="payment-small-acorn-img" src={acorn} alt=""></img></h5>
                <h5 style={{ marginTop: "40px" }}>결제금액: {(parseInt(acorns) ? parseInt(acorns) * 10 : 0)} 원</h5>


                <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center', gap: '30px', marginTop: '20px' }}>
                    <button className="payment-pushItem" onClick={() => pay()}>결제</button>
                    <button className="payment-close-pushItem" onClick={() => closePayModal()}>닫기</button>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
