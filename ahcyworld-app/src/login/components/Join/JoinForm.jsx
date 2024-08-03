import React, { useState } from "react";
import { Button } from "react-bootstrap";
// import "./JoinForm.css";
import "./JoinForm.css";
import styled from "styled-components";
import { checkUsernameAvailable, checkEmailAvailable } from "../../apis/auth";
// import * as Swal from "../apis/alert";

const StyledBox = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const JoinForm = ({ join }) => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        name: "",
        email: "",
        gender: "",
        birthDay: "",
    });

    const [successMessages, setSuccessMessages] = useState({
        username: "",
        email: "",
    });

    const [errors, setErrors] = useState({
        username: "",
        password: "",
        name: "",
        email: "",
        gender: "",
        birthDay: "",
    });

    const onChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=).{8,16}$/;
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    const onJoin = (e) => {
        e.preventDefault();

        const { username, password, email, name, gender, birthDay } = formData;

        console.log("입력값: ", username, password, name, email, gender, birthDay);

        const validate = () => {
            const newErrors = {};
            let hasError = false;

            if (!username) {
                newErrors.username = "아이디를 입력해주세요.";
                hasError = true;
            } else if (!successMessages.username) {
                newErrors.username = "아이디 중복검사를 진행하세요.";
                hasError = true;
            }
            if (!password) {
                newErrors.password = "비밀번호를 입력해주세요.";
                hasError = true;
            } else if (!passwordRegex.test(password)) {
                newErrors.password = "형식에 맞는 비밀번호를 입력해주세요.";
                hasError = true;
            }
            if (!name) {
                newErrors.name = "이름을 입력해주세요.";
                hasError = true;
            }
            if (!email) {
                newErrors.email = "이메일을 입력해주세요.";
                hasError = true;
            } else if (!emailRegex.test(email)) {
                newErrors.email = "형식에 맞는 이메일을 입력해주세요.";
                hasError = true;
            } else if (!successMessages.email) {
                newErrors.email = "이메일 중복검사를 진행하세요.";
                hasError = true;
            }
            if (!gender) {
                newErrors.gender = "성별을 입력해주세요.";
                hasError = true;
            }

            if (!birthDay) {
                newErrors.birthDay = "생일을 입력해주세요.";
                hasError = true;
            }

            if (newErrors.username) {
                setSuccessMessages((message) => ({
                    ...message,
                    username: "",
                }));
            } else if (newErrors.email) {
                setSuccessMessages((message) => ({
                    ...message,
                    email: "",
                }));
            }

            setErrors(newErrors);
            return hasError;
        };

        const hasErrors = validate();
        if (!hasErrors) {
            join({ username, password, email, name, gender, birthDay });
        }
    };

    const [usernameAvailable, setUsernameAvailable] = useState(true);

    const [emailAvailable, setemailAvailable] = useState(true);

    const checkUsername = async () => {
        setErrors((error) => ({
            ...error,
            username: "",
        }));

        setSuccessMessages((message) => ({
            ...message,
            username: "",
        }));
        const newErrors = {};
        let hasError = false;

        const { username } = formData;

        if (!username) {
            newErrors.username = "아이디를 입력해주세요.";
            hasError = true;

            setErrors(newErrors);
            return hasError;
        }

        try {
            const response = await checkUsernameAvailable(username);
            if (response.data.available) {
                setUsernameAvailable(true);
                setSuccessMessages((message) => ({
                    ...message,
                    username: "사용 가능한 아이디 입니다.",
                }));
            } else {
                setUsernameAvailable(false);
                newErrors.username = "이미 존재하는 아이디입니다.";
                hasError = true;

                setErrors(newErrors);
                return hasError;
            }
        } catch (error) {
            console.error("오류: ", error);
        }
    };

    const checkEmail = async () => {
        setErrors((error) => ({
            ...error,
            email: "",
        }));

        setSuccessMessages((message) => ({
            ...message,
            email: "",
        }));

        const newErrors = {};
        let hasError = false;

        const { email } = formData;
        if (!email) {
            newErrors.email = "이메일을 입력해주세요.";
            hasError = true;

            setErrors(newErrors);
            return hasError;
        } else if (!emailRegex.test(email)) {
            newErrors.email = "형식에 맞는 이메일을 입력해주세요.";
            hasError = true;

            setErrors(newErrors);
            return hasError;
        }

        try {
            const response = await checkEmailAvailable(email);
            if (response.data.available) {
                setemailAvailable(true);
                setSuccessMessages((message) => ({
                    ...message,
                    email: "사용 가능한 이메일입니다.",
                }));
            } else {
                setemailAvailable(false);
                newErrors.email = "이미 사용중인 이메일 입니다.";
                hasError = true;

                setErrors(newErrors);
                return hasError;
            }
        } catch (error) {
            console.error("오류: ", error);
        }
    };

    return (
        <div className='form'>
            <h1 className='login-title'>AhcyWorld</h1>

            <form className='login-form' onSubmit={(e) => onJoin(e)}>
                <div className='id-box'>
                    <label htmlFor='username'>아이디</label>
                    <StyledBox>
                        <input
                            id='username'
                            type='text'
                            placeholder='Username'
                            name='username'
                            autoComplete='username'
                            onChange={onChange}
                        />
                        <Button onClick={checkUsername}>중복확인</Button>
                    </StyledBox>
                </div>
                <div className='text-success'>{successMessages.username}</div>
                <div className='text-danger'>{errors.username}</div>

                <div>
                    <label htmlFor='password'>비밀번호</label>
                    <input
                        id='password'
                        type='password'
                        placeholder='Password'
                        name='password'
                        autoComplete='current-password'
                        onChange={onChange}
                    />
                    <br />
                    <small style={{ color: "gray", marginLeft: "20px" }}>영문자+숫자+특수문자 조합 8~16글자</small>
                    <div className='text-danger'>{errors.password}</div>
                </div>

                <div>
                    <label htmlFor='name'>이름</label>
                    <input
                        id='name'
                        type='text'
                        placeholder='Name'
                        name='name'
                        autoComplete='name'
                        onChange={onChange}
                    />
                    <div className='text-danger'>{errors.name}</div>
                </div>

                <div className='email-box'>
                    <label htmlFor='email'>이메일</label>
                    <StyledBox>
                        <input
                            id='email'
                            type='text'
                            placeholder='Email'
                            name='email'
                            autoComplete='email'
                            onChange={onChange}
                        />
                        <Button onClick={checkEmail}>중복확인</Button>
                    </StyledBox>
                </div>
                <div className='text-success'>{successMessages.email}</div>
                <div className='text-danger'>{errors.email}</div>

                <label htmlFor='gender'>성별</label>
                <div className='gender-box'>
                    <div className='male-box'>
                        <input
                            id='gender-male'
                            type='radio'
                            name='gender'
                            value='MALE'
                            checked={formData.gender === "MALE"}
                            onChange={onChange}
                        />
                        <label htmlFor='gender-male'>남자</label>
                    </div>
                    <div className='female-box'>
                        <input
                            id='gender-female'
                            type='radio'
                            name='gender'
                            value='FEMALE'
                            checked={formData.gender === "FEMALE"}
                            onChange={onChange}
                        />
                        <label htmlFor='gender-female'>여자</label>
                    </div>
                </div>
                <div className='text-danger'>{errors.gender}</div>

                <div>
                    <label htmlFor='birthDay'>생일</label>
                    <input id='birthDay' type='date' name='birthDay' autoComplete='birthDay' onChange={onChange} />
                    <div className='text-danger'>{errors.birthDay}</div>
                </div>
                <div className='login-btn-box'>
                    <button className='btn-login' type='submit'>
                        Join
                    </button>
                </div>
            </form>
        </div>
    );
};

export default JoinForm;
