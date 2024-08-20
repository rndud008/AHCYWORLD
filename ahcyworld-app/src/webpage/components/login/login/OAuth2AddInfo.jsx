import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Container, Form, FormControl, Row } from "react-bootstrap";
import { LoginContext } from "../context/LoginContextProvider";
import { addInfo } from "../../../../apis/auth";
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

    const { userInfo, setHompyInfo, hompyInfo } = useContext(LoginContext);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const onJoin = async (e) => {
    e.preventDefault();

    const { gender, birthDay } = formData;
    const username = userInfo.username;

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

                setHompyInfo(hompyInfo);
                if (response) {
                    navigate("/");
                    window.location.reload();
                }
            } catch (error) {
                console.error("addInfo Error: ", error);
            }
        }
    };

  return (
    <div className="join-form-container">
      <h1 className="jogin-title">OAuth2 추가입력</h1>

      <form
        className="join-form"
        onSubmit={(e) => onJoin(e)}
      >
        <label htmlFor="gender">성별</label>
        <div className="gender-box">
          <div className="male-box">
            <input
              className="join_input"
              id="gender-male"
              type="radio"
              name="gender"
              value="MALE"
              checked={formData.gender === "MALE"}
              onChange={onChange}
            />
            <label htmlFor="gender-male">남자</label>
          </div>
          <div className="female-box">
            <input
              className="join_input"
              id="gender-female"
              type="radio"
              name="gender"
              value="FEMALE"
              checked={formData.gender === "FEMALE"}
              onChange={onChange}
            />
            <label htmlFor="gender-female">여자</label>
          </div>
        </div>
        <div className="text-danger">{errors.gender}</div>

        <div>
          <label htmlFor="birthDay">생일</label>
          <input
            className="join_input"
            id="birthDay"
            type="date"
            name="birthDay"
            autoComplete="birthDay"
            onChange={onChange}
          />
          <div className="text-danger">{errors.birthDay}</div>
        </div>
        <div className="join-btn-box">
          <button
            className="btn-join"
            type="submit"
          >
            저장
          </button>
        </div>
      </form>
    </div>
  );
};

export default OAuth2AddInfo;
