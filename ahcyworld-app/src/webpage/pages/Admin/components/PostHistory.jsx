import React, { useEffect, useState } from "react";
import { getUserInfoByUsername, getUserWriteHistory } from "../../../../apis/auth";
import "../css/PostHistory.css";
import Button from "react-bootstrap/esm/Button";
import { BsSearch } from "react-icons/bs";
import { RiHomeHeartLine } from "react-icons/ri";
import { Pagination } from "react-bootstrap";

const PostHistory = () => {
    const [userWriteHistory, setUserWriteHistory] = useState([]);
    const [sortedWriteHistory, setSortedWriteHistory] = useState([]);
    const [sortHistoryOrder, setSortHistoryOrder] = useState("desc");
    const [sortHistoryBy, setSortHistoryBy] = useState("date");
    const [searchName, setSearchName] = useState("");
    const [filteredUserWriteHistory, setFilteredUserWriteHistory] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [historyPerPage] = useState(10);
    const [pageRange] = useState(10);
    const [searchValue, setSearchValue] = useState("username");

    const searchChangeValue = (e) => {
        setSearchValue(e.target.value);
    };

    useEffect(() => {
        const fetchUserWriteHistory = async () => {
            try {
                const response = await getUserWriteHistory();
                
                // 각 historyItem에 대해 username 기반으로 user 정보를 가져옴
                const combinedHistory = await Promise.all(
                    response.data.map(async (historyItem) => {
                        const userResponse = await getUserInfoByUsername(historyItem.username);
                        const userInfo = userResponse.data || {}; // userResponse에서 데이터 가져오기

                        return {
                            ...historyItem,
                            userInfo,
                        };
                    })
                );

                setUserWriteHistory(combinedHistory);
                setFilteredUserWriteHistory(combinedHistory); // 초기 필터링 설정
            } catch (error) {
                console.error("getUserWriteHistory Error: ", error);
            }
        };
        fetchUserWriteHistory();
    }, []);

    useEffect(() => {
        sortHistories(sortHistoryOrder, sortHistoryBy, filteredUserWriteHistory);
    }, [sortHistoryOrder, sortHistoryBy, filteredUserWriteHistory]);

    const sortHistories = (order, by, data) => {
        const sortedUsers = [...data].sort((a, b) => {
            if (by === "date") {
                const dateA = new Date(a.createAt);
                const dateB = new Date(b.createAt);
                return order === "asc" ? dateA - dateB : dateB - dateA;
            }
            return 0;
        });
        setSortedWriteHistory(sortedUsers);
    };

    const handleSortOrderChange = (e) => {
        const newOrder = e.target.value;
        setSortHistoryOrder(newOrder);
    };

    const handleSortBy = (e) => {
        const newSortBy = e.target.value;
        setSortHistoryBy(newSortBy);
    };

    const handleSearchChange = (e) => {
        setSearchName(e.target.value);
    };

    const handleSearchClick = () => {
        if (searchValue === "username") {
            const filteredData = userWriteHistory.filter((history) =>
                history.username.includes(searchName.toUpperCase())
            );

            setFilteredUserWriteHistory(filteredData);
            setCurrentPage(1);
        } else if (searchValue === "subject") {
            const filteredData = userWriteHistory.filter((history) =>
                history.subject.includes(searchName.toUpperCase())
            );

            setFilteredUserWriteHistory(filteredData);
            setCurrentPage(1);
        } else if (searchValue === "content") {
            const filteredData = userWriteHistory.filter((history) =>
                history.content.includes(searchName.toUpperCase())
            );

            setFilteredUserWriteHistory(filteredData);
            setCurrentPage(1);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearchClick();
        }
    };

    const goMinihompy = (hompyId) => {
        window.open(
            `http://localhost:3000/hompy/${hompyId}`,
            "_blank",
            "width=800,height=600,menubar=no,toolbar=no,scrollbars=no,resizable=no"
        );
    };

    const indexOfLastHistory = currentPage * historyPerPage;
    const indexOfFirstHistory = indexOfLastHistory - historyPerPage;
    const currentHistories = sortedWriteHistory.slice(indexOfFirstHistory, indexOfLastHistory);

    const totalPages = Math.ceil(sortedWriteHistory.length / historyPerPage);

    const startPage = Math.max(1, currentPage - Math.floor(pageRange / 2));
    const endPage = Math.min(totalPages, startPage + pageRange - 1);

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }
    console.log(currentHistories);

    return (
        <>
            <div className='history-sort-box'>
                <div className='sorting-box'>
                    <label>
                        <input
                            type='radio'
                            name='sortHistoryBy'
                            value='date'
                            checked={sortHistoryBy === "date"}
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
                <div className='post-history-search'>
                    <select name='action' onChange={searchChangeValue}>
                        <option value={"username"}>아이디검색</option>
                        <option value={"subject"}>제목검색</option>
                        <option value={"content"}>내용검색</option>
                    </select>
                    <input
                        type='text'
                        placeholder='Search'
                        value={searchName}
                        onChange={handleSearchChange}
                        onKeyDown={handleKeyDown}
                    />
                    <button type='button' onClick={handleSearchClick}>
                        <BsSearch />
                    </button>
                </div>
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
                            <td className='history-name'>{history.userInfo.name}</td>
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
