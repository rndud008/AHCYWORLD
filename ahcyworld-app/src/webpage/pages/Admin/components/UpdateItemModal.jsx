import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../css/UpdateItemModal.css';
import { alert } from '../../../../apis/alert';
import { SERVER_HOST } from '../../../../apis/api';

const UpdateItemModal = ({ isOpen, ModalonClose, updateitem, setIsUpdate }) => {

    const [item, setItem] = useState({});
    const [itemNameIsNull, setItemNameIsNull] = useState(false)
    const [priceIsNull, setPriceIsNull] = useState(false)
    const [isBtnClick, setIsBtnClick] = useState(false);
    const [isDuplicate, setIsDuplicate] = useState(false);
    const [updatebutton, setUpdateButton] = useState("No")
    const [successUpdateName, setSuccessUpdateName] = useState(false);
    const [isNamedisabled, setIsNameDisabled] = useState(false);


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
                console.log("이게 간거야?", error)
            }

        }
        if (successUpdateName) {
            commit();
        }

        (item.price < 0 || item.price === "") ? setPriceIsNull(true) : setPriceIsNull(false);
        updatebutton === "No" ? setIsBtnClick(true) : setIsBtnClick(false);
        console.log(updatebutton);
    }

    const Duplicate = () => {
        console.log(item.itemName);
        const duplication1 = async () => {
            try {
                const response = await axios({
                    method: 'GET',
                    url: `${SERVER_HOST}/item/admin/duplicaion`,
                    params: { itemname: item.itemName }
                })

                let isDuplication1 = response.data;
                let isDonclick1 = false;
                let isitemname;
                item.itemName === "" ? isitemname = true : isitemname = false;
                setIsBtnClick(false);
                setItemNameIsNull(isitemname);
                setIsDuplicate(isDuplication1);
                setUpdateButton("yes");
                console.log(isitemname);
                console.log(isDuplication1);
                handleSuccessName(isDonclick1, isDuplication1, isitemname);

            } catch (error) {
                console.error("요청 실패 : ", error);
                console.log(item.itemName);
            }
        }

        duplication1();
    }

    const handleSuccessName = (isDonclick1, isDuplication1, isitemname) => {
        if (!isDonclick1 && !isDuplication1 && !isitemname) {
            setSuccessUpdateName(true);
            setIsNameDisabled(true);
        } else {
            setSuccessUpdateName(false);
            setIsNameDisabled(false);
        }
    }

    const exit = () => {
        ModalonClose();
        setIsBtnClick(false);
        setItemNameIsNull(false);
        setIsDuplicate(false);
        setSuccessUpdateName(false);
        setIsNameDisabled(false);
        setUpdateButton("No")
    }

    const rename = () => {
        setIsBtnClick(true);
        setItemNameIsNull(false);
        setIsDuplicate(false);
        setSuccessUpdateName(false);
        setIsNameDisabled(false);
    }

    return (
        <div className='updateItem-modal-overlay'>
            <div className='updateItem-modal-content'>
                <h2>아이템 정보 변경</h2>
                <hr />
                <h4>상품 이름</h4>
                <div>
                    <input type='text' name='itemName' value={item.itemName} onChange={(e) => changeValue(e)} disabled={isNamedisabled} />
                    {successUpdateName ? <button className="itemUpload-itembtn" onClick={() => rename()}>수정</button> : <button className="itemUpload-itembtn" onClick={() => Duplicate()}>중복확인</button>}
                    {/* <button onClick={()=>Duplicate()}>중복확인</button> */}
                </div>
                {(isBtnClick && !itemNameIsNull && !isDuplicate) && (<div><span className="text-danger">중복확인을 해주세요</span></div>)}
                {(!isBtnClick && itemNameIsNull && !isDuplicate) && (<div><span className="text-danger">이름을 작성해주세요</span></div>)}
                {(!isBtnClick && !itemNameIsNull && isDuplicate) && (<div><span className="text-danger">중복된 이름입니다. 다시 작성해주세요</span></div>)}
                {(successUpdateName) && (<div><span className="text-success">사용 가능한 이름입니다.</span></div>)}
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

                <div style={{ display: 'flex', justifyContent: 'center', gap: '30px' }}>
                    <button style={{ width: '90px' }} onClick={() => updateCommit()}>완료</button>
                    <button style={{ width: '90px' }} onClick={() => exit()}>닫기</button>
                </div>
            </div>
        </div>
    );
};

export default UpdateItemModal;