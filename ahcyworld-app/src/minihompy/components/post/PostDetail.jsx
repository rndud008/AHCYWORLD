import React, { createElement, useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../../apis/api";
import Cookies from "js-cookie";
import { Button, Container, Form, ListGroup, ListGroupItem, Modal } from "react-bootstrap";
import { userInfo } from "../../../apis/auth";
// import { LoginContext } from "../../login/context/LoginContextProvider";
import { LoginContext } from "../../../webpage/login/context/LoginContextProvider";
import { useDispatch, useSelector } from "react-redux";
import { PostAction } from "../../../redux/actions/PostAction";
import PostItem from "./PostItem";

const PostDetail = ({ folderList, setMoveFolderId, moveFolderId }) => {
    const { userInfo, hompyInfo } = useContext(LoginContext);
  
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // const [post, setPost] = useState();
    const post = useSelector((state) => state.post.post);
    const [show, setShow] = useState(false);
    const { hompyId, postName, folderId, postId } = useParams();
  
    const detailPage = async () => {
      // const response = await api.get(
      //   `http://localhost:8070/${hompyId}/${postName}/${folderId}/detail/${postId}`,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${Cookies.get("accessToken")}`,
      //     },
      //   }
      // );
  
      // const { data, status } = response;
  
      // if (status === 200) {
      //   setPost(data);
      //   console.log(data);
      // } else {
      //   navigate("/");
      // }
  
      dispatch(
        PostAction.detailPostAxios(hompyId, postName, folderId, postId, navigate)
      );
    };
  
    useEffect(() => {
      detailPage();
    }, []);
  
    const list = () => {
      navigate(`/post/${hompyId}/${postName}/${folderId}`);
    };
  
    const postDelete = async () => {
      if (!window.confirm("삭제 하시겠습니까?")) return;
      // const response = await api.delete(
      //   `http://localhost:8070/${hompyId}/${postName}/${folderId}/delete/${postId}`
      // );
      // const { status } = response;
  
      // if (status === 200) {
      //   alert("삭제 성공.");
      //   navigate(`http://localhost:8070/${hompyId}/${postName}/${folderId}`);
      // } else {
      //   alert("삭제 실패.");
      //   navigate(-1);
      // }
  
      dispatch(
        PostAction.deletePostAxios(hompyId, postName, folderId, postId, navigate)
      );
    };
  
    const moveFolder = async (e) => {
      e.preventDefault();
  
      // const response = await api.put(`http://localhost:8070/${hompyId}/${postName}/${folderId}/detail/${postId}/${moveFolderId}`)
  
      // const {data,status} = response;
      // console.log('폴더 변경완료 :', data)
  
      // if(parseInt(status) === 200){
      //   alert('폴더 변경 성공.')
      //   navigate(`/post/${hompyId}/${postName}/${data.folder.id}/detail/${postId}`)
      // }else{
      //   alert('폴더 변경 실패')
      //   navigate(`/post/${hompyId}/${postName}`)
      // }
  
      dispatch(
        PostAction.movePostFolderAxios(
          hompyId,
          postName,
          folderId,
          postId,
          moveFolderId,
          navigate
        )
      );
  
      setShow(false);
    };
  
    const changeValue = (e) => {
      const id = e.target.id.split("-")[3];
      setMoveFolderId(id);
    };
  
    const handleOpen = () => {
      setShow(true);
    };
  
    const handleClose = () => {
      setShow(false);
    };
  
    const download = async (item) => {
      const response = await api.get(
        `http://localhost:8070/post/download?id=${item.id}`,
        { responseType: "blob" }
      );
  
      const { data, status } = response;
  
      if (status === 200) {
        const fileName = item.sourceName;
  
        const url = window.URL.createObjectURL(new Blob([data]));
        const a = document.createElement("a");
  
        a.href = url;
        a.download = item.sourceName;
        a.setAttribute("download", fileName);
        document.body.appendChild(a);
        a.click();
  
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        alert("파일이 존재하지 않습니다.");
      }
    };
  
    return (
      <Container>
        <div>
          <div>
            <h4>{post?.subject}</h4>
          </div>
          <div>
            <Button onClick={list}>목록</Button>
            {parseInt(hompyId) === hompyInfo?.id && (
              <>
                <Button onClick={handleOpen}>이동</Button>
                <Button
                  onClick={() =>
                    navigate(
                      `/post/${hompyId}/${postName}/${post?.folder.id}/update/${postId}`
                    )
                  }
                >
                  수정
                </Button>
                <Button onClick={postDelete}>삭제</Button>
              </>
            )}
          </div>
        </div>
        <div>
          <div>
            <span>작성자 : {post?.folder.hompy.user.name}</span>
          </div>
          <div>
            <span>작성일자 : {post?.createAt}</span>
          </div>
          <div>
            <span>조회수 : {post?.viewCnt}</span>
          </div>
        </div>
        <div>
          {post?.fileList.map((item) => (
            <ListGroup>
              <ListGroupItem>
                <Button variant="none" onClick={() => download(item)}>
                  {item.sourceName}
                </Button>
              </ListGroupItem>
            </ListGroup>
          ))}
        </div>
        <div>
          <span>{post?.content}</span>
        </div>
        <div>
          <div>
            <Button>댓글보기</Button>
          </div>
          <div>댓글 목록</div>
          <div>
            <label>댓글</label>
            <input placeholder="댓글입력" />
            <Button>확인</Button>
          </div>
        </div>
  
        {parseInt(hompyId) === hompyInfo?.id && (
          <>
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>폴더 이동</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={moveFolder}>
                  <Form.Group>
                    <Form.Label>폴더 리스트 :</Form.Label>
                    <div>
                      {folderList &&
                        folderList.map((item) => {
                          return (
                            <Form.Check
                              type="radio"
                              id={`move-folder-radio-${item.id}`}
                              value={item.name}
                              name="folder"
                              label={item.name}
                              onChange={changeValue}
                              checked={item.id === parseInt(moveFolderId)}
                            />
                          );
                        })}
                    </div>
                  </Form.Group>
  
                  <Button variant="primary" type="submit">
                    이동
                  </Button>
                  <Button variant="secondary" onClick={handleClose}>
                    취소
                  </Button>
                </Form>
              </Modal.Body>
            </Modal>
          </>
        )}
      </Container>
    );
  };
export default PostDetail;
