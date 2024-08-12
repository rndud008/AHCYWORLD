import api, { SERVER_HOST } from "../../apis/api";
import Cookies from "js-cookie";

function getFolderListAxios(hompyId, postName) {
  return async (dispatch, getState) => {
    try {
      const response = await api.get(
        `${SERVER_HOST}/${hompyId}/${postName}/list`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );

      const { data } = response;

      dispatch({ type: "GET_FOLDER_LIST", payload: { data } });
    } catch (error) {
      throw error;
    }
  };
}

function createFolderAxios(hompyId, postName, folder) {
  return async (dispatch, getState) => {
    const response = await api.post(
      `${SERVER_HOST}/${hompyId}/${postName}/write`,
      folder
    );

    const { data } = response;

    dispatch({ type: "CREATE_FOLDER", payload: { data } });
  };
}

function updateFolderAxios(hompyId, postName, folder) {
  return async (dispatch, getState) => {
    const response = await api.put(
      `${SERVER_HOST}/${hompyId}/${postName}/update`,
      folder
    );

    const { data } = response;

    dispatch({ type: "UPDATE_FOLDER", payload: { data } });
  };
}

function clickFolder(folderId) {
  return (dispatch, getState) => {
    dispatch({ type: "CLICK_FOLDER", payload: { folderId } });
  };
}

function deleteFolderAxios(hompyId, postName, folderId) {
  return async (dispatch, getState) => {
    const response = await api.delete(
      `${SERVER_HOST}/${hompyId}/${postName}/delete/${folderId}`
    );

    const { status } = response;

    if (status === 200) {
      dispatch({ type: "DELETE_FOLDER", payload: { folderId } });
    }
  };
}

function getScrapFolderListAxios(hompyId, postName) {
  return async (dispatch, getState) => {
    try {
      const response = await api.get(
        `${SERVER_HOST}/${hompyId}/${postName}/scrapfolder`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      const { data, status } = response;

      if (status === 200) {
        dispatch({ type: "GET_SCRAP_FOLDER_LIST", payload: { data } });
      }
    } catch (error) {
      if (error) {
        throw error;
      }
    }
  };
}

function beforeCreateFolderState(name,value){
  return (dispatch,getState) => {
    dispatch({type:"BEFORE_CREATE_FOLDER_STATE",payload:{name,value}})
  }
}

function afterCreateFolderState(){
  return (dispatch,getState) => {
    dispatch({type:"AFTER_CREATE_FOLDER_STATE"})
  }
}

function showState(data){
  return (dispatch,getState) =>{
    dispatch({type:"FOLDER_SHOW_STATE",payload:{data}})
  }
}

function modalNameState(data){
  return(dispatch,getState) =>{
    dispatch({type:"MODAL_NAME_STATE",payload:{data}})
  }
}

function errorState(name,value){
  return (dispatch,getState) =>{
    dispatch({type:"ERROR_STATE",payload:{name,value}})
  }
}

export const FolderAction = {
  getFolderListAxios,
  updateFolderAxios,
  createFolderAxios,
  clickFolder,
  deleteFolderAxios,
  getScrapFolderListAxios,
  beforeCreateFolderState,
  afterCreateFolderState,
  showState,
  modalNameState,
  errorState,
};
