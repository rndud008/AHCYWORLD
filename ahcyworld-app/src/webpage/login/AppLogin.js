import React, { useContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginContextProvider, { LoginContext } from "./context/LoginContextProvider";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Join from "../pages/Join";
import Member from "../pages/Member";
import Admin from "../pages/Admin";
import Cart from "../pages/Cart";
import Post from "../../minihompy/components/post/Post";

const AppLogin = () => {
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
                    <Route path='/cart' element={<Cart/>}></Route>
                </Routes>
            </LoginContextProvider>
        </BrowserRouter>
    );
};

export default AppLogin;
