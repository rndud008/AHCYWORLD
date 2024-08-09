import api from "../../apis/api";
import { SERVER_HOST } from "../../apis/api";

function commentListAxios(postId,postName) {
  return async (dispatch, getState) => {
    try {
      const response = await api.get(`${SERVER_HOST}/comment/list/${postId}`);
      const { data, status } = response;

      if(postName.includes('board')){
        if (status === 200) {
          dispatch({ type: "BOARD_COMMENT_LIST", payload: { data } });
        }
      }else{
        dispatch(CommentAction.photoAndVideoCommentListAxios(postId))
      }

    } catch (e) {
      throw e;
    }
  };
}

function commentWriteAxios(user, post, content,postName) {
  return async (dispatch, getState) => {
    try {
      const response = await api.post(
        `${SERVER_HOST}/comment/write`,
        { user, post, content },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const { data, status } = response;

      if(postName.includes('board')){

        if (status === 200) {
          dispatch(CommentAction.commentListAxios(post.id));
        }
      }else{
        dispatch(CommentAction.photoAndVideoUpdate(post.id))
      }
    } catch (e) {
      throw e;
    }
  };
}

function commentDeleteAxios(commentId,postId,postName){
  return async(dispatch,getState)=>{
    try{
      const response = await api.delete(`${SERVER_HOST}/comment/delete/${commentId}`)
      const {data,status}= response;
  
      if(postName.includes('board')){

        if(status === 200){
          dispatch(CommentAction.commentListAxios(postId));
        }
      }else{
        dispatch(CommentAction.photoAndVideoUpdate(postId))
      }
    }catch(e){
      throw e
    }
    
  }
}

function photoAndVideoCommentListAxios(postId){
  return async(dispatch,getState)=>{
    try {
      const response = await api.get(`${SERVER_HOST}/comment/list/${postId}`);
      const { data, status } = response;

      if (status === 200) {
        dispatch({ type: "PHOTO_AND_VIDEO_COMMENT_LIST", payload: { data } });
      }
    } catch (e) {
      throw e;
    }
  }
}

function photoAndVideoUpdate(postId){
  return async (dispatch,getState)=>{
    const response = await api.get(`${SERVER_HOST}/comment/list/${postId}`);
    const { data, status } = response;

    dispatch({type:"PHOTO_VIDEO_UPDATE",payload:data})
  }
}


export const CommentAction = { commentListAxios, commentWriteAxios, commentDeleteAxios, photoAndVideoCommentListAxios,photoAndVideoUpdate };
