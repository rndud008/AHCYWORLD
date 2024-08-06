import React from 'react';
import GuestBookHome from './component/GuestBookHome';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const AppGuestBook = () => {
    return (
        <>
        <BrowserRouter>
        <Routes>
            <Route path='/guestbook/home/:hompyId' element={<GuestBookHome />}></Route>
        </Routes>
        </BrowserRouter>
        </>
    );
};

export default AppGuestBook;