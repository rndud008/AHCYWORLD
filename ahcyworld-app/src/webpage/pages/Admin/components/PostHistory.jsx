import React, { useEffect, useState } from "react";
import { getUserWriteHistory } from "../../../../apis/auth";
import "../css/PostHistory.css";
import Button from "react-bootstrap/esm/Button";
import { BsSearch } from "react-icons/bs";
import { RiHomeHeartLine } from "react-icons/ri";

const PostHistory = () => {
    const [userWriteHistory, setUserWriteHistory] = useState([]);
    const [sortHistoryOrder, setSortHistoryOrder] = useState("asc");
    const [sortHistoryBy, setSortHistoryBy] = useState("id");
    const [searchName, setSearchName] = useState("");
    const [filteredUserWriteHistory, setFilteredUserWriteHistory] = useState([]);

    const fetchUserWriteHistory = async () => {
        try {
            const response = await getUserWriteHistory();
            setUserWriteHistory(response.data);
            setFilteredUserWriteHistory(response.data); // 초기 필터링
        } catch (error) {
            console.error("getUserWriteHistory Error: ", error);
        }
    };

    useEffect(() => {
        fetchUserWriteHistory();
    }, []);

    const sortHistories = (order, by) => {
        // console.log(filteredUserWriteHistory);
        const sortedUsers = [...filteredUserWriteHistory].sort((a, b) => {
            if (by === "id") {
                return order === "asc" ? a.id - b.id : b.id - a.id;
            }
            // 다른 정렬 기준이 필요하면 여기에 추가
            return 0;
        });
        setFilteredUserWriteHistory(sortedUsers);
    };

    useEffect(() => {
        sortHistories(sortHistoryOrder, sortHistoryBy);
    }, [sortHistoryOrder, sortHistoryBy]);

    const handleSortOrderChange = (e) => {
        setSortHistoryOrder(e.target.value);
    };

    const handleSortBy = (e) => {
        setSortHistoryBy(e.target.value);
    };

    const handleSearchChange = (e) => {
        // console.log(e.target.value);
        setSearchName(e.target.value);
    };

    const handleSearchClick = () => {
        // console.log(searchName);
        // 검색 필터링 적용
        const filteredData = userWriteHistory.filter((history) => history.username.includes(searchName.toUpperCase()));
        setFilteredUserWriteHistory(filteredData);

        // console.log("filteredData", filteredData);
    };

    const goMinihompy = (hompyId) => {
        window.open(
            `http://localhost:3000/hompy/${hompyId}`, // 템플릿 리터럴 수정
            "_blank",
            "width=800,height=600,menubar=no,toolbar=no,scrollbars=no,resizable=no"
        );
    };

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
                    <button onClick={handleSearchClick}>
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
                    {filteredUserWriteHistory.map((history) => (
                        <tr key={history.id}>
                            <td>{history.id}</td>
                            <td>{history.username}</td>
                            <td>{history.hompy.user.name}</td>
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
        </>
    );
};

export default PostHistory;
