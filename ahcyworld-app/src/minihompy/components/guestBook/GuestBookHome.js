import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import { useParams } from "react-router-dom";
import api, { SERVER_HOST } from "../../../apis/api";
import Layout from "../Layout/Layout";
import "../guestBook/css/GuestBookHome.css";
import Cookies from "js-cookie";
import { hompyInfo, userInfo } from "../../../apis/auth";
import { LoginContext } from "../../../webpage/components/login/context/LoginContextProvider";
import * as Swal from "../../../apis/alert";

const GuestBookHome = () => {
  const [guestBook, setGuestBook] = useState([]);
  const [userName, setUserName] = useState(""); // 로그인한 사용자 이름
  const [content, setContent] = useState(""); // 방명록 내용
  const [isSecret, setIsSecret] = useState(false); // 비밀글 여부
  const [isFriend, setIsFriend] = useState(false); // 일촌 관계 여부
  const [book, setBook] = useState(false);
  const { hompyId } = useParams();
  const [hompy, setHompy] = useState(""); // hompy 상태 설정

  const { hompyInfo, userInfo } = useContext(LoginContext);

  useEffect(() => {

    const cookie = Cookies.get("accessToken");

    // 로그인된 사용자 이름 설정
    setUserName(userInfo.username);

    const fetchHompy = async () => {
      try {
        const respone = await api.get(`${SERVER_HOST}/hompy/${hompyId}`, {
          headers: {
            Authorization: `Bearer ${cookie}`,
          },
        });
        setHompy(respone.data);

      } catch (error) {
        console.error("홈피 정보 불러오기 실패", error);
      }
    };

    const fetchGuestBook = async () => {
      if (userName) {
        try {
          const response = await api.get(
            `${SERVER_HOST}/cyworld/cy/guestbook/list/${hompyId}`,
            {
              headers: {
                Authorization: `Bearer ${cookie}`,
              },
              params: { username: userName },
            }
          );

          // 각 방명록 작성자에 대한 홈피 정보 요청
          const guestBookWithHompy = await Promise.all(
            response.data.map(async (entry) => {
              try {
                const hompyResponse = await api.get(
                  `${SERVER_HOST}/cyworld/cy/guestbook/user/hompy/${entry.user.id}`,
                  {
                    headers: {
                      Authorization: `Bearer ${cookie}`,
                    },
                  }
                );
                return {
                  ...entry,
                  user: {
                    ...entry.user,
                    homepage: hompyResponse.data,
                  },
                };
              } catch (error) {
                console.error(
                  `Failed to fetch hompy for user ${entry.user.id}`,
                  error
                );
                return entry; // 홈피 정보를 가져오지 못해도 기본 방명록 정보를 유지
              }
            })
          );

          setGuestBook(guestBookWithHompy);
  
        } catch (error) {
          console.error("방명록 불러오기 실패", error);
        }
      }
    };

    const checkFriendship = async () => {
      if (userName) {
        try {
          const response = await api.get(
            `${SERVER_HOST}/cyworld/cy/guestbook/friends/check/${hompyId}`,
            {
              headers: {
                Authorization: `Bearer ${cookie}`,
              },
              params: { username: userName },
            }
          );

          setIsFriend(response.data.isFriend);
        } catch (error) {
          console.error("일촌 관계 확인 실패", error);
        }
      }
    };

    if (hompyId) {
      fetchHompy();
      fetchGuestBook();
      checkFriendship();
      setBook(false);
    } else {
      console.error("HompyId가 없습니다.");
    }

  }, [hompyId, userName]);


  const handleDelete = async (id) => {
    if (window.confirm("삭제하시겠습니까?")) {
      const cookie = Cookies.get("accessToken");
      try {
        const response = await api.delete(
          `${SERVER_HOST}/cyworld/cy/guestbook/delete/${id}`,
          {
            headers: {
              Authorization: `Bearer ${cookie}`,
            },
            params: { username: userName },
          }
        );
        if (response.status === 200) {
          Swal.alert(
            "방명록 삭제 성공했습니다.",
            "방명록 삭제 성공",
            "success",
            () => {
              setGuestBook(guestBook.filter((e) => e.id !== id));
            }
          );
        }
      } catch (error) {
        Swal.alert(
          "방명록 삭제 실패했습니다.",
          "방명록 삭제 실패",
          "warning",
          () => {
            console.error("삭제 실패", error);
          }
        );
      }
    }
  };

  const handleHide = async (id) => {
    const cookie = Cookies.get("accessToken");
    try {
      const response = await api.put(
        `${SERVER_HOST}/cyworld/cy/guestbook/hide/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${cookie}`,
          },
          params: { username: userName },
        }
      );
      if (response.status === 200) {
        setGuestBook(
          guestBook.map((guest) =>
            guest.id === id ? { ...guest, status: "invisible" } : guest
          )
        );
        Swal.alert(
          "비밀글 설정에 성공했습니다",
          "비밀글 설정 성공",
          "success",
          () => {
            return;
          }
        );
      }
    } catch (error) {
      console.error("비밀글 설정 실패", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      window.alert("내용을 입력해주세요.");
      return;
    }

    const guestBookEntry = {
      content: content,
      status: isSecret ? "invisible" : "visible",
      user: userInfo,
      hompy: hompy,
      // guestBookName: "guestBook",
    };

    const cookie = Cookies.get("accessToken");
    try {
      const response = await api.post(
        `${SERVER_HOST}/cyworld/cy/guestbook/save`,
        guestBookEntry,
        {
          headers: {
            Authorization: `Bearer ${cookie}`,
          },
        }
      );
      if (response.status === 200) {
        setContent("");
        setIsSecret(false);
        setGuestBook([response.data, ...guestBook]);
        Swal.alert(
          "방명록 등록에 성공했습니다",
          "방명록 등록 성공",
          "success",
          () => {
            return;
          }
        );
      }
    } catch (error) {
      Swal.alert(
        "유저와 일촌 관계인지 확인하세요.",
        "방명록 등록 실패",
        "warning",
        () => {
          return;
        }
      );
      console.error("방명록 저장 실패", error);
    }
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleSecretChange = (e) => {
    setIsSecret(e.target.checked);
  };

  return (
    <>
      <Layout hompy={hompy} user={hompy.user}>
        <Container className="container">
          <Form onSubmit={handleSubmit} className="form-container">
            <Row className="form-row">
              <Col xs="auto">
                <img
                  src={`${process.env.PUBLIC_URL}/image/${
                    hompyInfo.minimiPicture || "default_img.png"
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
                  onChange={(e) => setContent(e.target.value)}
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
                  onChange={(e) => setIsSecret(e.target.checked)}
                  className="secret-checkbox"
                />
              </Col>
              <Col xs="auto">
                <button type="submit" className="submit-button">
                  확인
                </button>
              </Col>
            </Row>
          </Form>
          <hr />

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
                                No.{guestBook.length - index}
                                {guest.user.name}
                              </span>
                              <span>({guest.createAt})</span>
                            </div>
                            <div className="actions">
                              {guest.status === "visible" &&
                                guest.user.username === userName && (
                                  <span
                                    className="secret"
                                    onClick={() => handleHide(guest.id)}
                                  >
                                    비밀로 하기
                                  </span>
                                )}
                              {(guest.user.username === userName ||
                                hompyInfo.user.id === guest.user.id || hompyInfo.id === parseInt(hompyId)) && (
                                <span
                                  className="delete"
                                  onClick={() => handleDelete(guest.id)}
                                >
                                  삭제
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="minimi-cell">
                          <img
                            src={`${process.env.PUBLIC_URL}/image/${
                              guest.user.homepage?.minimiPicture ||
                              "default_img.png"
                            }`}
                            alt="Minimi"
                            className="minimi-img"
                          />
                        </td>
                        <td className="content-cell">
                          {(guest.status === "invisible" &&
                            guest.user.username !== userName &&
                            hompy.user.username !== userName && (
                              <div className="secret-message">
                                비밀글입니다. 작성자만 볼 수 있습니다.
                              </div>
                            )) || (
                            <div className="secret-message">
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
              <div className="guestbook-container">
                <h1>작성된 글이 없습니다.</h1>
              </div>
            )}
          </div>
        </Container>
      </Layout>
    </>
  );
};

export default GuestBookHome;
