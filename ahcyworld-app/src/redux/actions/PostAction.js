import api from "../../login/apis/api"

function axiosPostList(hompyId,postName,folderId,page = 0){

  return async (dispatch,getState)=>{

    const response = await api.get(`http://localhost:8070/${hompyId}/${postName}/${folderId}/list?page=${page}`);
    const {data} = response;

    dispatch({type:"GET_POST_LIST",payload:{data}})

  }
}


export const PostAction ={axiosPostList}