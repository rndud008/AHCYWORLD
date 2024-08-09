import React, { createElement, useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../../apis/api";
import Cookies from "js-cookie";
import {
  Button,
  Container,
  Form,
  ListGroup,
  ListGroupItem,
  Modal,
} from "react-bootstrap";
import { userInfo } from "../../../apis/auth";
// import { LoginContext } from "../../login/context/LoginContextProvider";
import { LoginContext } from "../../../webpage/login/context/LoginContextProvider";
import { useDispatch, useSelector } from "react-redux";
import { PostAction } from "../../../redux/actions/PostAction";
import PostItem from "./PostItem";
import { CommentAction as CommentAction } from "../../../redux/actions/CommentAction";
import { TbWashDryP } from "react-icons/tb";

const PostDetail = () => {
  const { userInfo, hompyInfo } = useContext(LoginContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const post = useSelector((state) => state.post.post);
  const commentList = useSelector((state) => state.comment.commentList);
  const [show, setShow] = useState(false);
  const { hompyId, postName, folderId, postId } = useParams();
  const [content, setContent] = useState();
  const [moveFolderId, setMoveFolderId] = useState();
  const [commentShow,setCommentShow] = useState(false);
  const folderList = useSelector((state) => state.folder.folderList);

  const commentListAxios = async () => {
    try {
      await dispatch(CommentAction.commentListAxios(postId,postName));
    } catch (e) {
      alert(e);
    }
  };

  const commentWriteAxios = async () => {
    try {
      await dispatch(CommentAction.commentWriteAxios(userInfo, post, content,postName));
    } catch (e) {
      alert(e);
    }
  };

  const commentDeleteAxios = async (commentId) =>{
    try{
      await dispatch(CommentAction.commentDeleteAxios(commentId,post.id,postName))
      
    }catch(e){
      alert(e)
    }
  } 

  const detailPage = async () => {

    dispatch(
      PostAction.detailPostAxios(hompyId, postName, folderId, postId, navigate)
    );
  };

  useEffect(() => {
    detailPage();
    commentListAxios();
  }, []);

  const list = () => {
    navigate(`/hompy/${hompyId}/${postName}/${folderId}`);
  };

  const postDelete = async () => {
    if (!window.confirm("삭제 하시겠습니까?")) return;

    dispatch(
      PostAction.deletePostAxios(hompyId, postName, folderId, postId, navigate)
    );
  };

  const moveFolder = async (e) => {
    e.preventDefault();

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
    <>
      <>
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
            <Button onClick={() => setCommentShow(!commentShow)}>
              {commentShow ===false ? '댓글보기':'댓글닫기'}</Button>
          </div>
          {commentShow && <div>
            {commentList.count === 0
              ? "작성된 댓글이 없습니다."
              : commentList.data?.map((item) => (
                  <div style={{display:'flex'}}>
                    <p>{item.user.name}</p>
                    <p>{item.createAt}</p>
                    <p>{item.content}</p>
                    <Button onClick={()=>commentDeleteAxios(item.id)}>삭제</Button>
                  </div>
                ))}
          </div>}
          
          <div>
            <label>댓글</label>
            <input
              onChange={(e) => setContent(e.target.value)}
              placeholder="댓글입력"
            />
            <Button onClick={commentWriteAxios}>확인</Button>
          </div>
        </div>
      </>
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
    </>
  );
};
export default PostDetail;
