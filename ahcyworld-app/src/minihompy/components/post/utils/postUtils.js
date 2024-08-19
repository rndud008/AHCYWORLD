import api, { SERVER_HOST } from "../../../../apis/api";
import { CommentAction } from "../../../../redux/actions/CommentAction";
import { PostAction } from "../../../../redux/actions/PostAction";
import { list } from "./FolderUtils";
import { FolderAction } from "../../../../redux/actions/FolderAction";
import * as Swal from "../../../../apis/alert"


export const nameCheck = (postName) => {
  if (postName === "board") return "게시물";
  if (postName === "video") return "비디오";
  if (postName === "photo") return "사진";
};

export const boardNameCheck = (name) => {
  if (name === "게시판") {
    return "board";
  }
  if (name === "사진첩") {
    return "photo";
  }
  if (name === "동영상") {
    return "video";
  }
};

export const axiosPostList = async (
  dispatch,
  folderId,
  hompyId,
  postName,
  page
) => {
  try {
    await dispatch(PostAction.axiosPostList(hompyId, postName, folderId, page));
  } catch (error) {
    return list();
  }
};

export const download = async (item) => {
  const response = await api.get(
    `${SERVER_HOST}/post/download?id=${item.id}`,
    { responseType: "blob" }
  );

  const { data, status } = response;

  if (status === 200) {
    const fileName = item.sourceName;

    const url = window.URL.createObjectURL(new Blob([data]));
    const a = document.createElement("a");

    a.href = url;
    a.download = item.sourceName;
    a.setAttribute("download", fileName);
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } else {
    Swal.alert("다운로드 실패","파일이 존재하지 않습니다.","error")
  }
};

export const detailPage = async (dispatch,hompyId, postName, folderId, postId, navigate) => {
  dispatch(
    PostAction.detailPostAxios(hompyId, postName, folderId, postId, navigate)
  );
};

export const postList = (navigate,hompyId,postName,folderId) => {
  navigate(`/hompy/${hompyId}/${postName}/${folderId}`);
};

export const postDelete = async (dispatch,hompyId,postName,folderId,postId,navigate) => {
  if (!window.confirm('삭제하시겠습니까?')) return;

  dispatch(
    PostAction.deletePostAxios(hompyId, postName, folderId, postId, navigate)
  );
};

export const moveFolder = async (e,dispatch,hompyId,postName,folderId,postId,moveFolderId,navigate) => {
  e.preventDefault();

  dispatch(
    PostAction.movePostFolderAxios(
      hompyId,
      postName,
      folderId,
      postId,
      moveFolderId,
      navigate
    )
  );

  dispatch(PostAction.showState(false))
  dispatch(PostAction.moveFolderIdState(""))
};

export const detailMoveFolder = async (e,dispatch,hompyId,postName,folderId,postId,moveFolderId,navigate) => {
  e.preventDefault();

  dispatch(
    PostAction.movePostFolderAxios(
      hompyId,
      postName,
      folderId,
      postId,
      moveFolderId,
      navigate
    )
  );

  dispatch(PostAction.moveFolderIdState(""))
};

export const changeValue = (e, dispatch) => {
  const id = e.target.id.split("-")[3];
  dispatch(PostAction.moveFolderIdState(id))
};

export const handleOpen = (dispatch) => {
  dispatch(PostAction.showState(true))
  
};

export const handleClose = (dispatch) => {
  dispatch(PostAction.showState(false))

};

export const detailListHandleOpen = async (e,setShow,show,dispatch,hompyId,postName) => {
  const { name } = e.target;
 
  if (name === "folderMove") {
    setShow({ ...show, folderMove: true });
  }

  if (name === "scrapPost") {
    try {
      await dispatch(FolderAction.getScrapFolderListAxios(hompyId, postName));
    } catch (error) {
     
      return Swal.alert('스크랩을 진행할수 없습니다.',error.response.data,'error');
    }

    setShow({ ...show, scrapFolder: true });
  }
};

export const detailListHandleClose = (e,setShow,show) => {
  if (e === undefined) {
    setShow({
      folderMove: false,
      scrapFolder: false,
    });
    return;
  }

  if (e.target.name === "folderMove") {
    setShow({ ...show, folderMove: false });
  } else if (e.target.name === "scrapFolder") {
    setShow({ ...show, scrapFolder: false });
  }
};

export const postScrap = async (e,hompyId,postName,folderId,scrapFolderId,item,dispatch,navigate,hompyInfo,setShow) => {
  e.preventDefault();

  const response = await api.post(
    `http://localhost:8070/${hompyId}/${postName}/${folderId}/detail/${scrapFolderId}`,
    item
  );

  const { data, status, statusText } = response;


  if (status === 200) {
    Swal.alert("스크랩 완료", "스크랩 게시물로 이동합니다.",'success')
    detailListHandleClose(undefined,setShow)
    await dispatch(FolderAction.clickFolder(scrapFolderId));
    navigate(`/hompy/${hompyInfo.id}/${postName}/${scrapFolderId}`);
  } else {
    alert(statusText);
  }
};

