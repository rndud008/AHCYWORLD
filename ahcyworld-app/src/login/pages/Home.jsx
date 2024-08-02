import React, { useState } from 'react';
import Header from '../components/Header/Header';
import PaymentModal from '../../payment/PaymentModal';
import {Modal, Button} from 'react-bootstrap';

const Home = () => {

    
    /* 모달 상태와 변경 */
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    /* 모달 상태와 변경 */

    

    return (
        <>
        <Header/>
            <h1>Home</h1>
            <button onClick={openModal}>모달 열기</button>
            <PaymentModal isOpen={isModalOpen} onClose={closeModal}/>
            
        </>
    );
};

export default Home;