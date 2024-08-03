import React from 'react';
import Header from '../components/Header/Header';
import LoginForm from '../components/Login/LoginForm';

const Login = () => {
    return (
        <div>
            <Header/>
            <div>
                <LoginForm/>
            </div>
        </div>
    );
};

export default Login;