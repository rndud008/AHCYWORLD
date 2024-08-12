import { FolderAction } from "../../../../redux/actions/FolderAction";
import { PostAction } from "../../../../redux/actions/PostAction";
import * as Swal from "../../../../apis/alert";

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
  dispatch(FolderAction.errorState("status", false));
  dispatch(FolderAction.errorState("name", false));
  
};

export const handleShow = (e, dispatch, folderId) => {
  const { value, id } = e.target;

  dispatch(FolderAction.afterCreateFolderState());
  if (id !== "") {
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
    return Swal.alert("폴더작성 실패", "올바르게 입력해주세요.", "error");
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
    return Swal.alert("폴더수정 실패", "올바르게 입력해주세요.", "error");
  }

  await dispatch(
    FolderAction.updateFolderAxios(hompyId, postName, updateFolder)
  );
  handleClose(dispatch);
};

export const changeValue = (e, dispatch) => {
  const { value, name } = e.target;

  const valid = folderValidation("", dispatch, e);

  if (!valid) return;

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

function folderValidation(folder, dispatch, e = "") {
  let valid = true;
  if (folder !== "") {
    if (
      !folder?.name ||
      folder?.name.trim() === "" ||
      folder.name.length > 10
    ) {
      dispatch(
        FolderAction.errorState(
          "name",
          "폴더이름은 10글자 이하로 입력해주세요."
        )
      );
      valid = false;
    } else {
      dispatch(FolderAction.errorState("name", false));
    }

    if (!folder?.status || folder?.status.trim() === "") {
      dispatch(FolderAction.errorState("status", "공개범위를 설정해주세요."));
      valid = false;
    } else {
      dispatch(FolderAction.errorState("status", false));
    }
  } else if (e !== "") {
    const { name, value } = e.target;
    if (name.includes("name") && value.length > 10) {
      dispatch(
        FolderAction.errorState(
          "name",
          "폴더이름은 10글자 이하로 입력해주세요."
        )
      );
      valid = false;
    } else {
      dispatch(FolderAction.errorState("name", false));
    }

    if (name.includes("status") && !value && value.trim() === "") {
      dispatch(FolderAction.errorState("status", "공개범위를 설정해주세요."));
      valid = false;
    } else {
      dispatch(FolderAction.errorState("status", false));
    }
  }

  return valid;
}
