import React, { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, ListGroup, ListGroupItem } from "react-bootstrap";
import { LoginContext } from "../../../../../webpage/components/login/context/LoginContextProvider";
import { useDispatch, useSelector } from "react-redux";
import {
  detailPage,
  download,
  handleOpen,
  postDelete,
  postList,
} from "../../utils/postUtils";
import { commentListAxios } from "../../utils/commentUtils";
import Comment from "./commnet/Comment";
import PostModal from "./PostModal/PostModal";

const PostDetail = () => {
  const { userInfo, hompyInfo } = useContext(LoginContext);
  const { hompyId, postName, folderId, postId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const post = useSelector((state) => state.post.post);

  useEffect(() => {
    detailPage(dispatch, hompyId, postName, folderId, postId, navigate);
    commentListAxios(dispatch, postId, postName);
  }, []);

  return (
    <>
      <>
        <div>
          <div>
            <h4>{post?.subject}</h4>
          </div>
          <div>
            <Button
              onClick={() => postList(navigate, hompyId, postName, folderId)}
            >
              목록
            </Button>
            {parseInt(hompyId) === hompyInfo?.id && (
              <>
                <Button onClick={() => handleOpen(dispatch)}>이동</Button>
                <Button
                  onClick={() =>
                    navigate(
                      `/hompy/${hompyId}/${postName}/${folderId}/update/${postId}`
                    )
                  }
                >
                  수정
                </Button>
                <Button
                  onClick={() =>
                    postDelete(
                      dispatch,
                      hompyId,
                      postName,
                      folderId,
                      postId,
                      navigate
                    )
                  }
                >
                  삭제
                </Button>
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
          <Comment />
        </div>
      </>
      {parseInt(hompyId) === hompyInfo?.id && (
        <>
          <PostModal />
        </>
      )}
    </>
  );
};
export default PostDetail;
