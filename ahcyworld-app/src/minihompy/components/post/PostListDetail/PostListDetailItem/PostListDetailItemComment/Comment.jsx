import React, { useContext } from "react";

import { useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import {
  commentDeleteAxios,
  commentWriteAxios,
  contentState,
} from "../../../utils/commentUtils";
import { LoginContext } from "../../../../../../webpage/components/login/context/LoginContextProvider";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import "./Comment.style.css";

const Comment = ({ commentShow, item, setCommentShow }) => {
  const { postName, hompyId } = useParams();
  const { userInfo ,roles, hompyInfo} = useContext(LoginContext);
  const dispatch = useDispatch();

  const photoAndVideoCommentList = useSelector(
    (state) => state.comment.photoAndVideoCommentList
  );
  const result = photoAndVideoCommentList.find(
    (findItem) => parseInt(findItem.postId) === parseInt(item.id)
  );
  const content = useSelector((state) => state.comment.content);
  const error = useSelector(state => state.comment.error);

  return (
    <>
      {result &&
      <>
      <div className="postDetailCommentTool photoAndVideoToggle">
        <div className="commentToggle">
          <Button className="commentToggle-btn" onClick={() => setCommentShow(!commentShow)}>
            {commentShow === false ? "댓글보기" : "댓글닫기"}
          </Button>
        </div>
        <div className="commentInputSection">
          <input
            value={content.id === result.postId ? content.content : ""}
            onChange={(e) => contentState(e.target.value, dispatch,result.postId)}
            placeholder="댓글입력"
          />
          <Button
            className="commentwrite-btn"
            onClick={() =>
              commentWriteAxios(dispatch, userInfo, item, content, postName)
            }
          >
            등록
          </Button>
        </div>
      </div>
      {( error.postId=== result.postId) && error.content && <div className="post-error-message">{error.content}</div>}
      
      </>
      }

      {commentShow && (
        <div className="postDetailListCommentList">
          {result?.data?.length === 0 ? (
            <div className="commentNotFound">작성된 댓글이 없습니다.</div>
          ) : (
            result?.data.map((item) => (
              <>
                <div className="postDetailComment">
                  <p>{item.user.name}</p>
                  <p>{item.createAt}</p>
                  {(item.user.id === userInfo.id  || roles.isAdmin || hompyInfo.id === parseInt(hompyId)) && (
                    <Button
                      onClick={() =>
                        commentDeleteAxios(
                          dispatch,
                          item.id,
                          item.post.id,
                          postName
                        )
                      }
                    >
                      <FontAwesomeIcon icon={faCircleXmark} />
                    </Button>
                  )}
                </div>
                <p>{item.content}</p>
              </>
            ))
          )}
        </div>
      )}
    </>
  );
};

export default Comment;
