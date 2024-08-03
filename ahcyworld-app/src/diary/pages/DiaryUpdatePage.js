import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form, Container } from 'react-bootstrap';

const DiaryUpdatePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [diary, setDiary] = useState({
        id:"",
        hompy: "",
        keyWord: "",
        content: "",
        eventDate: ""
    });

    // 다이어리 정보를 가져오는 useEffect
    useEffect(() => {
        axios.get(`http://localhost:8080/cyworld/cy/diaries/detail/${id}`)
            .then(response => {
                setDiary(response.data);
                // console.log("id:", id);
                // console.log("diary:", response.data);
            })
            .catch(error => {
                console.error("다이어리 데이터가 없어...", error);
                // console.log("id:", id);
            });
    }, []);

    // 입력값 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setDiary({
            ...diary,
            [name]: value
        });
    };
    

    // 폼 제출 핸들러
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:8080/cyworld/cy/diaries/update`, diary, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => {
                console.log("폼 제출 됐엉", response.data);
                navigate('/list'); // 수정 후 리스트 페이지로 이동
            })
            .catch(error => {
                console.error("폼 제출이 안 됐어...", error);
            });
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div className="w-50">
                <h1>다이어리 수정</h1>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formKeyword">
                        <Form.Label>제목</Form.Label>
                        <Form.Control
                            type="text"
                            name="keyWord"
                            value={diary.keyWord}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formContent">
                        <Form.Label>내용</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="content"
                            rows={5}
                            value={diary.content}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <div className="d-flex justify-content-end mt-3">
                        <Button type="submit" className="btn btn-primary me-2">저장</Button>
                        <Button type="button" className="btn btn-secondary" onClick={() => navigate('/list')}>취소</Button>
                    </div>
                </Form>
            </div>
        </Container>
    );
};

export default DiaryUpdatePage;
