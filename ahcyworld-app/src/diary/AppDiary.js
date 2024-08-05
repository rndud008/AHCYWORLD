import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DiaryHome from './pages/DiaryHome';
import DiaryWritePage from './pages/DiaryWritePage';
import DiaryUpdatePage from './pages/DiaryUpdatePage';

const AppDiary = () => {
    return (
        <BrowserRouter>
        <Routes>
            <Route path='/list' Component={DiaryHome}></Route>
            <Route path='/write' Component={DiaryWritePage}></Route>
            <Route path='/update/:id' Component={DiaryUpdatePage}></Route>
            <Route path='' Component={null}></Route>
        </Routes>
        </BrowserRouter> 
    );
};

export default AppDiary;