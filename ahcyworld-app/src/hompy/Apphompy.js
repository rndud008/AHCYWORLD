import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./page/Home";
import Profile from "./page/Profile";
import Menu from "./components/Menu/Menu";
import 'bootstrap/dist/css/bootstrap.min.css';

const Apphompy = () => {
  return (
    <BrowserRouter>
      <Menu />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
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
