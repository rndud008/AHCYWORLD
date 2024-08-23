import React, { useContext, useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "../../webpage/components/login/context/LoginContextProvider";
import { SERVER_HOST } from "../../apis/api";

const Hompy = ({ setUserId }) => {
    const { hompyId } = useParams();
    const [hompy, setHompy] = useState({});
    const {hompyInfo, userInfo} = useContext(LoginContext);

    useEffect(() => {
        axios
            .get(`${SERVER_HOST}/hompy/${hompyId}`)
            .then((response) => {
                setHompy(response.data);
            })
            .catch((error) => {
                console.error("에러: 데이터없음");
            });
    }, []);

    return (
        <>
        {/* // props 로 hompy 데이터 전달 */}
            <Layout hompy={hompy} user={hompy.user} />
        </>
    );
};

export default Hompy;
