import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./pages/Main";
import Headerr from "./components/Header/Headerr";

const WebPageApp = () => {
    return (
        <BrowserRouter>
            <Headerr />
            <Routes>
                <Route path='/' element={<Main />} />
            </Routes>
        </BrowserRouter>
    );
};

export default WebPageApp;
