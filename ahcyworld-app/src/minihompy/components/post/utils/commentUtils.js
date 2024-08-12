import { CommentAction } from "../../../../redux/actions/CommentAction";
import * as Swal from "../../../../apis/alert"
export const commentListAxios = async (dispatch, postId, postName) => {
  try {
    await dispatch(CommentAction.commentListAxios(postId,postName));
  } catch (e) {
    Swal.alert("댓글정보를 불러오는데 실패했습니다",e,"error")
    
  }
};

export const commentWriteAxios = async (dispatch, userInfo, post, content, postName) => {
  try {
    await dispatch(CommentAction.commentWriteAxios(userInfo, post, content,postName));
    Swal.alert("댓글작성을 성공했습니다.","작성완료","success")
  } catch (e) {
    Swal.alert("댓글작성을 실패했습니다",e,"error")
  }
};

export const commentDeleteAxios = async (dispatch, commentId, postId,postName) =>{
  
  
  try{
      
    if(!window.confirm('삭제하시겠습니까?')) return;

    await dispatch(CommentAction.commentDeleteAxios(commentId, postId, postName))
    Swal.alert("댓글 삭제 완료.","삭제완료","success")
  }catch(e){
    Swal.alert("댓글삭제를 실패했습니다",e,"error")
  }
} 

export const showState =(dispatch,state) =>{

  let data;
  if(state === false ){
    data = true;
  }else if(state === true){
    data =false
  }

  dispatch(CommentAction.showState(data))
}

export const contentState = (dispatch,data) =>{
  dispatch(CommentAction.contentState(data))
}


export const photoAndVideoCommentListAxios = async (dispatch,postId) => {
  try {
    await dispatch(CommentAction.photoAndVideoCommentListAxios(postId));
  } catch (e) {
    Swal.alert("댓글정보를 받아오는데 실패했습니다","다시한번 시도해주세요.","error")
  }
};
