import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { SERVER_HOST } from "../../login/apis/api";
import "../css/GuestBookHome.css";

const GuestBookHome = () => {
    const [guestBook, setGeustBook] = useState([]);
    const [userName, setUserName] = useState(""); // 로그인한 사용자 이름
    const { hompyId } = useParams();

    useEffect(() => {
        const token = localStorage.getItem("token");
        // const fetchUserName = async () => {
        //     // 로그인한 사용자의 이름을 가져오는 요청
        //     try{
        //         const response = await axios.get(`${SERVER_HOST}/user/profile`, {
        //             headers: {
        //                 "Authorization" : `Bearer ${token}`
        //             }
        //         });
        //         setUserName(response.data.name);
        //     }catch(error){
        //         console.error("사용자의 정보를 가져오는데 실패했습니다.", error);
        //     }
        // };
        // fetchUserName();

        if (hompyId) {
            axios({
                method: "get",
                url: `${SERVER_HOST}/cyworld/cy/guestbook/list/${hompyId}`,
                // headers: {
                //     "Authorization": `Bearer ${token}`,
                // }
            })
                .then((response) => {
                    const { data, status } = response;
                    if (status === 200) {
                        console.log("방명록 불러오기 성공", data);
                        setGeustBook(data);
                    }
                })
                .catch((error) => {
                    console.error("방명록 불러오기 실패지롱....ㅜㅠㅜ", error);
                });
        } else {
            console.log("HompyId가 없습니다.");
        }
    }, [hompyId]);

    const handleDelete = (id) => {
        if (window.confirm("삭제하시겠습니까?")) {
            const token = localStorage.getItem("token");
            axios({
                method: "delete",
                url: `${SERVER_HOST}/cyworld/cy/guestbook/delete/${id}`,
                // headers: {
                //     "Authorization": `Bearer ${token}`,
                // },
                params: {
                    userName,
                },
            })
                .then((respone) => {
                    if (respone.status === 200) {
                        setGeustBook(guestBook.fill((e) => e.id !== id));
                    }
                })
                .catch((error) => {
                    console.error("삭제 실패", error);
                });
        }
    };

    const handleHide = (id) => {
        const token = localStorage.getItem("token");
        axios({
            method: "put",
            url: `${SERVER_HOST}/cyworld/cy/guestbook/hide/${id}`,
            // headers: {
            //     "Authorization": `Bearer ${token}`
            // },
            params: {
                username: userName,
            },
        })
            .then((response) => {
                if (response.status === 200) {
                    setGeustBook(
                        guestBook.map((guest) =>
                            guest.id === id
                                ? { ...guest, status: "invisible" }
                                : guest
                        )
                    );
                }
            })
            .catch((error) => {
                console.error("비밀글 설정 실패", error);
            });
    };

    return (
        <>
            <div className="guestbook-container">
            {guestBook.length > 0 ? (
                <Table className="guestbook-table">
                    <tbody>
                        {guestBook.map((guest, index) => (
                            <React.Fragment key={index}>
                                <tr>
                                    <td className="info-cell" colSpan="2">
                                        <div className="info-row">
                                            <div className="info">
                                                <span>No.{index + 1} {guest.user.name}{" "}</span>
                                                <span>({guest.createAt})</span>
                                            </div>
                                            <div className="actions">
                                                <span
                                                    className="secret"
                                                    onClick={() => handleHide(guest.id)}
                                                >
                                                    {guest.status === 'visible' ? '비밀로 하기' : '"'}
                                                </span>
                                                |
                                                <span
                                                    className="delete"
                                                    onClick={() => handleDelete(guest.id)}
                                                >
                                                    
                                                    삭제
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="minimi-cell">
                                        <img
                                            src={`${process.env.PUBLIC_URL}/image/${guest.hompy.minimiPicture}`}
                                            alt="Minimi"
                                            className="minimi-img"
                                        />
                                    </td>
                                    <td className="content-cell">
                                        {guest.status === "visible" && (
                                            <div className="content">
                                                {guest.content}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            </React.Fragment>
                        ))}
                    </tbody>
                </Table>
            ) : (
                <p>작성된 글이 없습니다.</p>
            )}
        </div>
        </>
    );
};

export default GuestBookHome;
