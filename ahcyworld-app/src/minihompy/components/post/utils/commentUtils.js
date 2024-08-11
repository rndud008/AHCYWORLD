import { CommentAction } from "../../../../redux/actions/CommentAction";

export const commentListAxios = async (dispatch, postId, postName) => {
  try {
    await dispatch(CommentAction.commentListAxios(postId,postName));
  } catch (e) {
    alert(e);
  }
};

export const commentWriteAxios = async (dispatch, userInfo, post, content, postName) => {
  try {
    await dispatch(CommentAction.commentWriteAxios(userInfo, post, content,postName));
  } catch (e) {
    alert(e);
  }
};

export const commentDeleteAxios = async (dispatch, commentId, postId,postName) =>{
  try{
    await dispatch(CommentAction.commentDeleteAxios(commentId, postId, postName))
    
  }catch(e){
    alert(e)
  }
} 

export const showState =(dispatch,state) =>{

  let data;
  if(state === false ){
    data = true;
  }else if(state === true){
    data =false
  }

  console.log('first',data)

  dispatch(CommentAction.showState(data))
}

export const contentState = (dispatch,data) =>{
  dispatch(CommentAction.contentState(data))
}
