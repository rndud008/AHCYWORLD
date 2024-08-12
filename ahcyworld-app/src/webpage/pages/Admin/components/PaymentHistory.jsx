import React, { useEffect, useState } from "react";
import { getPaymentList } from "../../../../apis/auth";
import "../css/PaymentHistory.css";

const PaymentHistory = () => {
    const [paymentList, setPaymentList] = useState([]);
    const [sortOrder, setSortOrder] = useState("asc");
    const [sortBy, setSortBy] = useState("id");

    useEffect(() => {
        // paymentHistory 전체 리스트 불러오기
        const fetchPaymentList = async () => {
            try {
                const response = await getPaymentList();
                setPaymentList(response.data);
            } catch (error) {
                console.error("getPaymentList Error: ", error);
            }
        };

        fetchPaymentList();
    }, []);

    useEffect(() => {
        sortPaymentList(sortOrder, sortBy);
    }, [sortBy, sortOrder]);

    const sortPaymentList = (order, by) => {
        const sortedPayments = [...paymentList].sort((a, b) => {
            const valueA = by === "payment" ? a.payment : a.id;
            const valueB = by === "payment" ? b.payment : b.id;

            if (order === "asc") {
                return valueA - valueB;
            } else {
                return valueB - valueA;
            }
        });
        setPaymentList(sortedPayments);
    };

    const handleSortOrderChange = (e) => {
        const newOrder = e.target.value;
        setSortOrder(newOrder);
        sortPaymentList(newOrder, sortBy);
    };

    const handleSortByChange = (e) => {
        const newSortBy = e.target.value;
        setSortBy(newSortBy);
        sortPaymentList(sortOrder, newSortBy);
    };

    return (
        <>
            <div className='payment-container'>
                <div className='sort-box'>
                    <div className='sort-controls'>
                        <label>
                            <input
                                type='radio'
                                name='sortBy'
                                value='id'
                                checked={sortBy === "id"}
                                onChange={handleSortByChange}
                            />
                            &nbsp;최신순
                        </label>
                        <label>
                            <input
                                type='radio'
                                name='sortBy'
                                value='payment'
                                checked={sortBy === "payment"}
                                onChange={handleSortByChange}
                            />
                            &nbsp;구매금액순
                        </label>

                        <label style={{ fontWeight: "bold" }}>|</label>

                        <label>
                            <input
                                type='radio'
                                name='sortOrder'
                                value='desc'
                                checked={sortOrder === "desc"}
                                onChange={handleSortOrderChange}
                            />
                            &nbsp;내림차순
                        </label>
                        <label>
                            <input
                                type='radio'
                                name='sortOrder'
                                value='asc'
                                checked={sortOrder === "asc"}
                                onChange={handleSortOrderChange}
                            />
                            &nbsp;오름차순
                        </label>
                    </div>
                </div>
                <table className='payment-table'>
                    <thead className='payment-thead'>
                        <tr>
                            <th>id</th>
                            <th>구매한 도토리</th>
                            <th>구매자</th>
                            <th>구매자 아이디</th>
                            <th>수령인</th>
                            <th>수령인 아이디</th>
                            <th>구매금액</th>
                            <th>결제날짜</th>
                        </tr>
                    </thead>
                    <tbody className='payment-tbody'>
                        {paymentList.map((payment) => (
                            <tr key={payment.id}>
                                <td>{payment.id}</td>
                                <td>{payment.acornCnt}</td>
                                <td>{payment.user.name}</td>
                                <td>{payment.user.username}</td>
                                <td>{payment.friendUser ? payment.friendUser.name : payment.user.name}</td>
                                <td>{payment.friendUser ? payment.friendUser.username : payment.user.username}</td>
                                <td>{payment.payment}</td>
                                <td>{payment.createAt}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default PaymentHistory;
