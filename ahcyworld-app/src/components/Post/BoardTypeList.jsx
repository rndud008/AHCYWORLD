import React, { useState } from "react";
import "./BoardTypeList.css";
import { Button, Modal, Form, ListGroup, Container } from "react-bootstrap";
import api from "../../login/apis/api";
import { useNavigate } from "react-router-dom";

let modalName;
let folderId;

const BoardTypeList = ({ folderList, postName, setFolderList, setPageAndPostList, folder, setFolder,hompyId,moveFolderId}) => {
  console.log("moveFolderId: ", moveFolderId);

  const navigate = useNavigate();

  const BoardTypeName = folderList[0]?.boardType.name;

  const [show, setShow] = useState(false);

  const handleClose = () => {
    setFolder({
      name: "",
      status: "",
    });

    setShow(false);
  };

  const handleShow = (e) => {
    const { value } = e.target;
    const id = e.target.getAttribute("data-id");

    if (id !== null) {
      console.log(
        "BoardTypeList??",
        folderList?.filter((item) => parseInt(item.id) === parseInt(id))
      );
      setFolder(
        ...folderList?.filter((item) => parseInt(item.id) === parseInt(id))
      );
    }

    modalName = value;

    setShow(true);
  };

  const createSubmit = async (e) => {
    e.preventDefault();

    try{
      const response = await api.post(
        `http://localhost:8070/${hompyId}/${postName}/write`,
        folder
      );
  
      const data = response.data;
      setFolderList([...folderList, data]);
    }catch (error) {
      if (error.response) {
        // 서버가 400 범위의 응답을 반환한 경우
        console.error('Error Response:', error.response.data);
        console.error('Error Status:', error.response.status);
        console.error('Error Headers:', error.response.headers);
      } else if (error.request) {
        // 요청이 만들어졌지만 응답을 받지 못한 경우
        console.error('Error Request:', error.request);
      } else {
        // 요청을 설정하는 중에 문제가 발생한 경우
        console.error('Error Message:', error.message);
      }
      console.error('Error Config:', error.config);
    }
    

    handleClose();
  };

  const updateSubmit = async (e) => {
    e.preventDefault();

    const response = await api.put(
      `http://localhost:8070/${hompyId}/${postName}/update`,
      folder
    );

    const data = response.data;

    setFolderList((prev) =>
      prev.map((item) =>
        parseInt(item.id) === parseInt(data.id) ? data : item
      )
    );

    handleClose();
  };

  const changeValue = (e) => {
    const { value, name } = e.target;
    console.log(value);

    setFolder({ ...folder, [name]: value });
    console.log(folder);
  };

  console.log("BoardTypeName", BoardTypeName);

  const folderClick = async (e) =>{
    folderId = e.target.id.substring(e.target.id.lastIndexOf('-')+1);
    console.log('custom :' ,folderId);

    const response = await api.get(`http://localhost:8070/${hompyId}/${postName}/${folderId}/list`)
    const {data, status}= response;

    console.log('folderClick data: ',data);
    console.log('folderClick status: ',status);

    setPageAndPostList(data);
    setFolder(folderList.filter(item => parseInt(item.id) === parseInt(folderId)))
    navigate(`/post/${hompyId}/${postName}`)
  }

  const folderDelete = async () =>{
    const response = await api.delete(`http://localhost:8070/${hompyId}/${postName}/delete/${folderId}`);
    const {status} = response;
    console.log(status);

    if(status === 200){
      console.log('list 수정')
      setFolderList((prev) =>
        prev.filter((item) =>
          parseInt(item.id) === parseInt(folderId) ? '' : item
        )
      )
    }
    

  }

  return (
    <>
      <Container>
        <div>
          <h2>{BoardTypeName}</h2>
        </div>
        <ListGroup>
          {folderList &&
            folderList.map((item) => (
              <ListGroup.Item
                key={item.id}
                className="d-flex align-items-center"
              >
                <Form.Check
                  type="radio"
                  id={`folder-radio-${item.id}`}
                  name="folder"
                  value={item.name}
                  label={item.name}
                  className="me-3"
                  onClick={folderClick}
                />
                <Button
                  variant="primary"
                  data-id={item.id}
                  onClick={handleShow}
                >
                  폴더 수정
                </Button>
              </ListGroup.Item>
            ))}
        </ListGroup>
        <div>
          <Button onClick={handleShow} value="폴더 생성">
            폴더 추가
          </Button>
          <Button onClick={folderDelete}>폴더 삭제</Button>
        </div>
      </Container>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{modalName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={modalName === "폴더 생성" ? createSubmit : updateSubmit}
          >
            <Form.Group controlId="formFolderName">
              <Form.Label>폴더이름 :</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={folder.name}
                onChange={changeValue}
                placeholder="폴더 이름을 입력하세요"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>공개범위 :</Form.Label>
              <div>
                <Form.Check
                  type="radio"
                  id="public"
                  value="전체공개"
                  name="status"
                  label="전체공개"
                  onChange={changeValue}
                  checked={folder.status === "전체공개"}
                />
                <Form.Check
                  type="radio"
                  id="friend"
                  value="일촌공개"
                  name="status"
                  label="일촌공개"
                  onChange={changeValue}
                  checked={folder.status === "일촌공개"}
                />
                <Form.Check
                  type="radio"
                  id="private"
                  value="비공개"
                  name="status"
                  label="비공개"
                  onChange={changeValue}
                  checked={folder.status === "비공개"}
                />
              </div>
            </Form.Group>

            <Button variant="primary" type="submit">
              {modalName === "폴더 생성" ? "추가" : "수정"}
            </Button>
            <Button variant="secondary" onClick={handleClose}>
              취소
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default BoardTypeList;
