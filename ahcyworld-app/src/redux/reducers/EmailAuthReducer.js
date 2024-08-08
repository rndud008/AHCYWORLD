let initialState ={
  authValueCheck:{}
}

function EmailAuthReducer(state = initialState, action){

  let {type,payload} = action;

  switch(type){
    case "AUTH_VALUE_CREATE":
      return{...state,authValueCheck:payload.data}
    case "EMAIL_RE_VALUE_DELETE":
      return{...state,authValueCheck:{}}
    case "EMAIL_AUTH_SUCCESS":
      return{...state,authValueCheck:payload.data}
    default:
      return{...state}
  }
}

export default EmailAuthReducer;