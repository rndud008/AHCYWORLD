import React, { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import "./PostWrite.css";
import api from "../../login/apis/api";
import { type } from "@testing-library/user-event/dist/type";

const nameCheck = (postName) => {
  if (postName === "board") return "게시물 작성";
  if (postName === "video") return "비디오 업로드";
  if (postName === "photo") return "사진 업로드";
};

const PostWrite = () => {
  const { hompyId, postName, folderId } = useParams();
  const navigate = useNavigate();
  console.log("hompyId", hompyId);
  console.log("postName", postName);
  console.log("folderId", folderId);

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
    console.log("delete value", id);

    const updateFileList = post.fileList.filter((item) => item.id !== id);

    setPost({ ...post, fileList: updateFileList });
  };

  useEffect(() => {
    console.log(post);
  }, [post]);

  const writeSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    const json = JSON.stringify({
      subject: post.subject,
      content: post.content,
    });

    // formData.append('post', json);
    formData.append('post', new Blob([json],{type:'application/json'}));

    post.fileList.forEach((item, idx) => {
      if (item.sourcename) {
        formData.append(`files[file${idx}]`, item.sourcename);
        console.log(`Appending file: ${item.sourcename.name}`); // 파일 이름 확인
      }
    });

    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    const response = await api.post(
      `http://localhost:8070/${hompyId}/${postName}/${folderId}/write`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    const { data, status } = response;
    console.log("data", data);
    console.log("status", status);

    if (status === 200) {
      alert("작성성공", data);
      if(postName.includes('board')) navigate(`/post/${hompyId}/${postName}/${folderId}/detail/${data}`);
      else{
        navigate(`/post/${hompyId}/${postName}/`)
      }
      
    } else {
      alert("작성실패");
      navigate(-1);
    }
  };

  return (
    <Container>
      <div>{postName && nameCheck(postName)}</div>
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
