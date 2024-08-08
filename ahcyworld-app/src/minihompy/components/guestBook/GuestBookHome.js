import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import { useParams } from "react-router-dom";
import api, { SERVER_HOST } from "../../../apis/api";
import "../guestBook/css/GuestBookHome.css";
import Cookies from 'js-cookie'
import Hompy from "../../pages/Hompy";

const GuestBookHome = () => {
    const [guestBook, setGuestBook] = useState([]);
    const [userName, setUserName] = useState(""); // 로그인한 사용자 이름
    const [content, setContent] = useState(""); // 방명록 내용
    const [isSecret, setIsSecret] = useState(false); // 비밀글 여부
    const [isFriend, setIsFriend] = useState(false);    // 일촌 관계 여부
    const { hompyId } = useParams();

    useEffect(() => {
        console.log("hompyId:", hompyId);
        const cookie = Cookies.get("accessToken")
        console.log("Cookie:", cookie);

        const fetchUserName = async () => {
            // 로그인한 사용자의 이름을 가져오는 요청
            try {
                const response = await api.get(`${SERVER_HOST}/user`, {
                    headers: {
                        'Authorization': `Bearer ${cookie}`,
                    },
                });
                setUserName(response.data.name);
            } catch (error) {
                console.error("사용자의 정보를 가져오는데 실패했습니다.", error);
            }
        };

        const checkFriendship = async (userName) => {
            try{
                const response = await api.get(`${SERVER_HOST}/cyworld/cy/guestbook/friends/check/${hompyId}`, {
                    headers: {
                        "Authorization" : `Bearer ${cookie}`
                    },
                    params: { username: userName }
                });
                console.log("response:", response);
                setIsFriend(response.data.isFriend)
            }catch(error) {
                console.error("일촌 관계 확인 실패", error)
            }
        };

        if (hompyId) {
            fetchUserName().then(() => {
                checkFriendship(userName)
            })
            axios({
                method: "get",
                url: `${SERVER_HOST}/cyworld/cy/guestbook/list/${hompyId}`,
                headers: {
                    "Authorization": `Bearer ${cookie}`,
                }
            })
                .then((response) => {
                    const { data, status } = response;
                    if (status === 200) {
                        console.log("방명록 불러오기 성공", data);
                        setGuestBook(data);
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
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                params: {
                    userName,
                },
            })
                .then((respone) => {
                    if (respone.status === 200) {
                        setGuestBook(guestBook.filter((e) => e.id !== id));
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
            headers: {
                "Authorization": `Bearer ${token}`
            },
            params: {
                username: userName,
            },
        })
            .then((response) => {
                if (response.status === 200) {
                    setGuestBook(
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

    const handleSubmit = (e) => {
        e.preventDefault();

        if(!content.trim()){
            window.alert("내용을 입력해주세요.")
            return;
        }

        const guestBookEntry = {
            content: content,
            status: isSecret ? "invisible" : "visible",
        };

        axios({
            method: "post",
            url: `${SERVER_HOST}/cyworld/cy/guestbook/save`,
            data: guestBookEntry,
        })
            .then((response) => {
                const { data, status } = response;
                if (status === 200) {
                    setGuestBook(data);
                    console.log("방명록 저장 성공", data);
                }
            })
            .catch((error) => {
                console.error("방명록 저장 실패", error);
            });
    };

    const handleContentChange = (e) => {
        setContent(e.target.value);
    };

    const handleSecretChange = (e) => {
        setIsSecret(e.target.checked);
    };

    return (
        <>
        <Hompy>
            <Container className="container">
            <Form onSubmit={handleSubmit} className="form-container">
                <Row className="form-row">
                    <Col xs="auto">
                        <img
                            src={`${process.env.PUBLIC_URL}/image/${
                                guestBook.length > 0
                                    ? guestBook[0].hompy.minimiPicture
                                    : "default_img.png"
                            }`}
                            alt="Minimi"
                            className="minimi-img"
                        />
                    </Col>
                    <Col>
                        <Form.Control
                            as="textarea"
                            placeholder="방명록에 내용을 작성하세요"
                            value={content}
                            onChange={handleContentChange}
                            required
                            rows={4}
                            className="custom-textarea"
                        />
                    </Col>
                </Row>
                <Row className="button-row">
                    <Col xs="auto">
                        <Form.Check
                            type="checkbox"
                            id="secret-checkbox"
                            label="비밀로 하기"
                            checked={isSecret}
                            onChange={handleSecretChange}
                            className="secret-checkbox"
                        />
                    </Col>
                    <Col xs="auto">
                        <Button type="submit" className="submit-button">
                            확인
                        </Button>
                    </Col>
                </Row>
            </Form>

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
                                                    <span>
                                                        No.{index + 1} {guest.user.name}
                                                    </span>
                                                    <span> ({guest.createAt})</span>
                                                </div>
                                                <div className="actions">
                                                    <span
                                                        className="secret"
                                                        onClick={() => handleHide(guest.id)}
                                                    >
                                                        {guest.status === "visible"
                                                            ? "비밀로 하기 |"
                                                            : '"'}
                                                    </span>
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
                                            {(guest.status === "visible" || guest.user.name === userName) && (
                                                <div className="content">
                                                    {guest.content}
                                                </div>
                                            )}
                                            {(guest.status === "invisible" && guest.user.name !== userName) && (
                                                <div className="secret-message">
                                                    비밀글입니다. 작성자만 볼 수 있습니다.
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </Table>
                ) : (
                    <div className="guestbook-container"><h1>작성된 글이 없습니다.</h1></div>
                )}
            </div>
        </Container>
        </Hompy>
        </>
    );
};

export default GuestBookHome;
