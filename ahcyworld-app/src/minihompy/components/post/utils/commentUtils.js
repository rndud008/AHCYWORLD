import { CommentAction } from "../../../../redux/actions/CommentAction";
import * as Swal from "../../../../apis/alert";
import { faL } from "@fortawesome/free-solid-svg-icons";
export const commentListAxios = async (dispatch, postId, postName) => {
  try {
    await dispatch(CommentAction.commentListAxios(postId, postName));
  } catch (e) {
    Swal.alert("댓글정보를 불러오는데 실패했습니다", e, "error");
  }
};

export const commentWriteAxios = async (
  dispatch,
  userInfo,
  post,
  content,
  postName
) => {
  try {

    const valid = commentValidation(dispatch, content.content, post.id);

    if(!valid) return;

    await dispatch(
      CommentAction.commentWriteAxios(userInfo, post, content.content, postName)
    );
    Swal.alert("댓글작성을 성공했습니다.", "작성완료", "success");
    dispatch(CommentAction.contentState(false,""));
  } catch (e) {
    Swal.alert("댓글작성을 실패했습니다", e, "error");
  }
};

function commentValidation (dispatch,content,postId){

  let valid = true;
  
  if(!content || content.trim() === ""){

    dispatch(CommentAction.contentErrorState(postId,"댓글을 작성해주세요."))
    valid = false;
  }else{
    dispatch(CommentAction.contentErrorState(postId,false))
  }

  return valid;
}

export const commentDeleteAxios = async (
  dispatch,
  commentId,
  postId,
  postName
) => {
  try {
    if (!window.confirm("삭제하시겠습니까?")) return;

    await dispatch(
      CommentAction.commentDeleteAxios(commentId, postId, postName)
    );

    Swal.alert("댓글 삭제 완료.", "삭제완료", "success");
  } catch (e) {
    Swal.alert("댓글삭제를 실패했습니다", e, "error");
  }
};

export const showState = (dispatch, state) => {
  let data;
  if (state === false) {
    data = true;
  } else if (state === true) {
    data = false;
  }

  dispatch(CommentAction.showState(data));
};

export const contentState = ( data,dispatch,postId) => {
  commentValidation (dispatch, data, postId)
  dispatch(CommentAction.contentState(data,postId));
};

export const photoAndVideoCommentListAxios = async (dispatch, postId) => {
  try {
    await dispatch(CommentAction.photoAndVideoCommentListAxios(postId));
  } catch (e) {
    Swal.alert(
      "댓글정보를 받아오는데 실패했습니다",
      "다시한번 시도해주세요.",
      "error"
    );
  }
};
