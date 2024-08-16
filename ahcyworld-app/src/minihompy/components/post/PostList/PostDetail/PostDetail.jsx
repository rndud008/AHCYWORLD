import React, { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Container, ListGroup, ListGroupItem } from "react-bootstrap";
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
import "./PostDetail.style.css"
import "react-color-palette/css";
import { ColorPicker, useColor } from "react-color-palette";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

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
  const [color,setColor] = useColor('#561ecb')

  return (
    <>
    {post.id && 
      <Container>
        <div className="postDetail">
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
        <div className="postDetailHeader">
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
          <ListGroup className="postDetailDownloadList">
          {post?.fileList.map((item) => (
              <ListGroupItem className="postDetailDownload">
                  <span>{item.sourceName}</span>
                <Button onClick={() => download(item)}>
                <FontAwesomeIcon icon={faDownload} />
                </Button>
              </ListGroupItem>
          ))}
          </ListGroup>
        </div>
        <div className="postDetailContent">
          <span>{post?.content}</span>
        </div>

          <Comment />

        {parseInt(hompyId) === hompyInfo?.id && (
          <>
            <PostModal />
          </>
        )}
      </Container>
    }
    </>
  );
};
export default PostDetail;
