import React, { useContext, useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import "./PostWrite.css";
import { nameCheck } from "./postUtils";
import { useDispatch } from "react-redux";
import { PostAction } from "../../../redux/actions/PostAction";
import { LoginContext } from "../../../webpage/login/context/LoginContextProvider"

const PostWrite = () => {
    const { hompyId, postName, folderId } = useParams();
    const {hompyInfo} = useContext(LoginContext);
    const navigate = useNavigate();
    const dispatch = useDispatch();
  
    const [post, setPost] = useState({
      subject: "",
      content: "",
      fileList: [{ id: 1, sourcename: null }],
    });
  
    const changeValue = (e, fileId = "") => {
      const { value, name } = e.target;
  
      if (fileId !== "") {
        const selectedFile = e.target.files[0];
        const updateFileList = post.fileList.map((item) => {
          if (item.id === fileId) {
            return { ...item, sourcename: selectedFile };
          }
          return item;
        });
        setPost({ ...post, fileList: updateFileList });
      } else {
        setPost({ ...post, [name]: value });
      }
    };
  
    const fileAdd = () => {
      if (post.fileList.length < 10) {
        setPost({
          ...post,
          fileList: [
            ...post.fileList,
            { id: post.fileList.length + 1, sourcename: null },
          ],
        });
      } else {
        alert("파일은 10개까지만 추가 됩니다.");
      }
    };
  
    const fileDelete = (id) => {
  
      const updateFileList = post.fileList.filter((item) => item.id !== id);
  
      setPost({ ...post, fileList: updateFileList });
    };
  
    const writeSubmit = async (e) => {
      e.preventDefault();
  
      const formData = new FormData();
  
      const json = JSON.stringify({
        subject: post.subject,
        content: post.content,
      });
  
      formData.append('post', new Blob([json],{type:'application/json'}));
  
      post.fileList.forEach((item, idx) => {
        if (item.sourcename) {
          formData.append(`files[file${idx}]`, item.sourcename);
        }
      });
  
      // const response = await api.post(
      //   `http://localhost:8070/${hompyId}/${postName}/${folderId}/write`,
      //   formData,
      //   {
      //     headers: {
      //       "Content-Type": "multipart/form-data",
      //     },
      //   }
      // );
      // const { data, status } = response;
  
      // if (status === 200) {
      //   alert("작성성공", data);
      //   if(postName.includes('board')) navigate(`/post/${hompyId}/${postName}/${folderId}/detail/${data}`);
      //   else{
      //     dispatch(PostAction.axiosPostList(hompyId,postName,folderId))
      //     navigate(`/post/${hompyId}/${postName}/`)
      //   }
      // } else {
      //   alert("작성실패");
      //   navigate(-1);
      // }
      dispatch(PostAction.createPostAxios(hompyId,postName,folderId,formData,navigate))
  
  
    };
  
    return parseInt(hompyId) === hompyInfo?.id && (
      <Container>
        <div>{postName && nameCheck(postName)+' 작성'}</div>
        <Form onSubmit={writeSubmit} encType="multipart/form-data">
          <Form.Group controlId="formSubject">
            <Form.Label>제목 :</Form.Label>
            <Form.Control
              type="text"
              name="subject"
              value={post.subject}
              onChange={changeValue}
              placeholder="제목을 입력하세요."
            />
          </Form.Group>
          <Form.Group controlId="formContent">
            <Form.Control
              as="textarea"
              name="content"
              value={post.content}
              onChange={changeValue}
              placeholder="내용을 입력하세요."
              rows={3}
            />
          </Form.Group>
          <div className="write-button-group">
            <div>
              <Button type="button" onClick={fileAdd}>
                파일추가
              </Button>
            </div>
            <div>
              <Button type="submit">작성완료</Button>
              <Button type="button" onClick={() => navigate(-1)}>
                이전으로
              </Button>
            </div>
          </div>
  
          {post.fileList.map((item, idx) => (
            <Form.Group key={item.id} className="files">
              <Form.Control
                type="file"
                name={`upfile${item.id}`}
                onChange={(e) => changeValue(e, item.id)}
              />
              <Button
                type="button"
                variant="danger"
                onClick={() => fileDelete(item.id)}
              >
                삭제
              </Button>
            </Form.Group>
          ))}
        </Form>
      </Container>
    );
  };
  

export default PostWrite;
