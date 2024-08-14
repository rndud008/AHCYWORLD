import React, { useContext, useState } from 'react';
import "./Box.css";
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../login/context/LoginContextProvider';
import { faL } from '@fortawesome/free-solid-svg-icons';
import PaymentHistory from '../paymentHistory/PaymentHistory';

const Box = () => {
    const {userInfo} = useContext(LoginContext);

    const [isPaymentHistoryOpen, setIsPaymentHistoryOpen] = useState(false);

    const navigate = useNavigate();

    const openPaymentHistoryModal = () => {
        setIsPaymentHistoryOpen(true);
    };

    const closePaymentHistoryModal = () => {
        setIsPaymentHistoryOpen(false);
    }

    const handleCarts = () => {
        navigate(`/cart/${userInfo.id}`);
    }

    return (
        <>
            <div className='box-container'>
                <div className='main-payment-container'>
                    <button className='payCart-button' onClick={openPaymentHistoryModal}>결제내역</button>
                </div>
                <div className='cart-container'>
                    <button className='payCart-button' onClick={() => handleCarts()}>장바구니</button>
                </div>
            </div>
            <PaymentHistory isOpen={isPaymentHistoryOpen} onClose={closePaymentHistoryModal}/>
        </>
    );
};

export default Box;