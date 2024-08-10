import api, { SERVER_HOST } from "../../apis/api"

function findByHompyIdAxios(hompyId){
  return async(dispatch,getState) =>{
    try{
      const response = await api.get(`${SERVER_HOST}/hompy/${hompyId}`)
      const {data, status} = response;
  
      if(status === 200){
        dispatch({type:"HOMPY_FIND_BY_HOMPYID",payload:{data}})
      }
    }catch(e){
      throw e
    }
  }
}



export const HompyAction ={findByHompyIdAxios}