import React, { useEffect, useState } from "react";
import { getPaymentList } from "../../../../apis/auth";
import "../css/PaymentHistory.css";
import { Pagination } from "react-bootstrap";

const PaymentHistory = () => {
    const [paymentList, setPaymentList] = useState([]);
    const [sortedPaymentList, setSortedPaymentList] = useState([]);
    const [sortOrder, setSortOrder] = useState("asc");
    const [sortBy, setSortBy] = useState("id");
    const [currentPage, setCurrentPage] = useState(1);
    const [paymentPerPage] = useState(20);
    const [pageRange] = useState(10);

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
    }, [sortBy, sortOrder, paymentList]);

    const sortPaymentList = (order, by) => {
        const paymentSort = [...paymentList].sort((a, b) => {
            const valueA = by === "payment" ? a.payment : a.id;
            const valueB = by === "payment" ? b.payment : b.id;

            if (order === "asc") {
                return valueA - valueB;
            } else {
                return valueB - valueA;
            }
        });
        setSortedPaymentList(paymentSort);
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

        // 페이지네이션 로직
        const indexOfLastUser = currentPage * paymentPerPage;
        const indexOfFirstUser = indexOfLastUser - paymentPerPage;
        const currentPayments = sortedPaymentList.slice(indexOfFirstUser, indexOfLastUser);
    
        // 전체 페이지 수 계산
        const totalPages = Math.ceil(sortedPaymentList.length / paymentPerPage);
    
        // 현재 페이지를 기준으로 페이지 범위 계산
        const startPage = Math.max(1, currentPage - Math.floor(pageRange / 2));
        const endPage = Math.min(totalPages, startPage + pageRange - 1);
    
        // 페이지 번호 배열 생성
        const pageNumbers = [];
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

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
                        {currentPayments.map((payment) => (
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
            <div className='user-pagination-box'>
                <Pagination className="user-pagination">
                    <Pagination.Prev
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    />
                    {pageNumbers.map((number) => (
                        <Pagination.Item
                            key={number}
                            active={number === currentPage}
                            onClick={() => setCurrentPage(number)}
                        >
                            {number}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    />
                </Pagination>
            </div>
        </>
    );
};

export default PaymentHistory;
