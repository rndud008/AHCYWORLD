import axios from "axios";
import React, { useContext, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { SERVER_HOST } from "../../../apis/api";
import * as Swal from "../../../apis/alert";
import Layout from "../Layout/Layout";
import moment from "moment";
import { LoginContext } from "../../../webpage/components/login/context/LoginContextProvider";
// import './css/DiaryWritePage.css';

const DiaryWritePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const selectedDate = location.state?.date || new Date();
    const { userInfo, hompyInfo } = useContext(LoginContext);

    const [validated, setValidated] = useState(false);

    const [formData, setFormData] = useState({
        keyWord: "",
        content: "",
        eventDate: moment(selectedDate).format("YYYY-MM-DD"),
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();  // 기본 동작 차단
        e.stopPropagation(); // 이벤트 전파 차단

        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            // 유효성 검사 실패
            setValidated(true);
        } else {
            // 유효성 검사 성공
            setValidated(false);  // 유효성 검사 성공 시, `validated` 상태를 false로 설정
            const requestData = {
                ...formData,
                // eventDate: moment(selectedDate).format("YYYY-MM-DD"),
                hompy: {
                    id: hompyInfo.id,
                    user: {
                        id: userInfo.id,
                    },
                },
            };
    
            axios
                .post(`${SERVER_HOST}/cyworld/cy/diaries/save`, requestData, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                .then((response) => {
                    Swal.alert("다이어리 저장이 완료되었습니다.", "다이어리 저장 성공", "success", () =>{

                        navigate(`/hompy/${hompyInfo.id}/diary`);
                    })
                })
                .catch((error) => {
                    console.error("다이어리 저장 실패", error);
                });
        }
    };

    return (
        <>
        <Layout hompy={hompyInfo} user={hompyInfo.user}>
            <div className="container d-flex justify-content-center align-items-center min-vh-80">
                <div className="w-50">
                    <h1 className="mb-4 text-center">다이어리 작성</h1>
                    <Form
                        noValidate
                        validated={validated}
                        onSubmit={handleSubmit}
                    >
                        <Form.Group className="mb-3" controlId="keyWord">
                            <Form.Label>제목</Form.Label>
                            <Form.Control
                                type="text"
                                name="keyWord"
                                value={formData.keyWord}
                                onChange={handleChange}
                                required
                                isInvalid={validated && !formData.keyWord}
                            />
                            <Form.Control.Feedback type="invalid">
                                제목은 필수 입력 항목입니다.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="content">
                            <Form.Label>내용</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={5}
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                required
                                isInvalid={validated && !formData.content}
                            />
                            <Form.Control.Feedback type="invalid">
                                내용은 필수 입력 항목입니다.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <div className="d-flex justify-content-end">
                            <Button
                                type="submit"
                                className="btn diarywirteok-btn"
                            >
                                작성
                            </Button>
                            <Button
                                type="button"
                                className="btn diarywriteno-btn"
                                onClick={() => navigate(`/hompy/${hompyInfo.id}/diary`)}
                            >
                                취소
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
            </Layout>
        </>
    );
};

export default DiaryWritePage;
