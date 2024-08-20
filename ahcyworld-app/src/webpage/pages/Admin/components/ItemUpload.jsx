import axios from 'axios';
import React, { useRef, useState } from 'react';
import { alert, itemconfirm } from '../../../../apis/alert';
import { SERVER_HOST } from '../../../../apis/api';
import '../css/ItemUpload.css';


const ItemUpload = ({ setSubMenu }) => {


    const [showItemName, setShowItemName] = useState(false);
    const [showPrice, setShowPrice] = useState(false);
    const [showStatus, setShowStatus] = useState(false);
    const [showItemType, setShowItemType] = useState(false);
    const [showImg, setShowImg] = useState(false)
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);
    const [file, setFile] = useState({})
    const [isDuplication, setIsDuplication] = useState(false)
    const [isDonClick, setIsDonClick] = useState(false);
    const [button, setButton] = useState("No")
    const [successName, setSuccessName] = useState(false);
    const [isdisabled, setIsDisabled] = useState(false);

    const [item, setItem] = useState({
        itemName: "",
        itemType: "",
        sourceName: "",
        fileName: "",
        price: "",
        status: "",
        bgmImg: "",
    })

    const changeValue = (e) => {
        setItem({
            ...item,
            [e.target.name]: e.target.value.trim(),
        });
    }

    const handleClick = () => {
        setSubMenu('itemList');
        setItem({});
    };




    const reset = () => {
        setItem({
            itemName: "",
            itemType: "",
            sourceName: "",
            fileName: "",
            price: "",
            status: "visible",
            bgmImg: "",
        });
        setButton("No");
        setIsDonClick(false);
        setIsDuplication(false);
        setShowItemName(false);
        setSuccessName(false);
        setPreview(null);
    }

    const submitItem = (e) => {
        e.preventDefault();
        let valid = true;

        if (e.nativeEvent.submitter.name === 'submitButton') {

            if (item.itemType === "" ||
                item.status === "" === "" ||
                item.price < 0 ||
                item.price === "" ||
                item.sourceName === "" ||
                successName === false) {
                valid = false
            }

            if (valid) {
                const handleSubmit = async () => {
                    const formData = new FormData();
                    let updateItem = item;
                    formData.append('image', file);

                    try {
                        const response = await axios.post(`${SERVER_HOST}/item/admin/file`, formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                        });

                        if (response.status === 200) {
                            updateItem.fileName = response.data;
                        } else {
                            console.error('파일 업로드 실패');
                        }
                    } catch (error) {
                        console.error('Error:', error);
                    }


                    try {
                        const response = await axios({
                            method: 'POST',
                            url: `${SERVER_HOST}/item/admin/add`,
                            headers: {
                                'Content-Type': 'application/JSON'
                            },
                            data: JSON.stringify(updateItem),
                        })
                        itemconfirm("추가 성공", "아이템리스트로 넘어가시겠습니까?", "success", () => handleClick(), () => reset())

                    } catch (error) {
                        console.error("등록실패! : " + error)
                    }
                };
                handleSubmit();
            }
            (item.price < 0 || item.price === "") ? setShowPrice(true) : setShowPrice(false);
            item.itemType === "" ? setShowItemType(true) : setShowItemType(false);
            item.status === "" ? setShowStatus(true) : setShowStatus(false);
            item.sourceName === "" ? setShowImg(true) : setShowImg(false);
            button === "No" ? setIsDonClick(true) : setIsDonClick(false);

        }
    }

    const handleSuccessName = (isDonclick1, isDuplication1, isitemname) => {
        if (!isDonclick1 && !isDuplication1 && !isitemname) {
            setSuccessName(true);
            setIsDisabled(true);
        } else {
            setSuccessName(false);
            setIsDisabled(false);
        }
    }

    const handleOpenFile = () => {
        fileInputRef.current.click();
    };


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            // 여기서 파일을 처리하거나 서버로 업로드할 수 있습니다.
            setItem({
                ...item,
                sourceName: file.name,
            });
            setFile(file);
            setPreview(previewUrl);
        }
    };

    const handleDuplication = () => {
        setButton("yes");
        setIsDonClick(false);
        let isitemname;
        const duplication = async () => {
            try {
                const response = await axios({
                    method: 'GET',
                    url: `${SERVER_HOST}/item/admin/duplicaion`,
                    params: { itemname: item.itemName }
                })
                let isDuplication1 = response.data;
                let isDonclick1 = false;

                setIsDuplication(isDuplication1);


                handleSuccessName(isDonclick1, isDuplication1, isitemname);

            } catch (error) {
                console.error("요청 실패 : ", error)
            }
        }
        if(item.itemName === ""){
            isitemname = true
            setShowItemName(isitemname);
            setIsDuplication(false)
        }else{
            isitemname = false;
            setShowItemName(isitemname);
            duplication();
        }

        
    }

    const rename = () => {
        setIsDonClick(true);
        setShowItemName(false);
        setIsDuplication(false);
        setSuccessName(false);
        setIsDisabled(false)
    }

    return (
        <>
            <div style={{ display: 'flex', gap: '30px' }}>
                <div style={{ width: '500px' }}>
                    <h2 className="display-6">아이템 등록</h2>
                    <hr />
                    <form onSubmit={submitItem}>
                        <div className="mt-3">
                            <label htmlFor="itemNameText"><h4>상품 이름 <small>(필수)</small></h4></label>
                            <div style={{ display: 'flex' }}>
                                <input type="text" id='itemNameText' className="itemUpload-itemname" value={item.itemName} placeholder="상품 이름를 입력하세요" onChange={changeValue} name="itemName" disabled={isdisabled} />
                                {successName ? <button className="itemUpload-itembtn" onClick={() => rename()}>수정</button> : <button className="itemUpload-itembtn" onClick={() => handleDuplication()}>중복확인</button>}
                            </div>

                        </div>
                        {(isDonClick && !showItemName && !isDuplication) && (<div><span className="text-danger">중복확인을 해주세요</span></div>)}
                        {(!isDonClick && showItemName && !isDuplication) && (<div><span className="text-danger">이름을 작성해주세요</span></div>)}
                        {(!isDonClick && !showItemName && isDuplication) && (<div><span className="text-danger">중복된 이름입니다. 다시 작성해주세요</span></div>)}
                        {(successName) && (<div><span className="text-success">사용 가능한 이름입니다.</span></div>)}

                        <div className="mt-3">
                            <label htmlFor="itemTypeText"><h4>상품 종류 <small>(택1)</small></h4></label>
                            <select className="form-select itemupload-type" value={item.itemType} onChange={changeValue} name="itemType" id="itemTypeText">
                                <option value="">-- 상품종류를 선택해 주세요 --</option>
                                <option value="미니미">미니미</option>
                                <option value="미니룸">미니룸</option>
                                <option value="스킨">스킨</option>
                                <option value="글꼴">글꼴</option>
                            </select>
                        </div>
                        {showItemType && (<div><span className="text-danger">상품종류를 선택해주세요</span></div>)}

                        <div className="mt-3">
                            <label htmlFor="priceText"><h4>도토리개수</h4></label>
                            <input type="number" className="form-control itemupload-price" value={item.price} id='priceText' placeholder="도토리개수를 입력하세요" onChange={changeValue} name="price" min="0" />
                        </div>
                        {showPrice && (<div><span className="text-danger">도토리는 0이상의 값이어야 합니다</span></div>)}


                        <div className="mt-3">
                            <label><h4>판매 상태</h4></label>
                            <div className="form-check">
                                <input className="update-status-radio" type="radio" id='itemStatus1' name="status" checked={item.status === 'visible'} onChange={changeValue} value="visible" />
                                <label className="update-status-input" htmlFor="itemStatus1">활성화</label>
                            </div>
                            <div className="form-check">
                                <input className="update-status-radio" type="radio" id='itemStatus2' name="status" onChange={changeValue} value="invisible" />
                                <label className="update-status-input" htmlFor="itemStatus2">비활성화</label>
                            </div>
                        </div>
                        {showStatus && (<div><span className="text-danger">상태를 선택해주세요</span></div>)}
                        <br />
                        <div>
                            <input
                                type="file"
                                accept=".jpg, .png, .gif"
                                ref={fileInputRef}
                                style={{ display: 'none' }} // 숨겨진 input 요소
                                onChange={handleFileChange}
                            />
                        </div>
                        <div className="my-3">
                            <button type="submit" name='submitButton' className="file-submin-btn">작성완료</button>
                        </div>
                    </form>
                </div>


                <div>
                    <div style={{ display: 'block', textAlign: 'center' }}>
                        <h3>이미지 미리보기</h3>
                        <div style={{ width: '250px', height: '250px', border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            {preview ? <img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', textAlign: 'center' }} /> : <div>미리보기 이미지</div>}
                        </div>
                        {showImg && (<div><span className="text-danger">이미지를 추가해주세요.</span></div>)}
                        <button style={{ marginTop: '10px' }} className="file-submin-btn" onClick={handleOpenFile}>파일선택</button>
                    </div>

                </div>
            </div>
        </>
    );
};

export default ItemUpload;