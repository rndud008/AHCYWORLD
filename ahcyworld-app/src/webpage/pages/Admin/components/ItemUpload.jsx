import axios from 'axios';
import React, { useRef, useState } from 'react';
import { alert } from '../../../../apis/alert';

const ItemUpload = () => {


    const [showItemName, setShowItemName] = useState(false);
    const [showPrice, setShowPrice] = useState(false);
    const [showStatus, setShowStatus] = useState(false);
    const [showItemType, setShowItemType] = useState(false);
    const [showImg, setShowImg] = useState(false)
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);

    // const [strFavorite, setStrfavorite] = useState("aaa");

    const [item, setItem] = useState({
        itemName: "",
        itemType: "",
        surceName: "",
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
        console.log(item)
    }

    const submitItem = (e) => {
        e.preventDefault();
        let valid = true;

        if (e.nativeEvent.submitter.name === 'submitButton') {

            if (item.itemName === "" ||
                item.itemType === "" ||
                item.status === "" === "" ||
                item.price < 0 ||
                item.price === ""||
                item.fileName === "") {
                valid = false
            }

            if (valid) {
                console.log(item);
                // axios({
                //     method: 'post',
                //     url: "http://localhost:8080/survey/write",
                //     headers: {
                //         "Content-Type": "application/json",
                //     },
                //     data: JSON.stringify(item),
                // }).then(response => {
                //     const { data, status } = response;
                //     if (status === 200) {
                //         alert("등록성공", "등록 되었습니다.", "success", () => setItem({
                //             itemName: "",
                //             itemType: "",
                //             surceName: "",
                //             fileName: "",
                //             price: "",
                //             status: "",
                //             bgmImg: "",
                //         }))

                //     } else {
                //         alert('등록 실패');
                //     }
                // });
            }
            item.itemName === "" ? setShowItemName(true) : setShowItemName(false);
            (item.price < 0 || item.price === "") ? setShowPrice(true) : setShowPrice(false);
            item.itemType === "" ? setShowItemType(true) : setShowItemType(false)
            item.status === "" ? setShowStatus(true) : setShowStatus(false);
            item.fileName === "" ? setShowImg(true) : setShowImg(false);
            
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
                fileName: file.name,
            });
            setPreview(previewUrl);
        }
    };


    return (
        <>
            <div style={{ display: 'flex', gap: '30px'}}>
                <div style={{ width: '500px' }}>
                    <h2 className="display-6">아이템 등록</h2>
                    <hr />
                    <form onSubmit={submitItem}>
                        <div className="mt-3">
                            <label htmlFor="itemNameText"><h5>상품 이름 <small>(필수)</small></h5></label>
                            <input type="text" id='itemNameText' className="form-control" placeholder="상품 이름를 입력하세요" onChange={changeValue} name="itemName" />
                        </div>
                        {showItemName && (<div><span className="text-danger">상품 이름은 필수입니다</span></div>)}

                        <div className="mt-3">
                            <label htmlFor="itemTypeText"><h5>상품 종류 <small>(택1)</small></h5></label>
                            <select className="form-select" onChange={changeValue} name="itemType" id="itemTypeText">
                                <option value="">-- 상품종류를 선택해 주세요 --</option>
                                <option value="글꼴">글꼴</option>
                                <option value="미니미">미니미</option>
                                <option value="미니룸">미니룸</option>
                                <option value="스킨">스킨</option>
                            </select>
                        </div>
                        {showItemType && (<div><span className="text-danger">상품종류를 선택해주세요</span></div>)}

                        <div className="mt-3">
                            <label htmlFor="priceText"><h5>도토리개수</h5></label>
                            <input type="number" className="form-control" id='priceText' placeholder="도토리개수를 입력하세요" onChange={changeValue} name="price" min="0" />
                        </div>
                        {showPrice && (<div><span className="text-danger">도토리는 0이상의 값이어야 합니다</span></div>)}


                        <div className="mt-3">
                            <label><h5>판매 상태</h5></label>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" id='itemStatus1' name="status" checked={item.status === 'visible'} onChange={changeValue} value="visible" />
                                <label className="form-check-label" htmlFor="itemStatus1">활성화</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" id='itemStatus2' name="status" onChange={changeValue} value="invisible" />
                                <label className="form-check-label" htmlFor="itemStatus2">비활성화</label>
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
                            <button type="submit" name='submitButton' className="btn btn-outline-dark">작성완료</button>
                        </div>
                    </form>
                </div>


                <div>
                        <div style={{display:'block', textAlign: 'center'}}>
                            <h3>이미지 미리보기</h3>
                            <div style={{ width: '250px', height: '250px', border: '1px solid black', display:'flex', justifyContent:'center',alignItems: 'center'}}>
                                {preview? <img src={preview} alt="Preview" style={{ width: 'auto', height: '200px' , textAlign:'center' }} /> : <div>미리보기 이미지</div>}
                            </div>
                            {showImg && (<div><span className="text-danger">이미지를 추가해주세요.</span></div>)}
                            <button style={{marginTop: '10px'}} className="btn btn-outline-dark" onClick={handleOpenFile}>파일선택</button>
                        </div>

                </div>
            </div>
        </>
    );
};

export default ItemUpload;