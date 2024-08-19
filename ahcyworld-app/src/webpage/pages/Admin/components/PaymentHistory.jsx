import React, { useEffect, useState } from "react";
import { getPaymentList } from "../../../../apis/auth";
import "../css/PaymentHistory.css";
import { Pagination } from "react-bootstrap";
import { BsSearch } from "react-icons/bs";

const PaymentHistory = () => {
    const [paymentList, setPaymentList] = useState([]);
    const [sortedPaymentList, setSortedPaymentList] = useState([]);
    const [sortOrder, setSortOrder] = useState("asc");
    const [sortBy, setSortBy] = useState("id");
    const [currentPage, setCurrentPage] = useState(1);
    const [paymentPerPage] = useState(20);
    const [pageRange] = useState(10);
    const [searchName, setSearchName] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);

    useEffect(() => {
        // paymentHistory 전체 리스트 불러오기
        const fetchPaymentList = async () => {
            try {
                const response = await getPaymentList();
                setPaymentList(response.data);
                setSortedPaymentList(response.data);
            } catch (error) {
                console.error("getPaymentList Error: ", error);
            }
        };

        fetchPaymentList();
    }, []);

    useEffect(() => {
        const listToSort = Array.isArray(filteredUsers) && filteredUsers.length > 0 ? filteredUsers : paymentList;

        sortPaymentList(sortOrder, sortBy, listToSort);
    }, [sortBy, sortOrder, paymentList, filteredUsers]);

    useEffect(() => {
        setCurrentPage(1);

    }, [sortBy, sortOrder, filteredUsers]);

    const sortPaymentList = (order, by, listToSort) => {
        if (!Array.isArray(listToSort)) {
            console.error("Expected listToSort to be an array.");
            return;
        }

        const paymentSort = [...listToSort].sort((a, b) => {
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
        sortPaymentList(newOrder, sortBy, filteredUsers.length > 0 ? filteredUsers : paymentList);
    };

    const handleSortByChange = (e) => {
        const newSortBy = e.target.value;
        setSortBy(newSortBy);
        sortPaymentList(sortOrder, newSortBy, filteredUsers.length > 0 ? filteredUsers : paymentList);
    };

    // 검색어 입력 핸들러
    const handleSearchChange = (e) => {
        setSearchName(e.target.value);
    };

    // 검색 버튼 클릭 시 필터링 적용
    const handleSearchClick = () => {
        const filteredData = sortedPaymentList.filter((user) =>
            user.user.username.toUpperCase().includes(searchName.toUpperCase())
        );

        setFilteredUsers(filteredData);
        sortPaymentList(sortOrder, sortBy, filteredData);
        setCurrentPage(1);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearchClick();
        }
    };

    // 페이지네이션 로직
    const indexOfLastUser = currentPage * paymentPerPage;
    const indexOfFirstUser = indexOfLastUser - paymentPerPage;
    const currentPayments =
        filteredUsers.length > 0
            ? sortedPaymentList.slice(indexOfFirstUser, indexOfLastUser)
            : sortedPaymentList.slice(indexOfFirstUser, indexOfLastUser);

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
                <div className='payment-option-box'>
                    <div className='payment-sort-box'>
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
                    <div className='payment-search-box'>
                        <input
                            type='text'
                            placeholder='Search by username'
                            value={searchName}
                            onChange={handleSearchChange}
                            onKeyDown={handleKeyDown}
                        />
                        <button type='button' onClick={handleSearchClick}>
                            <BsSearch />
                        </button>
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
                <Pagination className='user-pagination'>
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
