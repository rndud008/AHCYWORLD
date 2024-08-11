import { FolderAction } from "../../../../redux/actions/FolderAction";
import { PostAction } from "../../../../redux/actions/PostAction";

export const radioName = [
  {
    id: "public",
    name: "전체공개",
  },
  {
    id: "friend",
    name: "일촌공개",
  },
  {
    id: "private",
    name: "비공개",
  },
];

export const list = async (postName, dispatch, hompyId) => {
  if (postName) {
    dispatch(FolderAction.getFolderListAxios(hompyId, postName));
  }
};

export const handleClose = (dispatch) => {
  dispatch(FolderAction.showState(false));
};

export const handleShow = (e, dispatch) => {
  const { value, id } = e.target;
  dispatch(FolderAction.afterCreateFolderState());
  if (id !== null) {
    dispatch(FolderAction.clickFolder(id));
  }

  dispatch(FolderAction.showState(true));
  dispatch(FolderAction.modalNameState(value));
};

export const createSubmit = async (
  e,
  dispatch,
  hompyId,
  postName,
  createFolder
) => {
  e.preventDefault();

  const valid = folderValidation(createFolder, dispatch);

  if (!valid) {
    return alert("폴더작성 실패");
  }

  await dispatch(
    FolderAction.createFolderAxios(hompyId, postName, createFolder)
  );
   handleClose(dispatch);
};

export const updateSubmit = async (
  e,
  dispatch,
  hompyId,
  postName,
  updateFolder
) => {
  e.preventDefault();

  const valid = folderValidation(updateFolder, dispatch);

  if (!valid) {
    return alert("폴더수정 실패");
  }

  await dispatch(
    FolderAction.updateFolderAxios(hompyId, postName, updateFolder)
  );
  handleClose(dispatch);
};

export const changeValue = (e, dispatch) => {
  const { value, name } = e.target;
  dispatch(FolderAction.beforeCreateFolderState(name, value));
};

export const folderClick = async (e, dispatch, navigate, hompyId, postName) => {
  const folderId = e.target.id.split("-")[2];

  dispatch(FolderAction.clickFolder(folderId));

  dispatch(PostAction.setPage(1));

  navigate(`/hompy/${hompyId}/${postName}/${folderId}`);
};

export const folderDelete = async (dispatch, hompyId, postName, id) => {
  if (!window.confirm("삭제하시겠습니까?")) return;

  dispatch(FolderAction.deleteFolderAxios(hompyId, postName, id));
};

function folderValidation(createFolder, dispatch) {
  let valid = true;

  if (
    !createFolder?.name ||
    createFolder?.name.trim() === "" ||
    createFolder.name.length > 10
  ) {
    dispatch(
      FolderAction.errorState("name", "폴더이름은 10글자 이하로 입력해주세요.")
    );
    valid = false;
  } else {
    dispatch(FolderAction.errorState("name", false));
  }

  if (!createFolder?.status || createFolder?.status.trim() === "") {
    dispatch(FolderAction.errorState("status", "공개범위를 설정해주세요."));
    valid = false;
  } else {
    dispatch(FolderAction.errorState("status", false));
  }

  return valid;
}
