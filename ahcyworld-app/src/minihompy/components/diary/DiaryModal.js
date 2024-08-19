import React, { useContext } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { SERVER_HOST } from "../../../apis/api";
import * as Swal from "../../../apis/alert";
import { LoginContext } from "../../../webpage/components/login/context/LoginContextProvider";

const DiaryModal = ({
    show,
    onHide,
    selectedDate,
    diaryContent,
    onWriteClick,
}) => {

    const {userInfo, hompyInfo} = useContext(LoginContext);

    const navigate = useNavigate();

    const onUpdateClick = (id) => {
        navigate(`/hompy/${hompyInfo.id}/diary/update/` + id);
    };

    const onDeleteClick = (id) => {
        if(window.confirm("삭제하시겠습니까?")){
            axios
                .delete(`${SERVER_HOST}/cyworld/cy/diaries/delete/${id}/${userInfo.id}`)
                .then((response) => {
                    Swal.alert("다이어리가 삭제 되었습니다.", "다이어리 삭제 성공", "success", () => {
                        window.location.reload();
                        onHide();
                    })
                })
                .catch((error => {
                    console.error("삭제 실패", error);
                }))
        }
    }


    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {moment(selectedDate).format("YYYY-MM-DD")} 다이어리
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {diaryContent && diaryContent.length > 0 ? (
                    <>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>KeyWord</th>
                                    <th>Content</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {diaryContent.map((diary, index) => (
                                    <tr key={index}>
                                        <td onClick={() => onUpdateClick(diary.id)}>{diary.keyWord}</td>
                                        <td onClick={() => onUpdateClick(diary.id)}>{diary.content}</td>
                                        <td><Button variant="danger" onClick={() => onDeleteClick(diary.id)}>X</Button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <Button onClick={onWriteClick}>
                            다이어리 작성하기
                        </Button>
                    </>
                ) : (
                    <>
                        <p>일정이 없습니다.</p>
                        <hr />
                        <Button onClick={onWriteClick}>
                            다이어리 작성하기
                        </Button>
                    </>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default DiaryModal;
