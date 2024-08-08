import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Container, Form, FormControl, Row } from "react-bootstrap";
import { LoginContext } from "../context/LoginContextProvider";
import { addInfo } from "../../../apis/auth";
import { useNavigate } from "react-router-dom";

const OAuth2AddInfo = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        gender: "",
        birthDay: "",
    });

    const [errors, setErrors] = useState({
        gender: "",
        birthDay: "",
    });

    const { userInfo } = useContext(LoginContext);

    const onChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // console.log(name, " = ", value);
    };

    const onJoin = async (e) => {
        e.preventDefault();

        const { gender, birthDay } = formData;
        const username = userInfo.username;

        console.log("입력값: ", gender, birthDay);

        const validate = () => {
            const newErrors = {};
            let hasError = false;

            if (!gender) {
                newErrors.gender = "성별을 입력해주세요.";
                hasError = true;
            }
            if (!birthDay) {
                newErrors.birthDay = "생일을 입력해주세요.";
                hasError = true;
            }

            setErrors(newErrors);
            return hasError;
        };

        const hasError = validate();
        if (!hasError) {
            try {
                const response = await addInfo(username, gender, birthDay);

                if (response) {
                    navigate("/");
                }
            } catch (error) {
                console.error("addInfo Error: ", error);
            }
        }
    };

    // useEffect(()=>{
    //     console.log("유저정보: ", userInfo.username);
    // })

    return (
        <Container className='form'>
            <Row>
                <h2>oauth2 추가입력</h2>
                <Form onSubmit={onJoin}>
                    <Form.Group controlId='formGender'>
                        <Form.Label>성별</Form.Label>
                        <Row>
                            <Col xs='auto'>
                                <Form.Check
                                    type='radio'
                                    id='gender-male'
                                    name='gender'
                                    value='MALE'
                                    label='남자'
                                    checked={formData.gender === "MALE"}
                                    onChange={onChange}
                                />
                            </Col>
                            <Col xs='auto'>
                                <Form.Check
                                    type='radio'
                                    id='gender-female'
                                    name='gender'
                                    value='FEMALE'
                                    label='여자'
                                    checked={formData.gender === "FEMALE"}
                                    onChange={onChange}
                                />
                            </Col>
                        </Row>
                        <div className='text-danger'>{errors.gender}</div>

                    </Form.Group>
                    <Form.Group controlId='formBirthDay'>
                        <Form.Label>생일</Form.Label>
                        <FormControl type='date' name='birthDay' value={formData.birthDay} onChange={onChange} />
                    </Form.Group>
                    <div className='text-danger'>{errors.birthDay}</div>

                    <br />
                    <Button variant='primary' type='submit'>
                        저장
                    </Button>
                </Form>
            </Row>
        </Container>
    );
};

export default OAuth2AddInfo;
