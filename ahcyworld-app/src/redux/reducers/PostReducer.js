let initialState ={
  pageAndPostList : [],
  post:null
}

function PostReducer(state=initialState, action){
  let {type,payload}= action

  switch(type){
    case "GET_POST_LIST":
      return{...state, pageAndPostList:payload.data}
    case "FIND_POST":
      return{...state, post:payload.data}
    case "MOVE_POST_FOLDER":
      return{...state, 
        pageAndPostList:state.pageAndPostList
        .map(item => item.id === payload.data.id ? payload.data: item)}
    case  "DELETE_POST":
      return{...state,
        pageAndPostList:state.pageAndPostList
        .filter(item => item.id !== payload.postId)
      }
    case "DETAIL_POST":
      return{...state,
        post:payload.data
      }
    default:
      return{...state}
  }

}

export default PostReducer;
