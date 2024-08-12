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
  const { postName } = useParams();
  const { userInfo } = useContext(LoginContext);
  const dispatch = useDispatch();

  const photoAndVideoCommentList = useSelector(
    (state) => state.comment.photoAndVideoCommentList
  );
  const result = photoAndVideoCommentList.find(
    (findItem) => parseInt(findItem.postId) === parseInt(item.id)
  );

  console.log(photoAndVideoCommentList, "???");
  console.log(item, "????");
  console.log(result && result);

  const content = useSelector((state) => state.comment.content);

  return (
    <>
      <div className="postDetailCommentTool photoAndVideoToggle">
        <div className="commentToggle">
          <Button onClick={() => setCommentShow(!commentShow)}>
            {commentShow === false ? "댓글보기" : "댓글닫기"}
          </Button>
        </div>
        <div className="commentInputSection">
          <input
            onChange={(e) => contentState(dispatch, e.target.value)}
            placeholder="댓글입력"
          />
          <Button
            onClick={() =>
              commentWriteAxios(dispatch, userInfo, item, content, postName)
            }
          >
            확인
          </Button>
        </div>
      </div>

      {commentShow && (
        <div className="postDetailListCommentList">
          {console.log(result, "???????")}
          {result?.data?.length === 0 ? (
            <div className="commentNotFound">작성된 댓글이 없습니다.</div>
          ) : (
            result?.data.map((item) => (
              <>
                <div className="postDetailComment">
                  <p>{item.user.name}</p>
                  <p>{item.createAt}</p>
                  {item.user.id === userInfo.id && (
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