export const writeAndUpdateChangeValue = (e, fileId = "", post, setPost,dispatch,postName) => {
  const { value, name } = e.target;

  if (fileId !== "") {
    const selectedFile = e.target.files[0];
   const check = ( postName.includes('photo') && selectedFile.type.startsWith('image') )|| 
   (postName.includes('video') && selectedFile.type.startsWith('video')) || postName.includes('board')

    if(check){
      const updateFileList = post.fileList.map((item) => {
        if (item.id === fileId) {
          return { ...item, sourceName: selectedFile };
        }
        return item;
      });
      setPost({ ...post, fileList: updateFileList });
 
    }else{
      if(postName.includes('photo')){
        alert('이미지 파일만 업로드 가능합니다.')
        return e.target.value ='';
      }
      if(postName.includes('video')){
        alert('비디오 파일만 업로드 가능합니다.')
        return e.target.value ='';
      }

    }

  } else {
    setPost({ ...post, [name]: value });
    postValidation(post,dispatch,name,value)
  }
};

export const fileAdd = (post,setPost,action,originFileList="") => {
  
  if(action.includes('CREATE')){
    
    if (post.fileList.length < 10 ) {
      setPost({
        ...post,
        fileList: [
          ...post.fileList,
          { id: post.fileList.length + 1, sourceName: null },
        ],
      });
    } else {
      Swal.alert('파일추가는 10까지 가능합니다.','다시한번 확인해주세요','warning')
    }
  
  }else if(action.includes('UPDATE')){
    
    if (post.fileList.length + originFileList.length < 10) {
      setPost({
        ...post,
        fileList: [
          ...post.fileList,
          { id: post.fileList.length + 1, sourceName: null },
        ],
      });
    } else {
      Swal.alert('파일등록은 10개 까지 가능합니다.','다시한번 확인해주세요','warning')
    }
  }
  
};

export const fileDelete = (id, post, setPost, e, action, originFileList, setOriginFileList) => {
  const {name} = e.target;

  if (name === "fileList" && (action.includes("CREATE")|| action.includes("UPDATE"))) {
    const updateFileList = post.fileList.filter((item) => item.id !== id);
    setPost({ ...post, fileList: updateFileList });
  }

  if (name === "originFileList" && action.includes("UPDATE")) {
    const updateOriginFileList = originFileList.map((item) =>
      item.id !== id ? item : { ...item, status: false }
    );
    setOriginFileList(updateOriginFileList);
  }
};


export const writeSubmit = async (e,post,dispatch,hompyId,postName,folderId,navigate) => {
  e.preventDefault();

  const valid = postValidation(post,dispatch,"","");

  if(!valid) return Swal.alert('작성실패','다시한번 확인해주세요','warning')

  const formData = new FormData();

  const json = JSON.stringify({
    subject: post.subject,
    content: post.content,
  });

  formData.append("post", new Blob([json], { type: "application/json" }));

  post.fileList.forEach((item, idx) => {
    if (item.sourceName) {
      formData.append(`files[file${idx}]`, item.sourceName);
    }
  });

  dispatch(
    PostAction.createPostAxios(
      hompyId,
      postName,
      folderId,
      formData,
      navigate
    )
  );
};

function postValidation(post,dispatch,name,value){

  let valid =true;

  if(name !== ""){
    name.includes('subject') && (value.trim() === "" || !value) && dispatch(PostAction.postErrorState("subject","제목은 필수 입력 입니다."))||
    name.includes('subject') && (value.trim() !== "" ) && dispatch(PostAction.postErrorState("subject",false))||
    name.includes('content') && (value.trim() === "" || !value) && dispatch(PostAction.postErrorState("content","내용은 필수 입력 입니다.")) ||
    name.includes('content') && (value.trim() !== "" ) && dispatch(PostAction.postErrorState("content",false))
  }else{

    if(post.subject.trim()==="" || !post?.subject){
      dispatch(PostAction.postErrorState("subject","제목은 필수 입력 입니다."))
      valid = false;
    }else{
      dispatch(PostAction.postErrorState("subject",false))
    }
  
    if(post.content.trim()==="" || !post?.content){
      dispatch(PostAction.postErrorState("content","내용은 필수 입력 입니다."))
      valid = false;
    }else{
      dispatch(PostAction.postErrorState("content",false))
    }

  }


  return valid;

}

export const fileReCreate = (id,originFileList,setOriginFileList) => {
  const updateOriginFileList = originFileList.map((item) =>
    item.id !== id ? item : { ...item, status: true }
  );
  setOriginFileList(updateOriginFileList);
};

export const updateSubmit = async (e, post, originFileList, hompyId, postName, folderId, navigate, postId, dispatch) => {
  e.preventDefault();

  const valid = postValidation(post, dispatch,"","");

  if(!valid) return Swal.alert('수정실패','다시한번 확인해주세요','warning')

  const formData = new FormData();

  const json = JSON.stringify({
    id: post.id,
    subject: post.subject,
    content: post.content,
  });



  formData.append("post", new Blob([json], { type: "application/json" }));

  post.fileList.forEach((item, idx) => {
    if (item.sourceName) {
      formData.append(`files[file${idx}]`, item.sourceName);
    }
  });

  const delFileIds = originFileList
    .filter((item) => item.status === false)
    .map((item) => item.id);

  formData.append(`delFile`, JSON.stringify(delFileIds));

  dispatch(PostAction.postUpdate(hompyId,postName,folderId,formData,navigate,postId,dispatch))
  dispatch(PostAction.axiosPostList)
};

export const findPost = async (dispatch,hompyId,postName,folderId,postId) => {
  dispatch(PostAction.findPostAxios(hompyId, postName, folderId, postId));
};

export const back = (navigate,dispatch) =>{
  dispatch(PostAction.postErrorState("subject",false))
  dispatch(PostAction.postErrorState("content",false))
  navigate(-1)
}