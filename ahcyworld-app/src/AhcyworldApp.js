import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DiaryHome from './diary/components/DiaryHome';
import DiaryWritePage from './diary/components/DiaryWritePage';


const AhcyworldApp = () => {
    return (
        <>
        <BrowserRouter>
        <Routes>
            <Route path='/list' Component={DiaryHome}></Route>
            <Route path='/write' Component={DiaryWritePage}></Route>
        </Routes>
        </BrowserRouter> 
        </>
    );
};

export default AhcyworldApp;