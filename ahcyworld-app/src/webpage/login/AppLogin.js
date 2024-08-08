import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginContextProvider from "./context/LoginContextProvider";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Join from "../pages/Join";
import Member from "../pages/Member";
import Admin from "../pages/Admin";
import Cart from "../pages/Cart";
import Post from "../../minihompy/components/post/Post";
import Hompy from "../../minihompy/pages/Hompy";
import Profile from "../../minihompy/pages/Profile";
import GuestBookHome from "../../minihompy/components/guestBook/GuestBookHome";

const AppLogin = () => {

    const [userId, setUserId] = useState();


    return (
        <BrowserRouter>
            <LoginContextProvider>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/join' element={<Join />} />
                    <Route path='/member' element={<Member />} />
                    <Route path='/admin' element={<Admin />} />
                    <Route path='/post/:hompyId/:postName/*' element={<Post />} />
                    <Route path='/hompy/:userId' element={<Hompy setUserId={setUserId} />} />
                    <Route path='/profile/:userId' element={<Profile setUserId={setUserId} />} />
                    <Route path='/cart' element={<Cart/>}></Route>
                    <Route path="/guestbook/:hompyId" element={<GuestBookHome setUserId={setUserId}/>} />
                </Routes>
            </LoginContextProvider>
        </BrowserRouter>
    );
};

export default AppLogin;
