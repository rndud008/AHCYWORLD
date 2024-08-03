import React from "react";
import { Button, Col, Modal, Table } from "react-bootstrap";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const DiaryModal = ({
    show,
    onHide,
    selectedDate,
    diaryContent,
    onWriteClick,
}) => {

    const navigate = useNavigate();

    const onUpdateClick = (id) => {
        navigate("/update/" + id);
    };

    const onDeleteClick = (id) => {
        if(window.confirm("삭제하시겠습니까?")){
            axios
                .delete(`http://localhost:8080/cyworld/cy/diaries/delete/${id}`)
                .then((response) => {
                    window.alert("삭제되었습니다.");
                    onHide();   // 모달 닫기
                    window.location.reload();       // 페이지 새로고침
                })
                .catch((error => {
                    console.error("삭제 실패", error);
                }))
        }
    }

    // console.log("diaryContent:", diaryContent);
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
