import React, { useContext, useState } from "react";
import "./BoardTypeList.css";
import { Button, Modal, Form, ListGroup, Container } from "react-bootstrap";
import api from "../../../apis/api";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FolderAction } from "../../../redux/actions/FolderAction";
import { PostAction } from "../../../redux/actions/PostAction";
import { LoginContext } from "../../../webpage/login/context/LoginContextProvider"

let modalName;
let folderId;
const BoardTypeList = () => {
    const { postName, hompyId } = useParams();
    const [folder, setFolder] = useState({
      id: "",
      boardType: "",
      name: "",
      hompy: "",
      status: "",
    });
    // const[folderList, setFolderList] = useState()
  
    const { hompyInfo } = useContext(LoginContext);
  
    const folderList = useSelector((state) => state.folder.folderList);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const BoardTypeName = folderList?.[0]?.boardType.name;
    const [show, setShow] = useState(false);
  
    const handleClose = () => {
      setFolder({
        name: "",
        status: "",
      });
      setShow(false);
    };
  
    const handleShow = (e) => {
      const { value, id } = e.target;
      // const id = e.target.getAttribute("data-id");
      if (id !== null) {
        setFolder(
          ...folderList?.filter((item) => parseInt(item.id) === parseInt(id))
        );
      }
  
      modalName = value;
  
      setShow(true);
    };
  
    const createSubmit = async (e) => {
      e.preventDefault();
  
      // try{
      //   const response = await api.post(
      //     `http://localhost:8070/${hompyId}/${postName}/write`,
      //     folder
      //   );
      //   const data = response.data;
      //   // setFolderList([...folderList, data]);
      // }catch (error) {
      //   console.error('Error :', error);
      // }
  
      dispatch(FolderAction.createFolderAxios(hompyId, postName, folder));
  
      handleClose();
    };
  
    const updateSubmit = async (e) => {
      e.preventDefault();
  
      // const response = await api.put(
      //   `http://localhost:8070/${hompyId}/${postName}/update`,
      //   folder
      // );
      // const {data} = response;
      // setFolderList((prev) =>
      //   prev.map((item) =>
      //     parseInt(item.id) === parseInt(data.id) ? data : item
      //   )
      // );
  
      dispatch(FolderAction.updateFolderAxios(hompyId, postName, folder));
      handleClose();
    };
  
    const changeValue = (e) => {
      const { value, name } = e.target;
      setFolder({ ...folder, [name]: value });
    };
  
    const folderClick = async (e) => {
      folderId = e.target.id.substring(e.target.id.lastIndexOf("-") + 1);
  
      // const response = await api.get(`http://localhost:8070/${hompyId}/${postName}/${folderId}/list`)
      // const {data, status}= response;
      // setPageAndPostList(data);
      // setFolder(folderList.filter(item => parseInt(item.id) === parseInt(folderId)))
  
      dispatch(FolderAction.clickFolder(folderId));
  
      dispatch(PostAction.axiosPostList(hompyId, postName, folderId));
  
      navigate(`/post/${hompyId}/${postName}/${folderId}`);
    };
  
    const folderDelete = async () => {
      // const response = await api.delete(`http://localhost:8070/${hompyId}/${postName}/delete/${folderId}`);
      // const {status} = response;
      // if(status === 200){
      //   setFolderList((prev) =>
      //     prev.filter((item) =>
      //       parseInt(item.id) === parseInt(folderId) ? '' : item
      //     )
      //   )
      // }
  
      dispatch(FolderAction.deleteFolderAxios(hompyId, postName, folderId));
    };
  
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
  
                  {parseInt(hompyId) === hompyInfo?.id && (
                    <>
                      <Button variant="primary" id={item.id} onClick={handleShow}>
                        폴더 수정
                      </Button>
                    </>
                  )}
                </ListGroup.Item>
              ))}
          </ListGroup>
          {parseInt(hompyId) === hompyInfo?.id && (
            <>
              <div>
                <Button onClick={handleShow} value="폴더 생성">
                  폴더 추가
                </Button>
                <Button onClick={folderDelete}>폴더 삭제</Button>
              </div>
            </>
          )}
        </Container>
  
        {parseInt(hompyId) === hompyInfo?.id && (
          <>
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>{modalName}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form
                  onSubmit={
                    modalName === "폴더 생성" ? createSubmit : updateSubmit
                  }
                >
                  <Form.Group controlId="formFolderName">
                    <Form.Label>폴더이름 :</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={folder?.name}
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
                        checked={folder?.status === "전체공개"}
                      />
                      <Form.Check
                        type="radio"
                        id="friend"
                        value="일촌공개"
                        name="status"
                        label="일촌공개"
                        onChange={changeValue}
                        checked={folder?.status === "일촌공개"}
                      />
                      <Form.Check
                        type="radio"
                        id="private"
                        value="비공개"
                        name="status"
                        label="비공개"
                        onChange={changeValue}
                        checked={folder?.status === "비공개"}
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
        )}
      </>
    );
  };
export default BoardTypeList;
