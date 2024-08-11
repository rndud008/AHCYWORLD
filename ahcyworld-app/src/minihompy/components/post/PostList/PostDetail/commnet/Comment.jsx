import React, { useContext } from "react";
import {
  commentDeleteAxios,
  commentWriteAxios,
  contentState,
  showState,
} from "../../../utils/commentUtils";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { LoginContext } from "../../../../../../webpage/login/context/LoginContextProvider";
import { useParams } from "react-router-dom";

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
      <div>
        <Button onClick={() => showState(dispatch, show)}>
          {show === false ? "댓글보기" : "댓글닫기"}
        </Button>
      </div>
      {show && (
        <div>
          {commentList.count === 0
            ? "작성된 댓글이 없습니다."
            : commentList.data?.map((item) => (
                <div style={{ display: "flex" }}>
                  <p>{item.user.name}</p>
                  <p>{item.createAt}</p>
                  <p>{item.content}</p>

                  {item.user.id === userInfo.id && (
                    <Button
                      onClick={() =>
                        commentDeleteAxios(dispatch, item.id, postId, postName)
                      }
                    >
                      삭제
                    </Button>
                  )}
                </div>
              ))}
        </div>
      )}

      <div>
        <label>댓글</label>
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
    </>
  );
};

export default Comment;
