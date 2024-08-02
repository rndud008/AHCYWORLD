import React from "react";
import { Button, Modal } from "react-bootstrap";
import moment from "moment";
import { useNavigate } from "react-router-dom";

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

    console.log("diaryContent:", diaryContent);
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
                    {diaryContent.map((diary, index) => (
                        <div key={index} onClick={() => onUpdateClick(diary.id)}>
                            {/* <p>{diary.id}</p> */}
                            <p>{diary.keyWord} : {diary.content} </p>
                            <hr />
                        </div>
                    ))}
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
