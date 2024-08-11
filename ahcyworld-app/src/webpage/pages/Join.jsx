import React from "react";
import * as auth from "../../apis/auth";
import * as Swal from "../../apis/alert";

import { useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
import JoinForm from "./join/JoinForm"

const Join = () => {
    const navigate = useNavigate();

    const join = async (form) => {
        let response;

        try {
            response = await auth.join(form);
        } catch (error) {
            // console.log(`${error}`);
            // console.log(`회원 가입 요청중 에러가 발생했습니다.`);
            alert(error)
            return
        }

        const { data, status } = response;

        if (status === 200) {
            Swal.alert("회원가입 성공", "메인 화면으로 이동합니다.", "success", () => {
                navigate("/");
            });
        } else {
            Swal.alert("회원가입 실패", "회원가입에 실패하였습니다.", "error");
        }
    };

    return (
        <>
            <div>
                <JoinForm join={join} />
            </div>
        </>
    );
};

export default Join;
