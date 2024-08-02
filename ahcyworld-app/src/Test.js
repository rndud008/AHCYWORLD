import axios from 'axios';
import { useState } from 'react';

const Test = () => {
    const [user,setUser] = useState();

    const onClickPayment = () => {
        const { IMP } = window;
        IMP.init('imp56251871');
        if(IMP){
            const data = {
                pg: 'html5_inicis', // PG사
                pay_method: "card", // 결제수단
                merchant_uid: `mid_${new Date().getTime()}`, // 주문번호
                amount: 10, // 결제금액
                name: '결제테스트', // 주문명
                buyer_name: '김세진', // 구매자 이름
                buyer_tel: '01011111111', // 구매자 전화번호
                buyer_email: "aaa@gmail.com", // 구매자 이메일
                };
            IMP.request_pay(data,(response) => {
                // 결제 완료 후 콜백 함수
                if (response.success) {
                    console.log("결제 성공:", response);
                    // 성공 시 처리 로직
                } else {
                    console.log("결제 실패:", response.error_msg);
                    // 실패 시 처리 로직
                }
            });
            }else{
                console.error('imp없음')
            }
    };

  return (
    <button onClick={onClickPayment}>결제하기</button>
  );
};

export default Test;