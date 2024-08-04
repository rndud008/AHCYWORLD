import React, { useEffect, useState } from 'react';
import Header from '../components/Header/Header'
import axios from 'axios';
import Cookies from 'js-cookie';

const Member = () => {
    
    const [user,setUser] = useState({});
    useEffect(()=>{
        axios({
            get:'get',
            url:`http://localhost:8080/user`,
            headers:{
                'Authorization': `Bearer ${Cookies.get('accessToken')}`
            }
        }).then(response=>{
            const{data,status} = response;
            if(status === 200){
                setUser({...data});
            }
        })
    },[])


    return (
        <div>
            <Header />
            <h1>Member</h1>
            <div>내가 가지고 있는 도토리: {user.acorn}</div>
        </div>
    );
};

export default Member;