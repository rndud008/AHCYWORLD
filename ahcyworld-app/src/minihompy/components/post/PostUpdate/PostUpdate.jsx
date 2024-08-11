import React, { useContext, useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fileAdd,
  fileDelete,
  fileReCreate,
  findPost,
  nameCheck,
  updateSubmit,
  writeAndUpdateChangeValue,
} from "../utils/postUtils";
import { LoginContext } from "../../../../webpage/components/login/context/LoginContextProvider";

const PostUpdate = () => {
  const { hompyId, postName, folderId, postId } = useParams();
  const { hompyInfo } = useContext(LoginContext);

  const [post, setPost] = useState();
  const [originFileList, setOriginFileList] = useState();

  const dispatch = useDispatch();
  const originPost = useSelector((state) => state.post.post);

  const navigate = useNavigate();

  useEffect(() => {
    findPost(dispatch, hompyId, postName, folderId, postId);
  }, []);

  useEffect(() => {
    if (originPost !== undefined) {
      setPost({ ...originPost, fileList: [{ id: 1, sourceName: null }] });
      setOriginFileList(originPost?.fileList ? originPost.fileList : []);
    }
  }, [originPost]);

  return (
    parseInt(hompyId) === hompyInfo?.id && (
      <Container>
        <div>{postName && nameCheck(postName) + "수정"}</div>
        <Form
          onSubmit={(e) =>
            updateSubmit(
              e,
              post,
              originFileList,
              hompyId,
              postName,
              folderId,
              navigate,
              postId,
              dispatch
            )
          }
          encType="multipart/form-data"
        >
          <Form.Group controlId="formSubject">
            <Form.Label>제목 :</Form.Label>
            <Form.Control
              type="text"
              name="subject"
              value={post?.subject}
              onChange={(e) => writeAndUpdateChangeValue(e, "", post, setPost)}
              placeholder="제목을 입력하세요."
            />
          </Form.Group>

          <Form.Group controlId="formContent">
            <Form.Control
              as="textarea"
              name="content"
              value={post?.content}
              onChange={(e) => writeAndUpdateChangeValue(e, "", post, setPost)}
              placeholder="내용을 입력하세요."
              rows={3}
            />
          </Form.Group>

          <div className="write-button-group">
            <div>
              <Button
                type="button"
                onClick={() => fileAdd(post, setPost, "UPDATE", originFileList)}
              >
                파일추가
              </Button>
            </div>
            <div>
              <Button type="submit">수정완료</Button>
              <Button type="button" onClick={() => navigate(-1)}>
                이전으로
              </Button>
            </div>
          </div>

          {originFileList &&
            originFileList?.map((item, idx) => (
              <Form.Group key={item.id} className="files">
                <Form.Control
                  type="text"
                  name={`originFileList${item.id}`}
                  value={item.sourceName}
                  readOnly
                />
                {item?.status !== false ? (
                  <Button
                    type="button"
                    variant="danger"
                    name="originFileList"
                    onClick={(e) =>
                      fileDelete(
                        item.id,
                        post,
                        setPost,
                        e,
                        "UPDATE",
                        originFileList,
                        setOriginFileList
                      )
                    }
                  >
                    삭제
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="danger"
                    name="originFileList"
                    onClick={() =>
                      fileReCreate(item.id, originFileList, setOriginFileList)
                    }
                  >
                    삭제취소
                  </Button>
                )}
              </Form.Group>
            ))}

          {post?.fileList.map((item, idx) => (
            <Form.Group key={item.id} className="files">
              <Form.Control
                type="file"
                name={`fileList${item.id}`}
                onChange={(e) =>
                  writeAndUpdateChangeValue(e, item.id, post, setPost)
                }
              />
              <Button
                type="button"
                variant="danger"
                name="fileList"
                onClick={(e) =>
                  fileDelete(item.id, post, setPost, e, "UPDATE", "", "")
                }
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

export default PostUpdate;
