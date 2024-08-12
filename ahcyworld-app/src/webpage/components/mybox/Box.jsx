import React, { useContext } from 'react';
import "./Box.css";
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../login/context/LoginContextProvider';

const Box = () => {
    const {userInfo, hompyInfo} = useContext(LoginContext);

    const navigate = useNavigate();

    const handleCarts = () => {
        navigate(`/cart/${userInfo.id}`);
    }

    return (
        <>
            <div className='box-container'>
                <div className='payment-container'>
                    <button className='payCart-button'>결제내역</button>
                </div>
                <div className='cart-container'>
                    <button className='payCart-button' onClick={() => handleCarts()}>장바구니</button>
                </div>
            </div>
        </>
    );
};

export default Box;