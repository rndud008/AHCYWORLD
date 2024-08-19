import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../css/UpdateItemModal.css';
import { alert } from '../../../../apis/alert';
import { SERVER_HOST } from '../../../../apis/api';

const UpdateItemModal = ({ isOpen, ModalonClose, updateitem, setIsUpdate }) => {

    const [item, setItem] = useState({});
    const [itemNameIsNull, setItemNameIsNull] = useState(false)
    const [priceIsNull, setPriceIsNull] = useState(false)

    useEffect(() => {
        if (isOpen) {
            setItem({ ...updateitem });
            setItemNameIsNull(false);
            setPriceIsNull(false);
        }
    }, [isOpen])

    if (!isOpen) {
        return;
    }

    const changeValue = (e) => {
        setItem({
            ...item,
            [e.target.name]: e.target.value.trim(),
        });
    }

    const updateCommit = () => {

        const commit = async () => {
            try {
                const response = await axios({
                    method: 'POST',
                    url: `${SERVER_HOST}/item/admin/update`,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify(item),
                })
                setIsUpdate(true);
                alert("수정 성공", "정보가 변경되었습니다.", "success", ModalonClose)
            } catch (error) {
                console.error("이게 간거야?", error)
            }

        }
        let isitemfalse = false;
        let pricefalse = false;
        if (item.itemName === "" || item.itemName === null) {
            setItemNameIsNull(true);
            isitemfalse = true;
        } else {
            setItemNameIsNull(false);
        }

        if (item.price === "" || item.price === null) {
            setPriceIsNull(true);
            pricefalse = true;
        } else {
            setPriceIsNull(false);
        }

        if (!isitemfalse && !pricefalse) {
            commit();
        }
    }

    return (
        <div className='updateItem-modal-overlay'>
            <div className='updateItem-modal-content'>
                <h2>아이템 정보 변경</h2>
                <hr />
                <h4>상품 이름</h4>
                <input type='text' name='itemName' value={item.itemName} onChange={(e) => changeValue(e)} />
                {itemNameIsNull && (<div><span class="text-danger">상품명을 적어주세요</span></div>)}
                <br />
                <br />
                <h4>도토리 가격</h4>
                <input type='text' name='price' value={item.price} onChange={(e) => changeValue(e)} />도토리
                {priceIsNull && (<div><span class="text-danger">가격을 적어주세요</span></div>)}
                <br />
                <br />
                <h4>판매 상태</h4>
                <div >
                    <div>
                        <input type="radio" name="status" id="status1" onChange={(e) => changeValue(e)} value="visible" checked={item.status === 'visible'} />
                        <label htmlFor="status1">활성화</label>
                    </div>
                    <div>
                        <input type="radio" name="status" id="status2" value="invisible" onChange={(e) => changeValue(e)} checked={item.status === 'invisible'} />
                        <label htmlFor="status2">비활성화</label>
                    </div>
                </div>
                <br />

                <div style={{display: 'flex', justifyContent:'center', gap: '30px'}}>
                    <button style={{width: '90px'}} onClick={() => updateCommit()}>완료</button>
                    <button style={{width: '90px'}} onClick={ModalonClose}>닫기</button>
                </div>
            </div>
        </div>
    );
};

export default UpdateItemModal;