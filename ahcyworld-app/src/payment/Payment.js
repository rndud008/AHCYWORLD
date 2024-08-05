import React, { useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { SERVER_HOST } from '../login/apis/api';


// login(localStorage.getItem('username'), localStorage.getItem('password'), localStorage.getItem('rememberId'));
const Payment = (user,acorns,navigatorFunction) => {
        
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
                buyer_name: user.name, // 구매자 id
                buyer_tel: user.tel, // 구매자 전화번호
                buyer_email:user.email, // 구매자 이메일
                };
            IMP.request_pay(data,async (response) =>  {
                // 결제 완료 후 콜백 함수
                const savePayment = await {
                    user: {...user},
                    merchantUid: data.merchant_uid,
                    impUid: response.imp_uid,
                    payment: acorns*10,
                    acornCnt: acorns*1,
                }
                if (response.success) {
                    console.log("결제 성공:", savePayment);
                    // 성공 시 처리 로직

                    axios({
                        method:"POST",
                        url: `${SERVER_HOST}/payment/save`,
                        headers: {"Content-Type": "application/json"},
                        data: JSON.stringify(savePayment),
                    }).then(response => {
                        const {data,status,error_msg} = response
                        if(status === 201){
                            window.alert("결제 되었습니다.")
                            navigatorFunction("/member");
                            
                        }else{
                            console.log("실패: "+error_msg);
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