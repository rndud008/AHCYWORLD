import React, { useContext } from "react";
import {
  commentDeleteAxios,
  commentWriteAxios,
  contentState,
  showState,
} from "../../../utils/commentUtils";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { LoginContext } from "../../../../../../webpage/components/login/context/LoginContextProvider";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import "./Comment.style.css"

const Comment = () => {
  const { userInfo } = useContext(LoginContext);
  const { postId, postName } = useParams();
  const dispatch = useDispatch();
  const commentList = useSelector((state) => state.comment.commentList);
  const show = useSelector((state) => state.comment.show);
  const content = useSelector((state) => state.comment.content);
  const post = useSelector((state) => state.post.post);

  return (
    <>
      <div className="postDetailCommentTool">
        <div  className="commentToggle">
          <Button onClick={() => showState(dispatch, show)}>
            {show === false ? "댓글보기" : "댓글닫기"}
          </Button>
        </div>
        <div className="commentInputSection">
          <input
            onChange={(e) => contentState(dispatch, e.target.value)}
            placeholder="댓글입력"
          />
          <Button
            onClick={() =>
              commentWriteAxios(dispatch, userInfo, post, content, postName)
            }
          >
            확인
          </Button>
        </div>
      </div>
      {show && (
        <div className="postDetailCommentList">
          {commentList.count === 0
            ? <div className="commentNotFound">작성된 댓글이 없습니다.</div>
            : commentList.data?.map((item) => (
              <>
                <div className="postDetailComment">
                  <p>{item.user.name}</p>
                  <p>{item.createAt}</p>
                  {item.user.id === userInfo.id && (
                    <Button
                    onClick={() =>
                      commentDeleteAxios(dispatch, item.id, postId, postName)
                    }
                    >
                      <FontAwesomeIcon icon={faCircleXmark} />
                    </Button>
                  )}
                </div>
                  <p>{item.content}</p>
              </>
              ))}
        </div>
      )}
    </>
  );
};

export default Comment;
