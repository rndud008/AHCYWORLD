import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form, Container, Spinner } from 'react-bootstrap';
import Layout from '../Layout/Layout';
import Cookies from "js-cookie";
import api, { SERVER_HOST } from '../../../apis/api';
import { LoginContext } from '../../../webpage/components/login/context/LoginContextProvider';

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

    const [hompy, setHompy] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userInfo, hompyInfo } = useContext(LoginContext);

    const cookie = Cookies.get("accessToken");

    // 다이어리 정보를 가져오는 useEffect
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [hompyResponse, diaryResponse] = await Promise.all([
                    api.get(`${SERVER_HOST}/hompy/${hompyInfo.id}`, {
                        headers: {
                            Authorization: `Bearer ${cookie}`,
                        },
                    }),
                    api.get(`${SERVER_HOST}/cyworld/cy/diaries/detail/${id}`)
                ]);
    
                setHompy(hompyResponse.data);
                setDiary(diaryResponse.data);
            } catch (error) {
                console.error("데이터를 불러오는 데 실패했습니다.", error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    }, [id, hompyInfo.id, cookie]);

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

                navigate(`/hompy/${hompyInfo.id}/diary`); // 수정 후 리스트 페이지로 이동
            })
            .catch(error => {
                console.error("폼 제출이 안 됐어...", error);
            });
    };

    if (loading) {
        return <Spinner animation="border" />;
    }
    
    if (error) {
        return <p>데이터를 불러오는 중 오류가 발생했습니다.</p>;
    }

    return (
        <Layout hompy={hompy} user={hompy.user}>
        <div className="container d-flex justify-content-center align-items-center min-vh-80">
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
                        <Button type="submit" className="diarywriteok-btn">저장</Button>
                        <Button type="button" className="diarywriteno-btn" onClick={() => navigate(`/hompy/${hompyInfo.id}/diary`)}>취소</Button>
                    </div>
                </Form>
            </div>
        </div>
        </Layout>
    );
};

export default DiaryUpdatePage;
