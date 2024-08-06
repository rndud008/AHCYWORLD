
import { type } from "@testing-library/user-event/dist/type";
import api from "../../login/apis/api";
import Cookies from "js-cookie";


 function getFolderListAxios(hompyId,postName){
 return async (dispatch,getState)=>{
  const response = await api.get(
    `http://localhost:8070/${hompyId}/${postName}/list`,
    {
      headers: {
        Authorization: `Bearer ${Cookies.get("accessToken")}`,
      },
    }
  );

  const { data } = response;
  dispatch({type:"GET_FOLDER_LIST",payload:{data}})

  }

}

function createFolderAxios(hompyId,postName,folder){
  return async(dispatch,getState) =>{
    const response = await api.post(
      `http://localhost:8070/${hompyId}/${postName}/write`,
      folder
    );
  
    const {data} = response;

    dispatch({type:"CREATE_FOLDER",payload:{data}})
  }
  
}

function updateFolderAxios(hompyId,postName,folder){

  return async (dispatch, getState) =>{
    const response = await api.put(
      `http://localhost:8070/${hompyId}/${postName}/update`,
      folder
    );

    const {data} = response;

    dispatch({type:"UPDATE_FOLDER",payload:{data}})
  
  }
    
}

function clickFolder(folderId){

  return (dispatch,getState) =>{

    dispatch({type:"CLICK_FOLDER",payload:{folderId}})

  }

}

function deleteFolderAxios(hompyId,postName,folderId){
  return async (dispatch,getState) =>{
    const response = await api.delete(`http://localhost:8070/${hompyId}/${postName}/delete/${folderId}`);

    const {status} = response;

    if(status === 200){
      dispatch({type:"DELETE_FOLDER",payload:{folderId}})
    }

  }
}

function getScrapFolderListAxios(hompyId,postName){
  return async(dispatch,getState) =>{

    try{

      const response = await api.get(`http://localhost:8070/${hompyId}/${postName}/scrapfolder`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        })
        const {data,status} = response;
  
        if(status === 200){
  
          dispatch({type:"GET_SCRAP_FOLDER_LIST",payload:{data}})
        }
    }catch(error){
      if(error){
        throw error;
      }
    }

  }
}

export const FolderAction ={getFolderListAxios, updateFolderAxios, createFolderAxios, clickFolder, deleteFolderAxios, getScrapFolderListAxios}