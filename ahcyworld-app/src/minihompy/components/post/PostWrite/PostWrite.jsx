import React, { useContext, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import "./PostWrite.css";
import { fileAdd, fileDelete, nameCheck, writeAndUpdateChangeValue, writeSubmit } from "../utils/postUtils";
import { useDispatch } from "react-redux";
import { LoginContext } from "../../../../webpage/login/context/LoginContextProvider";

const PostWrite = () => {
  const { hompyId, postName, folderId } = useParams();
  const { hompyInfo } = useContext(LoginContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [post, setPost] = useState({
    subject: "",
    content: "",
    fileList: [{ id: 1, sourceName: null }],
  });

  return (
    parseInt(hompyId) === hompyInfo?.id && (
      <Container>
        <div>{postName && nameCheck(postName) + " 작성"}</div>
        <Form onSubmit={(e) =>writeSubmit(e,post,dispatch,hompyId,postName,folderId,navigate)} encType="multipart/form-data">
          <Form.Group controlId="formSubject">
            <Form.Label>제목 :</Form.Label>
            <Form.Control
              type="text"
              name="subject"
              value={post.subject}
              onChange={(e) => writeAndUpdateChangeValue(e,"",post,setPost)}
              placeholder="제목을 입력하세요."
            />
          </Form.Group>
          <Form.Group controlId="formContent">
            <Form.Control
              as="textarea"
              name="content"
              value={post.content}
              onChange={(e) => writeAndUpdateChangeValue(e,"",post,setPost)}
              placeholder="내용을 입력하세요."
              rows={3}
            />
          </Form.Group>
          <div className="write-button-group">
            <div>
              <Button type="button" onClick={() => fileAdd(post,setPost,"CREATE","")}>
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
                onChange={(e) => writeAndUpdateChangeValue(e,item.id,post,setPost)}
              />
              <Button
                type="button"
                variant="danger"
                name="fileList"
                onClick={(e) => fileDelete(item.id, post, setPost, e, "CREATE","","")}
              >
                삭제
              </Button>
            </Form.Group>
          ))}
        </Form>
      </Container>
    )
  );
};

export default PostWrite;
