import axios from "axios";
import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

const DiaryWritePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const selectedDate = location.state?.date || new Date();

    const [validated, setValidated] = useState(false);

    const [formData, setFormData] = useState({
        keyWord: "",
        content: "",
        eventDate: selectedDate,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
        } else {
            axios
                .post("http://localhost:8080/cyworld/cy/diaries/save", formData)
                .then((response) => {
                    console.log("Diary saved", response.data);
                    navigate("/list");
                })
                .catch((error) => {
                    console.error("Saving Error", error);
                });
        }
    };

    return (
        <>
            <div className="container d-flex justify-content-center align-items-center min-vh-100">
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
                                className="btn btn-primary me-2"
                            >
                                제출
                            </Button>
                            <Button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate("/list")}
                            >
                                취소
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
        </>
    );
};

export default DiaryWritePage;
