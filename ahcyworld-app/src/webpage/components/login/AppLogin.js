import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginContextProvider from "./context/LoginContextProvider";
import Home from "../../pages/Home";
import Join from "../../pages/Join";
import Member from "../../pages/Member";
import Admin from "../../pages/Admin";
import Cart from "../../pages/Cart";
import Post from "../../../minihompy/components/post/Post";
import Hompy from "../../../minihompy/pages/Hompy";
import Profile from "../../../minihompy/pages/Profile";
import GuestBookHome from "../../../minihompy/components/guestBook/GuestBookHome";
import OAuth2AddInfo from "./Login/OAuth2AddInfo";

const AppLogin = () => {

    const [userId, setUserId] = useState();


    return (
        <BrowserRouter>
            <LoginContextProvider>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/join' element={<Join />} />
                    <Route path='/member' element={<Member />} />
                    <Route path='/admin' element={<Admin />} />
                    <Route path='/post/:hompyId/:postName/*' element={<Post />} />
                    <Route path='/hompy/:userId' element={<Hompy setUserId={setUserId} />} />
                    <Route path='/profile/:userId' element={<Profile setUserId={setUserId} />} />
                    <Route path="/guestbook/:hompyId" element={<GuestBookHome setUserId={setUserId}/>} />
                    <Route path='/addinfo' element={<OAuth2AddInfo />} />
                    <Route path='/cart/:userId' element={<Cart/>}></Route>
                </Routes>
            </LoginContextProvider>
        </BrowserRouter>
    );
};

export default AppLogin;
