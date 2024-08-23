let initialstate = {
  hompy:{}
}

function HompyReducer(state=initialstate,action){
  const {type, payload} = action;

  switch(type){
    case "HOMPY_FIND_BY_HOMPYID":
      return{...state,hompy:payload.data}
    case "HOMPY_UPDATE":
      return{...state,hompy:payload.data}
    default:
      return{...state}
  }

}

export default HompyReducer;