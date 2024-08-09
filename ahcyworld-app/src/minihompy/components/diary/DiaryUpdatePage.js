import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form, Container } from 'react-bootstrap';
import Layout from '../Layout/Layout';
import { LoginContext } from '../../../webpage/login/context/LoginContextProvider';
import Cookies from "js-cookie";
import { SERVER_HOST } from '../../../apis/api';

const DiaryUpdatePage = ({hompy}) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [diary, setDiary] = useState({
        id:"",
        hompy: "",
        keyWord: "",
        content: "",
        eventDate: ""
    });
    console.log("diaryId : ", id);
    const { userInfo, hompyInfo } = useContext(LoginContext);

    // 다이어리 정보를 가져오는 useEffect
    useEffect(() => {
        axios.get(`${SERVER_HOST}/cyworld/cy/diaries/detail/${id}`)
            .then(response => {
                setDiary(response.data);
            })
            .catch(error => {
                console.error("다이어리 데이터를 가져오지 못했습니다.", error);
            });
    }, [id]);

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
        const cookie = Cookies.get("accessToken");

        e.preventDefault();
        axios.put(`${SERVER_HOST}/cyworld/cy/diaries/update/${diary.id}/${userInfo.id}`, diary, {
            headers: {
                Authorization: `Bearer ${cookie}`
            }
        })
            .then(response => {
                console.log("폼 제출 됐엉", response.data);
                navigate(`/hompy/${hompyInfo.id}/diary`); // 수정 후 리스트 페이지로 이동
            })
            .catch(error => {
                console.error("폼 제출이 안 됐어...", error);
            });
    };

    return (
        <Layout hompy={hompy} user={hompy.user}>
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
                        <Button type="button" className="btn btn-secondary" onClick={() => navigate(`/hompy/${hompyInfo.id}/diary`)}>취소</Button>
                    </div>
                </Form>
            </div>
        </Container>
        </Layout>
    );
};

export default DiaryUpdatePage;
