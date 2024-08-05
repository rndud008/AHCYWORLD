import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';


    const Payment = (user,acorns) => {
        console.log(user);

        const { IMP } = window;
        IMP.init('imp56251871');
        if(IMP){
            const data = {
                pg: 'html5_inicis', // PG사
                pay_method: "card", // 결제수단
                merchant_uid: `mid_${new Date().getTime()}`, // 주문번호
                amount: acorns*10, // 결제금액
                name: `도토리 결제: ${acorns}`, // 주문명
                buyer_name: `${user.name}`, // 구매자 id
                buyer_tel: `${user.tel}`, // 구매자 전화번호
                buyer_email: `${user.email}`, // 구매자 이메일
                };
            IMP.request_pay(data,(response) => {
                // 결제 완료 후 콜백 함수
                if (response.success) {
                    console.log("결제 성공:", response);
                    // 성공 시 처리 로직
                    const savePayment = {
                        user: `${user}`,
                        friendUser: 'null',
                        merchantUid: `${data.merchant_uid}`,
                        impUid: `${response.impUid}`,
                        payment: `${data.amount}`,
                        acornCnt: `${acorns}`,
                    }

                    axios({
                        get:'post',
                        url: 'http://localhost:8070/payment/save',
                        headers: {
                            "Content-Type":"application/json",
                        },
                        data: JSON.stringify(savePayment),
                    }).then(response => {
                        const {data,status,error_msg} = response
                        if(status === 201){
                            console.log('저장성공!!!!!!!!!')
                        }else{
                            console.log(error_msg);
                        }
                    });
                    
                } else {
                    console.log("결제 실패:", response.error_msg);
                    // 실패 시 처리 로직
                }
            });
            }else{
                console.error('imp없음')
            }
    };
export default Payment;