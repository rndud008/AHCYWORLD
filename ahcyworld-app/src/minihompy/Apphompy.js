import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Menu from "./components/menu/Menu";
import "bootstrap/dist/css/bootstrap.min.css";
import BgmPlayer from "./components/musicPlayer/BgmPlayer";
import Profile from "./pages/Profile";

const Apphompy = () => {
    const [userId, setUserId] = useState(null);

    return (
        <BrowserRouter>
            <Menu userId={userId} />
            <BgmPlayer />
            <Routes>
                <Route path='/hompy/:userId' element={<Home setUserId={setUserId} />} />
                <Route path='/profile/:userId' element={<Profile setUserId={setUserId} />} />
                {/* <Route path="/diary" element={<Diary />} />
        <Route path="/photo" element={<Photo />} />
        <Route path="/board" element={<Board />} />
        <Route path="/vedio" element={<Video />} /> 
        <Route path="/guest_book" element={<GuestBook />} />
        <Route path="/manager" element={<Manager />} /> */}
            </Routes>
        </BrowserRouter>
    );
};

export default Apphompy;
