import React, { useEffect, useState } from 'react';
import { SERVER_HOST } from '../../../apis/api';
import { Navigate, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import '../css/AcornPayModal.css';
import { itemconfirm, alert } from '../../../apis/alert';
import { userInfo } from '../../../apis/auth';
import PaymentModal from '../../payment/PaymentModal';
import acorn from "../../../upload/acorn.png";

const AcornPayModal = ({ isOpen, onClose, selectItem, totalAcorn, hompyInfo, userInfo, setIsDelete, setTotalAcorn }) => {
    const [payItems, setPayItems] = useState([])
    const navigate = useNavigate();
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    const paymentopenModal = () => {
        setIsPaymentModalOpen(true);
    };

    const paymentcloseModal = () => {
        setIsPaymentModalOpen(false);
    };
    useEffect(() => {
        if (isOpen) {
            const params = new URLSearchParams();
            let updateAcorn = 0;
            
            selectItem.forEach(item => params.append('itemList', item));
            axios({
                method: 'GET',
                url: `${SERVER_HOST}/cart/itemcheck`,
                headers: {
                    'Content-Type': 'application/json'
                },
                params: params,
            }).then((response) => {
                const { data, status } = response;
                if (status === 200) {
                    setPayItems(data);
                }
            });
        }
    }, [isOpen])

    if (!isOpen) {
        return null;
    }

    const payedItem = () => {

        if (selectItem.length === 0) {
            alert("주의", "구매할 아이템이 없습니다.", "warning", () => onClose)
        } else {
            if (userInfo.acorn >= totalAcorn) {
                axios({
                    method: 'POST',
                    url: `${SERVER_HOST}/cart/payed/item`,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify(selectItem),
                    params: {
                        id: userInfo.id,
                        totalAcorn: totalAcorn,
                    }
                }).then((response) => {
                    const { data, status } = response;
                    if (status === 200) {
                        itemconfirm("구매 성공", "미니홈피로 이동하시겠습니까?", "success", () => navigate(`/hompy/${hompyInfo.id}`), ()=>{setIsDelete(true); setTotalAcorn(0); onClose();})
                    }
                });
            } else {
                itemconfirm("구매 실패", "도토리가 부족합니다 충전하시겠습니까?", "warning", () => {
                    paymentopenModal();
                }, onClose)
            }

        }
    }

    const alertPayed = () => {
        itemconfirm("상품 구매", "구매하시겠습니까?", "question", () => payedItem(), onClose)
    }

    return (
        <div className='acornpay-modal-overlay'>
            <div className='acornpay-modal-content'>
                <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
                    <h2>결제</h2>

                    <div style={{ marginTop: '10px', border: '1px solid #ddd', padding: '10px' }}>

                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <div>상품정보</div>
                            <div style={{ marginLeft: 'auto' }}>상품금액</div>
                        </div>
                        <hr />
                        <div style={{ width: 400, height: 400, overflowY: 'auto' }}>

                            {payItems.map((payitem) => (

                                <div key={payitem.id} style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
                                    {payitem.item.itemType === "글꼴" ? (
                                        <input
                                            className='fontStyle'
                                            type='text'
                                            style={{ fontFamily: `${payitem.item.sourceName}, cursive`, fontSize: 50, width: 100, height: 100 }}
                                            defaultValue='AhCyWorld'
                                            readOnly
                                        />
                                    ) : payitem.item.itemType === "배경음악" ? (
                                        <img className="itemImg" src={payitem.item.bgmImg} style={{ width: 100, height: 100 }} alt='' />
                                    ) : (
                                        <img
                                            className="itemImg"
                                            src={`${process.env.PUBLIC_URL}/image/${payitem.item.fileName}`}
                                            style={{ width: 100, height: 100 }} alt=''
                                        />
                                    )}
                                    <div style={{ flex: 1, marginLeft: '10px' }}>
                                        <div>{payitem.item.itemName}</div>
                                        <div style={{ color: '#888' }}>{payitem.item.itemType}</div>
                                    </div>
                                    <div style={{ width: '100px', textAlign: 'right' }}>{payitem.item.price} <img style={{ width: 15, height: 15 }} src={acorn} alt=''></img></div>
                                </div>

                            ))}
                        </div>
                        <div style={{ textAlign: 'right', marginTop: '10px' }}><hr />
                            <div style={{}}>내 보유도토리: {userInfo.acorn} <img style={{ width: 15, height: 15 }} src={acorn} alt=''></img></div>
                            <div>총 상품도토리: {totalAcorn} <img style={{ width: 15, height: 15 }} src={acorn} alt=''></img></div>
                            <hr />
                            <div>잔여 도토리: {(userInfo.acorn - totalAcorn)} <img style={{ width: 15, height: 15 }} src={acorn} alt=''></img></div>
                            <div></div>
                        </div>
                    </div>
                    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                        <button className='paymodal-close-btn' onClick={onClose}>취소</button>
                        <button className='paymodal-add-btn' onClick={() => alertPayed()}>결제</button>
                    </div>
                    <PaymentModal isOpen={isPaymentModalOpen} onClose={paymentcloseModal} />
                </div>
            </div>
        </div>
    );
}

export default AcornPayModal;