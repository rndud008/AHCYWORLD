import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DiaryHome from './diary/pages/DiaryHome';
import DiaryWritePage from './diary/pages/DiaryWritePage';
import DiaryUpdatePage from './diary/pages/DiaryUpdatePage';


const AhcyworldApp = () => {
    return (
        <>
        <BrowserRouter>
        <Routes>
            <Route path='/list' Component={DiaryHome}></Route>
            <Route path='/write' Component={DiaryWritePage}></Route>
            <Route path='/update/:id' Component={DiaryUpdatePage}></Route>
            <Route path='' Component={null}></Route>
        </Routes>
        </BrowserRouter> 
        </>
    );
};

export default AhcyworldApp;