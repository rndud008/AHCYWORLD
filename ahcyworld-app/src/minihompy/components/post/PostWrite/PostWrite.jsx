import React, { useContext, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import "./PostWrite.style.css";
import {
  fileAdd,
  fileDelete,
  nameCheck,
  writeAndUpdateChangeValue,
  writeSubmit,
} from "../utils/postUtils";
import { useDispatch, useSelector } from "react-redux";
import { LoginContext } from "../../../../webpage/components/login/context/LoginContextProvider";

const PostWrite = () => {
  const { hompyId, postName, folderId } = useParams();
  const { hompyInfo } = useContext(LoginContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const errors = useSelector((state) => state.post.errors);

  const [post, setPost] = useState({
    subject: "",
    content: "",
    fileList: [{ id: 1, sourceName: null }],
  });

  return (
    parseInt(hompyId) === hompyInfo?.id && (
      <Container>
        <div className="postName">
          {postName && nameCheck(postName) + " 작성"}
        </div>
        <Form
          onSubmit={(e) =>
            writeSubmit(
              e,
              post,
              dispatch,
              hompyId,
              postName,
              folderId,
              navigate
            )
          }
          encType="multipart/form-data"
        >
          <Form.Group className="postSubject" controlId="formSubject">
            <Form.Label>제목 :</Form.Label>
            <Form.Control
              type="text"
              name="subject"
              value={post.subject}
              onChange={(e) => writeAndUpdateChangeValue(e, "", post, setPost,dispatch)}
              placeholder="제목을 입력하세요."
            />
          </Form.Group>
          {errors.subject && <div className="post-error-message">{errors.subject}</div>}
          <Form.Group className="postContent" controlId="formContent">
            <Form.Label>내용 :</Form.Label>
            <Form.Control
              as="textarea"
              name="content"
              value={post.content}
              onChange={(e) => writeAndUpdateChangeValue(e, "", post, setPost,dispatch)}
              placeholder="내용을 입력하세요."
              rows={3}
            />
          </Form.Group>
          {errors.content && <div className="post-error-message">{errors.content}</div>}
          <div className="post-button-group">
            <div>
              <Button
                type="button"
                onClick={() => fileAdd(post, setPost, "CREATE", "")}
              >
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

          <Form.Group className="files">
          {post.fileList.map((item, idx) => (
            <div className="file">
              <Form.Control
                type="file"
                name={`upfile${item.id}`}
                onChange={(e) =>
                  writeAndUpdateChangeValue(e, item.id, post, setPost)
                }
              />
              <Button
                type="button"
                variant="danger"
                name="fileList"
                onClick={(e) =>
                  fileDelete(item.id, post, setPost, e, "CREATE", "", "")
                }
              >
                삭제
              </Button>
            </div>
          ))}
          </Form.Group>
        </Form>
      </Container>
    )
  );
};

export default PostWrite;
