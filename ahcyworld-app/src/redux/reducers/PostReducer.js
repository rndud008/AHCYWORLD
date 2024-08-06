let initialState ={
  pageAndPostList : []
}

function PostReducer(state=initialState, action){
  let {type,payload}= action

  switch(type){
    case "GET_POST_LIST":
      return {...state, pageAndPostList:payload.data}
    default:
      return{...state}
  }

}

export default PostReducer;
