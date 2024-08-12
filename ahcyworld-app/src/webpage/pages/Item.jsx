import React, { useEffect } from 'react';
import ItemList from '../items/components/ItemList';
import '../pages/css/Item.css';

const Item = ({itemkind}) => {
    useEffect(()=>{
    
    },[])
    return (
        <div className='item-home-container'>
            <div className='item-body-container'>
                <ItemList itemkind={itemkind} />
            </div>
        </div>
    );
};

export default Item;