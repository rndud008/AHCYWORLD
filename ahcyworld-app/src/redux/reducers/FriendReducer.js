let initialState={
  hompyFriendList:[]
}

function FriendReducer(state=initialState,action){

  const{type,payload}=action;

  switch(type){
    case "HOMPY_FRIEND_LIST":
      return{...state,hompyFriendList:payload.data}
    default:
      return{...state};
  }
}

export default FriendReducer;