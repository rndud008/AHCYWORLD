import React, { useState } from "react";

const JoinForm = ({ join }) => {
    const [errors, setErrors] = useState({
        username: "",
        password: "",
        name: "",
        email: "",
        gender: "",
        birthDay: "",
    });

    const onJoin = (e) => {
        e.preventDefault();

        const username = e.target.username.value;
        const password = e.target.password.value;
        const email = e.target.email.value;
        const name = e.target.name.value;
        let gender = e.target.gender.value;
        const birthDay = e.target.birthDay.value;

        console.log("입력값: ", username, password, name, email, gender, birthDay);

        const validate = () => {
            const newErrors = {};
            let hasError = false;

            const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=).{8,16}$/;
            const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

            if (!username) {
                newErrors.username = "아이디를 입력해주세요.";
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
            }
            if (!gender) {
                newErrors.gender = "성별을 입력해주세요.";
                hasError = true;
            } else if (gender === "남자") {
                gender = "MALE";
            } else if (gender === "여자") {
                gender = "FEMALE";
            } else {
                newErrors.gender = "성별을 알맞게 입력해주세요.";
                hasError = true;
            }
            if (!birthDay) {
                newErrors.birthDay = "생일을 입력해주세요.";
                hasError = true;
            }

            setErrors(newErrors);
            return hasError;
        };

        const hasErrors = validate();
        if (!hasErrors) {
            join({ username, password, email, name, gender, birthDay });
        }
    };

    return (
        <div className='form'>
            <h2 className='login-title'>Join</h2>

            <form className='login-form' onSubmit={(e) => onJoin(e)}>
                <div>
                    <label htmlFor='username'>Username</label>
                    <input id='username' type='text' placeholder='Username' name='username' autoComplete='username' />
                    <div className='text-danger'>{errors.username}</div>
                </div>
                <div>
                    <label htmlFor='password'>
                        Password <small style={{ color: "gray" }}>영문자+숫자+특수문자 조합 8~16글자</small>
                    </label>
                    <input
                        id='password'
                        type='password'
                        placeholder='Password'
                        name='password'
                        autoComplete='current-password'
                    />
                    <div className='text-danger'>{errors.password}</div>
                </div>
                <div>
                    <label htmlFor='name'>Name</label>
                    <input id='name' type='text' placeholder='Name' name='name' autoComplete='name' />
                    <div className='text-danger'>{errors.name}</div>
                </div>
                <div>
                    <label htmlFor='email'>Email</label>
                    <input id='email' type='text' placeholder='Email' name='email' autoComplete='email' />
                    <div className='text-danger'>{errors.email}</div>
                </div>
                <div>
                    <label htmlFor='gender'>Gender</label>
                    <input id='gender' type='text' placeholder='Gender' name='gender' autoComplete='gender' />
                    <div className='text-danger'>{errors.gender}</div>
                </div>
                <div>
                    <label htmlFor='birthDay'>BirthDay</label>
                    <input id='birthDay' type='text' placeholder='BirthDay' name='birthDay' autoComplete='birthDay' />
                    <div className='text-danger'>{errors.birthDay}</div>
                </div>

                <button className='btn btn--form btn-login' type='submit'>
                    Join
                </button>
            </form>
        </div>
    );
};

export default JoinForm;
