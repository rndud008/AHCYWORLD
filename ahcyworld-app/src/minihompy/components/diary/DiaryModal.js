import React, { useContext } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { SERVER_HOST } from "../../../apis/api";
import * as Swal from "../../../apis/alert";
import { LoginContext } from "../../../webpage/components/login/context/LoginContextProvider";
import './css/DiaryWritePage.css';

const DiaryModal = ({
    show,
    onHide,
    selectedDate,
    diaryContent,
    onWriteClick,
}) => {

    const {userInfo, hompyInfo} = useContext(LoginContext);

    const navigate = useNavigate();

    const onUpdateClick = (diary) => {
        if(diary.hompy.id !== hompyInfo.id) return;
        // console.log("diary : ", diary);
        // console.log("hompyInfo : ", hompyInfo);
        navigate(`/hompy/${hompyInfo.id}/diary/update/` + diary.id);
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
                                    <th>제목</th>
                                    <th>내용</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {diaryContent.map((diary, index) => (
                                    <tr key={index}>
                                         <td
                                            onClick={() => onUpdateClick(diary)}
                                            style={{ cursor: diary.hompy.id === hompyInfo.id ? 'pointer' : 'default' }}
                                        >
                                            {diary.keyWord}
                                        </td>
                                        <td
                                            onClick={() => onUpdateClick(diary)}
                                            style={{ cursor: diary.hompy.id === hompyInfo.id ? 'pointer' : 'default' }}
                                        >
                                            {diary.content}
                                        </td>
                                        {diary.hompy.id === hompyInfo.id && (
                                            <td>
                                                <Button className="diarywriteno-btn" variant="danger" onClick={() => onDeleteClick(diary.id)}>
                                                    X
                                                </Button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <Button className="diarywriteok-btn" onClick={onWriteClick} style={{ display: hompyInfo.user.id === userInfo.id ? 'block' : 'none'}}>
                            다이어리 작성하기
                        </Button>
                    </>
                ) : (
                    <>
                        <p>일정이 없습니다.</p>
                        <hr />
                        <Button className="diarywriteok-btn" onClick={onWriteClick} style={{ display: hompyInfo.user.id === userInfo.id ? 'block' : 'none'}}>
                            다이어리 작성하기
                        </Button>
                    </>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default DiaryModal;
