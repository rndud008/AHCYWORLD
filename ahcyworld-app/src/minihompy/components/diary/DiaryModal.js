import React, { useContext, useEffect } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { SERVER_HOST } from "../../../apis/api";
import * as Swal from "../../../apis/alert";
import { LoginContext } from "../../../webpage/components/login/context/LoginContextProvider";
import "./css/DiaryWritePage.css";

const DiaryModal = ({
    show,
    onHide,
    selectedDate,
    diaryContent,
    onWriteClick,
}) => {
    // useEffect(() => {
    //     console.log("diaryContent : ", diaryContent);
    // }, [])

    const { userInfo, hompyInfo } = useContext(LoginContext);

    const navigate = useNavigate();

    const onUpdateClick = (diary) => {
        if (diary.hompy.id !== hompyInfo.id) return;
        // console.log("diary : ", diary);
        // console.log("hompyInfo : ", hompyInfo);
        navigate(`/hompy/${hompyInfo.id}/diary/update/` + diary.id);
    };

    const onDeleteClick = (id) => {
        if (window.confirm("삭제하시겠습니까?")) {
            axios
                .delete(
                    `${SERVER_HOST}/cyworld/cy/diaries/delete/${id}/${userInfo.id}`
                )
                .then((response) => {
                    Swal.alert(
                        "다이어리가 삭제 되었습니다.",
                        "다이어리 삭제 성공",
                        "success",
                        () => {
                            window.location.reload();
                            onHide();
                        }
                    );
                })
                .catch((error) => {
                    console.error("삭제 실패", error);
                });
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <div className="Modal-header">
                    <Modal.Title>
                        <div className="Modal-title">
                            {moment(selectedDate).format("YYYY-MM-DD")} 다이어리
                        </div>
                    </Modal.Title>
                </div>
            </Modal.Header>
            <Modal.Body>
                <div className="Modal-body">
                    {diaryContent && diaryContent.length > 0 ? (
                        <>
                            {/* 테이블에 className="diary-modal-body" 추가 */}
                            <Table bordered hover className="diary-modal-body">
                                <thead>
                                    <tr>
                                        <th style={{ width: "10%" }}>No.</th>
                                        <th style={{ width: "30%" }}>제목</th>
                                        <th style={{ width: "50%" }}>내용</th>
                                        {hompyInfo.user.id ===
                                            diaryContent[0].hompy.user.id && (
                                            <th style={{ width: "10%" }}>
                                                삭제
                                            </th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {diaryContent.map((diary, index) => (
                                        <tr key={index}>
                                            {/* No. 칼럼은 index + 1로 표시하여 1번부터 시작 */}
                                            <td onClick={() =>
                                                    onUpdateClick(diary)
                                                }
                                                style={{ cursor:
                                                    diary.hompy.id ===
                                                    hompyInfo.id
                                                        ? "pointer"
                                                        : "default", width: "10%" }}>
                                                {index + 1}
                                            </td>
                                            <td
                                                onClick={() =>
                                                    onUpdateClick(diary)
                                                }
                                                style={{
                                                    cursor:
                                                        diary.hompy.id ===
                                                        hompyInfo.id
                                                            ? "pointer"
                                                            : "default",
                                                    width: "30%",
                                                }}
                                            >
                                                {diary.keyWord}
                                            </td>
                                            <td
                                                onClick={() =>
                                                    onUpdateClick(diary)
                                                }
                                                style={{
                                                    cursor:
                                                        diary.hompy.id ===
                                                        hompyInfo.id
                                                            ? "pointer"
                                                            : "default",
                                                    width: "50%",
                                                }}
                                            >
                                                {diary.content}
                                            </td>
                                            {diary.hompy.id ===
                                                hompyInfo.id && (
                                                <td style={{ width: "10%" }}>
                                                    <Button
                                                        className="diarywriteno-btn"
                                                        variant="danger"
                                                        onClick={() =>
                                                            onDeleteClick(
                                                                diary.id
                                                            )
                                                        }
                                                    >
                                                        X
                                                    </Button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            <Button
                                className="diarywriteok-btn"
                                onClick={onWriteClick}
                                style={{
                                    display:
                                        hompyInfo.user.id === userInfo.id
                                            ? "block"
                                            : "none",
                                }}
                            >
                                다이어리 작성하기
                            </Button>
                        </>
                    ) : (
                        <>
                            <p>일정이 없습니다.</p>
                            <hr />
                            <Button
                                className="diarywriteok-btn"
                                onClick={onWriteClick}
                                style={{
                                    display:
                                        hompyInfo.user.id === userInfo.id
                                            ? "block"
                                            : "none",
                                }}
                            >
                                다이어리 작성하기
                            </Button>
                        </>
                    )}
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default DiaryModal;
