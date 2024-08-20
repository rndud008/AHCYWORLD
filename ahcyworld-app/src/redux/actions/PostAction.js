import api, { SERVER_HOST } from "../../apis/api";
import Cookies from "js-cookie";
import { FolderAction } from "./FolderAction";

function axiosPostList(hompyId, postName, folderId, page = 0) {
  return async (dispatch, getState) => {
    try {
      console.log('try PostAction axiosPostList 실행')
      const response = await api.get(
        `${SERVER_HOST}/${hompyId}/${postName}/${folderId}/list?page=${page}`
      );
      const { data } = response;

      dispatch({ type: "GET_POST_LIST", payload: { data } });
      
    } catch (e) {

      throw e;
    }
  };
}

function findPostAxios(hompyId, postName, folderId, postId) {
  return async (dispatch, getState) => {
    const response = await api.get(
      `${SERVER_HOST}/${hompyId}/${postName}/${folderId}/update/${postId}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      }
    );
    const { data } = response;

    dispatch({ type: "FIND_POST", payload: { data } });
  };
}

function movePostFolderAxios(
  hompyId,
  postName,
  folderId,
  postId,
  moveFolderId,
  navigate
) {
  return async (dispatch, getState) => {
    const response = await api.put(
      `${SERVER_HOST}/${hompyId}/${postName}/${folderId}/detail/${postId}/${moveFolderId}`
    );

    const { data, status } = response;

    if (parseInt(status) === 200) {
      alert("폴더 변경 성공.");
      dispatch({ type: "MOVE_POST_FOLDER", payload: { data } });
      if(postName.includes('board')){
        dispatch(FolderAction.clickFolder(data.folder.id))
        navigate(
          `/hompy/${hompyId}/${postName}/${data.folder.id}/detail/${postId}`
        );
      }else{
        dispatch(PostAction.axiosPostList(hompyId, postName, data.folder.id))
        dispatch(FolderAction.clickFolder(data.folder.id))
        navigate(
          `/hompy/${hompyId}/${postName}/${data.folder.id}`
        );
      }
    } else {
      alert("폴더 변경 실패");
      navigate(`/hompy/${hompyId}/${postName}/${folderId}`);
    }
  };
}

function deletePostAxios(hompyId, postName, folderId, postId, navigate) {
  return async (dispatch, getState) => {
    const response = await api.delete(
      `${SERVER_HOST}/${hompyId}/${postName}/${folderId}/delete/${postId}`
    );
    const { status } = response;

    if (status === 200) {
      alert("삭제 성공.");
      dispatch({ type: "DELETE_POST", payload: { postId } });
      dispatch(PostAction.axiosPostList(hompyId, postName, folderId));
      navigate(`/hompy/${hompyId}/${postName}/${folderId}`);
    } else {
      alert("삭제 실패.");
      navigate(-1);
    }
  };
}

function createPostAxios(hompyId, postName, folderId, formData, navigate) {
  return async (dispatch, getState) => {
    const response = await api.post(
      `${SERVER_HOST}/${hompyId}/${postName}/${folderId}/write`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    const { data, status } = response;

    if (status === 200) {
      alert("작성성공", data);
      dispatch(PostAction.axiosPostList(hompyId, postName, folderId));
      if (postName.includes("board")) {
        navigate(`/hompy/${hompyId}/${postName}/${folderId}/detail/${data}`);
      } else {
        navigate(`/hompy/${hompyId}/${postName}/${folderId}`);
      }
    } else {
      alert("작성실패");
      navigate(`/hompy/${hompyId}/${postName}/`);
    }
  };
}

function detailPostAxios(hompyId, postName, folderId, postId, navigate) {
  return async (dispatch, getState) => {
    const response = await api.get(
      `${SERVER_HOST}/${hompyId}/${postName}/${folderId}/detail/${postId}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      }
    );

    const { data, status } = response;

    if (status === 200) {
      dispatch({ type: "DETAIL_POST", payload: { data } });
    } else {
      navigate("/");
    }
  };
}

function setPage(page){
  return (dispatch,getState)=>{
    dispatch({type:"SET_PAGE",payload:{page}})
  }
}

function showState(data){
  return(dispatch,getState) => {
    dispatch({type:"POST_SHOW_STATE",payload:{data}})
  }
}

function moveFolderIdState(data){
  return(dispatch,getState) =>{
    dispatch({type:"MOVE_FOLDER_ID_STATE",payload:{data}})
  }
}

function postUpdate(hompyId,postName,folderId,formData,navigate,postId){
  return async(dispatch,getState) =>{
    const response = await api.put(
      `http://localhost:8070/${hompyId}/${postName}/${folderId}/update`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  
    const { data, status } = response;
  
    if (status === 200) {
      if(postName.includes('board')){
        alert("수정완료", data);
        navigate(`/hompy/${hompyId}/${postName}/${folderId}/detail/${postId}`);
      }else{
        navigate(`/hompy/${hompyId}/${postName}/${folderId}`);
      }
      dispatch(PostAction.axiosPostList(hompyId, postName, folderId))
    } else {
      alert("수정실패");
      navigate(`/hompy/${hompyId}/${postName}`);
    }
  }
}

function postErrorState(name,value){
  return (dispatch,getState)=>{
    dispatch({type:"POST_ERROR_STATE",payload:{name,value}})
  }
}


export const PostAction = {
  axiosPostList,
  findPostAxios,
  movePostFolderAxios,
  deletePostAxios,
  createPostAxios,
  detailPostAxios,
  setPage,
  showState,
  moveFolderIdState,
  postUpdate,
  postErrorState,
};
