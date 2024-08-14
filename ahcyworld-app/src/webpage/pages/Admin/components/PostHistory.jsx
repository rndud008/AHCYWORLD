import React, { useEffect, useState } from "react";
import { getUserWriteHistory } from "../../../../apis/auth";
import "../css/PostHistory.css";
import Button from "react-bootstrap/esm/Button";
import { BsSearch } from "react-icons/bs";
import { RiHomeHeartLine } from "react-icons/ri";
import { Pagination } from "react-bootstrap";

const PostHistory = () => {
    // 상태 변수 정의
    const [userWriteHistory, setUserWriteHistory] = useState([]);
    const [sortedWriteHistory, setSortedWriteHistory] = useState([]);
    const [sortHistoryOrder, setSortHistoryOrder] = useState("asc");
    const [sortHistoryBy, setSortHistoryBy] = useState("id");
    const [searchName, setSearchName] = useState("");
    const [filteredUserWriteHistory, setFilteredUserWriteHistory] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [historyPerPage] = useState(10);
    const [pageRange] = useState(10);

    // 컴포넌트 마운트 시 사용자 작성 기록을 가져옵니다.
    useEffect(() => {
        const fetchUserWriteHistory = async () => {
            try {
                const response = await getUserWriteHistory();
                setUserWriteHistory(response.data);
                setFilteredUserWriteHistory(response.data); // 초기 필터링 설정
            } catch (error) {
                console.error("getUserWriteHistory Error: ", error);
            }
        };
        fetchUserWriteHistory();
    }, []);

    // 정렬 기준과 순서에 따라 작성 기록을 정렬합니다.
    useEffect(() => {
        sortHistories(sortHistoryOrder, sortHistoryBy, filteredUserWriteHistory);
    }, [sortHistoryOrder, sortHistoryBy, filteredUserWriteHistory]);

    // 작성 기록을 정렬합니다.
    const sortHistories = (order, by, data) => {
        const sortedUsers = [...data].sort((a, b) => {
            if (by === "id") {
                return order === "asc" ? a.id - b.id : b.id - a.id;
            }
            // 다른 정렬 기준이 필요하면 여기에 추가
            return 0;
        });
        setSortedWriteHistory(sortedUsers);
    };

    // 정렬 순서 변경 핸들러
    const handleSortOrderChange = (e) => {
        const newOrder = e.target.value;
        setSortHistoryOrder(newOrder);
    };

    // 정렬 기준 변경 핸들러
    const handleSortBy = (e) => {
        const newSortBy = e.target.value;
        setSortHistoryBy(newSortBy);
    };

    // 검색어 입력 핸들러
    const handleSearchChange = (e) => {
        setSearchName(e.target.value);
    };

    // 검색 버튼 클릭 시 필터링 적용
    const handleSearchClick = () => {
        // 검색어를 기준으로 사용자 작성 기록을 필터링합니다.
        const filteredData = userWriteHistory.filter((history) =>
            history.username.includes(searchName.toUpperCase())
        );
        setFilteredUserWriteHistory(filteredData);
        setCurrentPage(1); // 검색 후 페이지를 첫 페이지로 설정
    };

    // 미니홈피 페이지 열기
    const goMinihompy = (hompyId) => {
        window.open(
            `http://localhost:3000/hompy/${hompyId}`, // 미니홈피 URL
            "_blank",
            "width=800,height=600,menubar=no,toolbar=no,scrollbars=no,resizable=no"
        );
    };

    // 페이지네이션 로직
    const indexOfLastHistory = currentPage * historyPerPage;
    const indexOfFirstHistory = indexOfLastHistory - historyPerPage;
    const currentHistories = sortedWriteHistory.slice(indexOfFirstHistory, indexOfLastHistory);

    // 전체 페이지 수 계산
    const totalPages = Math.ceil(sortedWriteHistory.length / historyPerPage);

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
            <div className='history-sort-box'>
                <div className='sorting-box'>
                    <label>
                        <input
                            type='radio'
                            name='sortHistoryBy'
                            value='id'
                            checked={sortHistoryBy === "id"}
                            onChange={handleSortBy}
                        />
                        &nbsp;최신순
                    </label>
                    <label style={{ fontWeight: "bold" }}>|</label>
                    <label>
                        <input
                            type='radio'
                            name='sortHistoryOrder'
                            value='desc'
                            checked={sortHistoryOrder === "desc"}
                            onChange={handleSortOrderChange}
                        />
                        &nbsp;내림차순
                    </label>
                    <label>
                        <input
                            type='radio'
                            name='sortHistoryOrder'
                            value='asc'
                            checked={sortHistoryOrder === "asc"}
                            onChange={handleSortOrderChange}
                        />
                        &nbsp;오름차순
                    </label>
                </div>
                <form className='search-form'>
                    <input
                        type='text'
                        placeholder='Search by username'
                        value={searchName}
                        onChange={handleSearchChange}
                    />
                    <button type='button' onClick={handleSearchClick}>
                        <BsSearch />
                    </button>
                </form>
            </div>
            <table className='post-table'>
                <thead className='post-thead'>
                    <tr>
                        <th>id</th>
                        <th>아이디</th>
                        <th>이름</th>
                        <th className='th-post-type'>게시판이름</th>
                        <th>제목</th>
                        <th>내용</th>
                        <th>상태</th>
                        <th>작성일</th>
                        <th>미니홈피</th>
                    </tr>
                </thead>
                <tbody className='post-tbody'>
                    {currentHistories.map((history) => (
                        <tr key={history.id}>
                            <td>{history.id}</td>
                            <td>{history.username}</td>
                            <td className="history-name">{history.hompy.user.name}</td>
                            <td className='post-type'>{history.postType}</td>
                            <td className='subject'>{history.subject}</td>
                            <td>{history.content}</td>
                            <td>{history.status}</td>
                            <td>{history.createAt}</td>
                            <td className='hompy-box'>
                                <Button
                                    variant='primary'
                                    className='minihompy'
                                    onClick={() => goMinihompy(history.hompy.id)}
                                >
                                    <RiHomeHeartLine />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className='write-history-pagination'>
                <Pagination className='pagination'>
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

export default PostHistory;
