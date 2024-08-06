import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { useParams } from "react-router-dom";
import axios from "axios";

const Home = ({ setUserId }) => {
    const { userId } = useParams();
    const [hompy, setHompy] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

    // 특정 유저의 미니홈피 url 경로유지
    useEffect(() => {
        setUserId(userId);
    }, [userId, setUserId]);

    useEffect(() => {
        axios
            .get(`http://localhost:8070/hompy/${userId}`)
            .then((response) => {
                // console.log("API Response:", response.data); // hompy 데이터 확인
                setHompy(response.data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.log("에러: 데이터없음");
                setIsLoading(false);
            });
    }, [userId]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!hompy) {
        return <div>Hompy data not found</div>;
    }

    return (
        // props 로 hompy 데이터 전달
        <Layout hompy={hompy} user={hompy.user} />
    );
};

export default Home;
