import React, { useEffect, useState } from 'react';
import Header from '../components/Header/Header'
import axios from 'axios';
import Cookies from 'js-cookie';
import ItemList from '../../item/itemComponent/ItemList';
import { SERVER_HOST } from '../apis/api';

const Member = () => {
    const [itemKind,setItemKind] = useState("배경음악");
    
    const [user,setUser] = useState({});
    useEffect(()=>{
        axios({
            get:'get',
            url:`${SERVER_HOST}/user`,
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
            <h1 style={{fontFamily:"'Nanum Pen Script', cursive"}}>Member</h1>

            <button onClick={()=>{setItemKind('배경음악')}} style={{marginRight: 30}}>배경음악</button>
            <button onClick={()=>{setItemKind('스토리룸')}} style={{marginRight: 30}}>스토리룸</button>
            <button onClick={()=>{setItemKind('미니미')}} style={{marginRight: 30}}>미니미</button>
            <button onClick={()=>{setItemKind('글꼴')}} style={{marginRight: 30}}>글꼴</button>
            <button onClick={()=>{setItemKind('스킨')}} style={{marginRight: 30}}>스킨</button>
            <div>내가 가지고 있는 도토리: {user.acorn}</div>
            <hr/>
            <ItemList itemKind={itemKind}/>
            
        </div>
    );
};

export default Member;