import React, { useContext, useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { checkFriendShip, findFriendList, userList } from "../../apis/auth";
import Header from "../components/Header/Header";
// import AddFriendModal from "../components/friendShip/AddFriendModal";
import FriendRequestModal from "../../minihompy/components/friendShip/FriendRequestModal";
import AddFriendModal from "../../minihompy/components/friendShip/AddFriendModal";
import PaymentModal from "../payment/PaymentModal";
import styled from "styled-components";
import LoginForm from "../components/login/login/LoginForm";
import "./css/Home.css";
import { LoginContext } from "../components/login/context/LoginContextProvider";
import MyBox from "../components/mybox/MyBox";
import SlideImg from "../components/slideImg/SlideImg";
import News from "../components/news/News";
import BestItem from "../components/bestItem/BestItem";
import Footer from "../components/Footer/Footer";

const StyledLoginBox = styled.div`
    /* outline: 3px solid red; */
    width: 350px;
    height: 280px;
    margin-left: 30px;
    margin-top: 20px;
`;
const StyledMyBox = styled.div`
    /* outline: 1px solid #dad9d9; */
    width: 350px;
    height: 280px;
    margin-left: 30px;
    margin-top: 20px;
`;

const Home = ({ itemKind }) => {
    const { isLogin} = useContext(LoginContext);



    return (
        <div className='home-container'>
            <div className='content-container'>
                <div className='top-row'>
                    {isLogin ? (
                        <StyledMyBox>
                            <MyBox />
                        </StyledMyBox>
                    ) : (
                        <StyledLoginBox>
                            {" "}
                            <LoginForm />
                        </StyledLoginBox>
                    )}
                    <SlideImg className='slideImg' />
                </div>

                <div className='new-section'>
                    <News />
                </div>

                <div className='bestItem-section'>
                    <BestItem />
                </div>

                <Footer />
            </div>
        </div>
    );
};

export default Home;
