const initialState ={
  commentList:[],
  comment:{},
  photoAndVideoCommentList:[]
}

function CommentReducer(state=initialState,action){




  const {type,payload} = action;
  
  switch(type){
    case "BOARD_COMMENT_LIST":
      return{...state,commentList:payload.data}
    case "PHOTO_AND_VIDEO_COMMENT_LIST":
      return { ...state, photoAndVideoCommentList: [...state.photoAndVideoCommentList, payload.data] };
    case "PHOTO_VIDEO_UPDATE":
      return {...state, photoAndVideoCommentList: 
        state.photoAndVideoCommentList.map(item => parseInt(item.postId) === parseInt(payload.postId)? payload : item)
    }
    default:
      return{...state}
  }
}



export default CommentReducer;