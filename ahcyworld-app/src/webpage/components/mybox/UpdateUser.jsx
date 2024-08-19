import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import api, { SERVER_HOST } from "../../../apis/api";
import { LoginContext } from "../login/context/LoginContextProvider";
import * as Swal from "../../../apis/alert";
import "./UpdateUser.css";
import 'bootstrap-icons/font/bootstrap-icons.css';

const UpdateUser = ({ isEditModalOpen, closeEditModal }) => {
    const { userInfo, hompyInfo, setUserInfo } = useContext(LoginContext);

    const [updatedUserInfo, setUpdatedUserInfo] = useState({
        name: "",
        email: "",
        gender: "",
        birthDay: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [nameError, setNameError] = useState("");
    const [birthDayError, setBirthDayError] = useState("");
    const [genderError, setGenderError] = useState("");
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*\d).{8,16}$/;

    useEffect(() => {
        if (hompyInfo && hompyInfo.user) {
            setUpdatedUserInfo({
                name: hompyInfo?.user?.name || "",
                email: hompyInfo?.user?.email || "",
                gender: hompyInfo?.user?.gender || "",
                birthDay: hompyInfo?.user?.birthDay || "",
                password: "",
            });
        }
    }, [hompyInfo.user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setUpdatedUserInfo((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Validation
        if (name === "password") {
            if (!passwordRegex.test(value)) {
                setPasswordError(
                    "비밀번호는 8-16자의 길이로 영문자, 숫자 및 특수문자를 포함해야 합니다."
                );
            } else {
                setPasswordError("");
            }
        } else if (name === "name") {
            setNameError(value ? "" : "이름을 입력하세요.");
        } else if (name === "birthDay") {
            setBirthDayError(new Date(value) > new Date() ? "생일은 오늘 날짜보다 이전이어야 합니다." : "");
        } else if (name === "gender") {
            setGenderError(value ? "" : "성별을 선택하세요.");
        }
    };

    const handleSaveUserInfo = async () => {
        try {
            const response = await axios.post(
                `${SERVER_HOST}/user/user-update/${userInfo.id}`,
                updatedUserInfo,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const newUser = response.data;

            setUserInfo({
                acorn: newUser.acorn,
                username: newUser.username,
                id: newUser.id,
                role: newUser.role,
                name: newUser.name,
            });

            Swal.alert(
                "유저 정보 수정에 성공했습니다.",
                "업데이트 성공",
                "success",
                () => {
                    closeEditModal();
                }
            );
        } catch (error) {
            console.error("유저 정보 수정 실패", error);
            Swal.alert(
                "유저 정보 수정에 실패했습니다.",
                "업데이트 실패",
                "warning",
                () => {
                    return;
                }
            );
        }
    };

    const validateForm = () => {
        let isValid = true;

        if (!updatedUserInfo.name) {
            setNameError("이름을 입력하세요.");
            isValid = false;
        } else {
            setNameError("");
        }

        if (!passwordRegex.test(updatedUserInfo.password)) {
            setPasswordError("비밀번호는 8-16자의 길이로 영문자, 숫자 및 특수문자를 포함해야 합니다.");
            isValid = false;
        } else {
            setPasswordError("");
        }

        if (new Date(updatedUserInfo.birthDay) > new Date()) {
            setBirthDayError("생일은 오늘 날짜보다 이전이어야 합니다.");
            isValid = false;
        } else {
            setBirthDayError("");
        }

        if (!updatedUserInfo.gender) {
            setGenderError("성별을 선택하세요.");
            isValid = false;
        } else {
            setGenderError("");
        }

        return isValid;
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            handleSaveUserInfo();
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <>
            <Modal show={isEditModalOpen} onHide={closeEditModal}>
                <Modal.Header closeButton>
                    <Modal.Title>내 정보 수정</Modal.Title>
                </Modal.Header>
                <Form noValidate onSubmit={handleFormSubmit}>
                    <Modal.Body>
                        <Form.Group controlId="formName">
                            <Form.Label>이름</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={updatedUserInfo.name}
                                onChange={handleInputChange}
                                isInvalid={!!nameError}
                            />
                            <Form.Control.Feedback type="invalid">
                                {nameError}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="formEmail">
                            <Form.Label>E-mail</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={updatedUserInfo.email}
                                readOnly
                            />
                        </Form.Group>

                        <Form.Group controlId="formPassword">
                            <Form.Label>비밀번호</Form.Label>
                            <div className="input-group">
                                <Form.Control
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={updatedUserInfo.password}
                                    onChange={handleInputChange}
                                    placeholder="비밀번호를 입력하세요"
                                    isInvalid={!!passwordError}
                                />
                                <Button
                                    variant="outline-secondary"
                                    onClick={togglePasswordVisibility}
                                    className="input-group-text"
                                >
                                    <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                                </Button>
                            </div>
                            <Form.Control.Feedback type="invalid">
                                {passwordError}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="formGender">
                            <Form.Label>성별</Form.Label>
                            <Form.Check
                                type="radio"
                                id="genderMale"
                                name="gender"
                                label="남자"
                                value="MALE"
                                checked={updatedUserInfo.gender === "MALE"}
                                onChange={handleInputChange}
                                inline
                            />
                            <Form.Check
                                type="radio"
                                id="genderFemale"
                                name="gender"
                                label="여자"
                                value="FEMALE"
                                checked={updatedUserInfo.gender === "FEMALE"}
                                onChange={handleInputChange}
                                inline
                            />
                            <Form.Control.Feedback type="invalid">
                                {genderError}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="formBirthday">
                            <Form.Label>생일</Form.Label>
                            <Form.Control
                                type="date"
                                name="birthDay"
                                value={updatedUserInfo.birthDay}
                                onChange={handleInputChange}
                                isInvalid={!!birthDayError}
                            />
                            <Form.Control.Feedback type="invalid">
                                {birthDayError || "생일을 입력해주세요."}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button className="updateUser-close-btn" onClick={closeEditModal}>
                            취소
                        </Button>
                        <Button className="updateUser-save-btn" type="submit">
                            저장
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
};

export default UpdateUser;
