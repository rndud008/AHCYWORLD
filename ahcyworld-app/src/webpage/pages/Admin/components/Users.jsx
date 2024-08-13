import React, { useContext, useEffect, useState } from "react";
import { LoginContext } from "../../../components/login/context/LoginContextProvider";
import { Link, useNavigate } from "react-router-dom";
import { hompyList, resetHompy, userList } from "../../../../apis/auth";
import "../css/Users.css";
import Button from "react-bootstrap/esm/Button";
import { RiHomeHeartLine } from "react-icons/ri";

const Users = () => {
    const { isLogin, roles } = useContext(LoginContext);
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [sortUserOrder, setSortUserOrder] = useState("asc");
    const [sortUserBy, setSortUserBy] = useState("id");

    useEffect(() => {
        const getUserList = async () => {
            try {
                const response = await userList();
                // console.log("유저목록: ",response.data);
                setUsers(response.data);
            } catch (error) {
                console.error("userList Error: ", error);
            }
        };
        const getHompyList = async () => {
            try {
                const response = await hompyList();
                // console.log("홈피목록: ", response.data);
                const hompyData = response.data;

                setUsers((prevUsers) => {
                    return prevUsers.map((user) => {
                        const userHompy = hompyData.find((hompy) => hompy.user.id === user.id);
                        return {
                            ...user,
                            hompyId: userHompy ? userHompy.id : "",
                        };
                    });
                });
            } catch (error) {
                console.error("hompyList Error: ", error);
            }
        };
        getUserList();
        getHompyList();
    }, []);

    useEffect(() => {
        sortUsers(sortUserOrder, sortUserBy);
    }, [sortUserOrder, sortUserBy]);

    const sortUsers = (order, by) => {
        const sortedUsers = [...users].sort((a, b) => {
            if (order === "asc") {
                return a.id - b.id;
            } else {
                return b.id - a.id;
            }
        });
        setUsers(sortedUsers);
    };

    const handleSortOrderChange = (e) => {
        setSortUserOrder(e.target.value);
    };

    const handleSortBy = (e) => {
        setSortUserBy(e.target.value);
    };

    const resetMiniHompy = async (id) => {
        console.log("홈피아이디: ", id);
        try {
            if (!id) return;
            const response = await resetHompy(id);
        } catch (error) {
            console.error("resetHompy Error: ", error);
        }
    };

    const goMinihompy = (hompyId) => {
        // console.log("hompyID: ", hompyId);
        // 새로운 창을 고정된 사이즈로 엽니다.
        window.open(
            "http://localhost:3000/hompy/${hompyId}", // 열고 싶은 URL
            "_blank", // 새로운 창을 엽니다.
            "width=800,height=600,menubar=no,toolbar=no,scrollbars=no,resizable=no" // 창의 크기 설정
        );
    };

    return (
        <>
            <div className='sort-controls'>
                <label>
                    <input
                        type='radio'
                        name='sortUserBy'
                        value='id'
                        checked={sortUserBy === "id"}
                        onChange={handleSortBy}
                    />
                    &nbsp;최신순
                </label>
                <label style={{ fontWeight: "bold" }}>|</label>
                <label>
                    <input
                        type='radio'
                        name='sortUserOrder'
                        value='desc'
                        checked={sortUserOrder === "desc"}
                        onChange={handleSortOrderChange}
                    />
                    &nbsp;내림차순
                </label>
                <label>
                    <input
                        type='radio'
                        name='sortUserOrder'
                        value='asc'
                        checked={sortUserOrder === "asc"}
                        onChange={handleSortOrderChange}
                    />
                    &nbsp;오름차순
                </label>
            </div>
            <table className='users-table'>
                <thead className='users-thead'>
                    <tr>
                        <th>id</th>
                        <th>아이디</th>
                        <th>이름</th>
                        <th>이메일</th>
                        <th>생일</th>
                        <th>성별</th>
                        <th>도토리</th>
                        <th>가입날짜</th>
                        <th>미니홈피</th>
                    </tr>
                </thead>
                <tbody className='users-tbody'>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.birthDay}</td>
                            <td>{user.gender}</td>
                            <td>{user.acorn}</td>
                            <td>{user.createAt}</td>
                            <td className='hompy-btn-box'>
                                <Button
                                    variant='primary'
                                    className='minihompy-go'
                                    onClick={() => goMinihompy(user.hompyId)}
                                >
                                    <RiHomeHeartLine />
                                </Button>
                                <Button
                                    variant='danger'
                                    className='reset-btn'
                                    onClick={() => resetMiniHompy(user.hompyId)}
                                >
                                    reset
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default Users;
