import { useNavigate } from "react-router-dom";
import api from "../../login/apis/api";
import Cookies from "js-cookie";

function axiosPostList(hompyId, postName, folderId, page = 0) {
  return async (dispatch, getState) => {
    const response = await api.get(
      `http://localhost:8070/${hompyId}/${postName}/${folderId}/list?page=${page}`
    );
    const { data } = response;

    dispatch({ type: "GET_POST_LIST", payload: { data } });
  };
}

function findPostAxios(hompyId, postName, folderId, postId) {
  return async (dispatch, getState) => {
    const response = await api.get(
      `http://localhost:8070/${hompyId}/${postName}/${folderId}/update/${postId}`,
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
      `http://localhost:8070/${hompyId}/${postName}/${folderId}/detail/${postId}/${moveFolderId}`
    );

    const { data, status } = response;

    if (parseInt(status) === 200) {
      alert("폴더 변경 성공.");
      dispatch({ type: "MOVE_POST_FOLDER", payload: { data } });
      navigate(
        `/post/${hompyId}/${postName}/${data.folder.id}/detail/${postId}`
      );
    } else {
      alert("폴더 변경 실패");
      navigate(`/post/${hompyId}/${postName}/${folderId}`);
    }
  };
}

function deletePostAxios(hompyId, postName, folderId, postId, navigate) {
  return async (dispatch, getState) => {
    const response = await api.delete(
      `http://localhost:8070/${hompyId}/${postName}/${folderId}/delete/${postId}`
    );
    const { status } = response;

    if (status === 200) {
      alert("삭제 성공.");
      navigate(`/post/${hompyId}/${postName}/${folderId}`);
      dispatch({ type: "DELETE_POST", payload: { postId } });
    } else {
      alert("삭제 실패.");
      navigate(-1);
    }
  };
}

function createPostAxios(hompyId,postName,folderId,formData,navigate){
  return async (dispatch,getState) =>{
    const response = await api.post(
      `http://localhost:8070/${hompyId}/${postName}/${folderId}/write`,
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
      dispatch(PostAction.axiosPostList(hompyId,postName,folderId))
      if(postName.includes('board')) {
        navigate(`/post/${hompyId}/${postName}/${folderId}/detail/${data}`);
      }
      else{
        navigate(`/post/${hompyId}/${postName}/${folderId}`)
      }
    } else {
      alert("작성실패");
      navigate(`/post/${hompyId}/${postName}/`);
    }
  }
}

function detailPostAxios(hompyId,postName,folderId,postId,navigate){
  return async(dispatch,getState)=>{
    const response = await api.get(
      `http://localhost:8070/${hompyId}/${postName}/${folderId}/detail/${postId}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      }
    );

    const { data, status } = response;

    if (status === 200) {
      dispatch({type:"DETAIL_POST",payload:{data}});
    } else {
      navigate("/");
    }
  }
}

export const PostAction = {
  axiosPostList,
  findPostAxios,
  movePostFolderAxios,
  deletePostAxios,
  createPostAxios,
  detailPostAxios,
};
