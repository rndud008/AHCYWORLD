import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import api, { SERVER_HOST } from "../../../apis/api";
import { LoginContext } from "../login/context/LoginContextProvider";
import * as Swal from "../../../apis/alert";

const UpdateUser = ({ isEditModalOpen, closeEditModal }) => {
    const { userInfo, hompyInfo, setUserInfo } = useContext(LoginContext);

    const [updatedUserInfo, setUpdatedUserInfo] = useState({
        name: hompyInfo.user.name,
        email: hompyInfo.user.email,
        gender: hompyInfo.user.gender,
        birthDay: hompyInfo.user.birthDay,
        password: "",
    });

    const [passwordError, setPasswordError] = useState("");

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*\d).{8,16}$/;

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if(name === 'password'){
            if(!passwordRegex.test(value)){
                setPasswordError("비밀번호는 8-16자의 길이로 영문자, 숫자 및 특수문자를 포함해야 합니다.");
            }else{
                setPasswordError("");
            }
        }

        setUpdatedUserInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
        // console.log(`${name} updated to ${value}`);
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
            // console.log("울랄라", response.data);

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

    const handleFormSubmit = (e) => {
        e.preventDefault();

        const form = e.currentTarget;
        if (!form.checkValidity() || passwordError) {
            e.stopPropagation();
        } else {
            handleSaveUserInfo();
        }
        form.classList.add("was-validated");
    };
    return (
        <>
            <Modal show={isEditModalOpen} onHide={closeEditModal}>
                <Modal.Header closeButton>
                    <Modal.Title>내 정보 수정</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleFormSubmit}>
                    <Modal.Body>
                        <Form.Group controlId="formName">
                            <Form.Label>이름</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={updatedUserInfo.name}
                                onChange={handleInputChange}
                                required
                                isInvalid={!updatedUserInfo.name}
                            />
                            <Form.Control.Feedback type="invalid">
                                이름을 입력하세요.
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
                            <Form.Control
                                type="password"
                                name="password"
                                value={updatedUserInfo.password}
                                onChange={handleInputChange}
                                placeholder="비밀번호를 입력하세요"
                                required
                                isInvalid={!!passwordError}
                            />
                            <Form.Control.Feedback type="invalid">
                                {passwordError || "비밀번호를 입력해주세요."}
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
                            />
                            <Form.Check
                                type="radio"
                                id="genderFemale"
                                name="gender"
                                label="여자"
                                value="FEMALE"
                                checked={updatedUserInfo.gender === "FEMALE"}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="formBirthday">
                            <Form.Label>생일</Form.Label>
                            <Form.Control
                                type="date"
                                name="birthDay"
                                value={updatedUserInfo.birthDay}
                                onChange={handleInputChange}
                                required
                                isInvalid={!updatedUserInfo.birthDay}
                            />
                            <Form.Control.Feedback>
                                생일을 입력해주세요.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeEditModal}>
                            닫기
                        </Button>
                        <Button variant="primary" type="submit">
                            저장
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
};

export default UpdateUser;
