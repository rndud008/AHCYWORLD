import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { SERVER_HOST } from '../../login/apis/api';
import '../css/ItemList.css';

const ItemList = (props) => {

    const [items,setItems] = useState([]);
    const [isMusic,setIsMusic] = useState(false);
    const [isFont,setIsFont] = useState(false);
    
    useEffect(()=>{
        const type = props.itemKind;
        axios({
            method:'GET',
            url:`${SERVER_HOST}/item/${type}`
        }).then(response => {
            const {data, status} = response;
            if(status === 200){
                // setItems([...data]);
                const threeItems = [];
                for(let i = 0; i< [...data].length; i+= 3){
                    threeItems.push([...data].slice(i,i + 3))
                }
                setItems(threeItems);
                if(data[0].itemType === "배경음악"){
                    setIsMusic(true);
                }else{
                    setIsMusic(false);
                }
                if(data[0].itemType === "글꼴"){
                    setIsFont(true);
                }else{
                    setIsFont(false);
                }
                
            }
        })
    },[props.itemKind])

    return(
        <>
            <table>
                <tbody>
                    {items.map((threeItem,rowIndex) => (
                        <tr key={rowIndex}>
                            {threeItem.map((item,colIndex) => (
                                <td style={{marginRight: 400}}>
                                     { isFont?
                                    (<input type='text' style={{fontFamily:`${item.sourceName}, cursive` , fontSize: 50}} value="AhCyWorld"/>)
                                    :
                                    (isMusic ? 
                                        (<img src={item.bgmImg}/>) 
                                        :
                                        (<img src={`${process.env.PUBLIC_URL}/image/${item.fileName}`} style={{ height: "250px" }} />)
                                    )}<br/>
                                    { isMusic ? <div style={{fontSize: 20}}>{item.sourceName} : {item.itemName} : {item.price}도토리<br/></div> : <div style={{fontSize: 40}}>{item.itemName} : {item.price}도토리<br/></div>}
                                    { isMusic ? <audio controls><source src={item.fileName} type="audio/mpeg" /></audio> : null}

                                </td>
                            ))}  
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default ItemList;