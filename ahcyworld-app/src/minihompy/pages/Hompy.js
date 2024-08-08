import React, { useContext, useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { useParams } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "../../webpage/login/context/LoginContextProvider";

const Hompy = ({ setUserId }) => {
    const { userId } = useParams();
    const [hompy, setHompy] = useState({});
    const {hompyInfo, userInfo} = useContext(LoginContext);

    // 특정 유저의 미니홈피 url 경로유지
    // useEffect(() => {
    //     setUserId(userId);
    // }, [userId, setUserId]);

    useEffect(() => {
        axios
            .get(`http://localhost:8070/hompy/${userId}`)
            .then((response) => {
                console.log("API Response:", response.data); // hompy 데이터 확인
                setHompy(response.data);
            })
            .catch((error) => {
                console.log("에러: 데이터없음");
            });
    }, []);

    return (
        // props 로 hompy 데이터 전달
        <Layout hompy={hompyInfo} user={hompyInfo.user} />
    );
};

export default Hompy;
