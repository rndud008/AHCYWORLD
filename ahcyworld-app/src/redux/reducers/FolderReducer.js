let initialState = {
  folderList: [],
  folder: {},
  scrapFolderList: [],
  moveFolderId: "",
  show: false,
  modalName: "",
  errors: {},
};

function FolderReducer(state = initialState, action) {
  let { type, payload } = action;

  switch (type) {
    case "GET_SCRAP_FOLDER_LIST":
      return { ...state, scrapFolderList: payload.data };
    case "GET_FOLDER_LIST":
      return { ...state, folderList: payload.data, folder: payload.data[0] };
    case "UPDATE_FOLDER":
      return {
        ...state,
        folderList: state.folderList.map((item) =>
          item.id === payload.data.id ? payload.data : item
        ),
      };
    case "CREATE_FOLDER":
      return { ...state, folderList: [...state.folderList, payload.data] };
    case "DELETE_FOLDER":
      return {
        ...state,
        folderList: state.folderList.filter(
          (item) => parseInt(item.id) !== parseInt(payload.folderId)
        ),
      };
    case "CLICK_FOLDER":
      return (
        {
          ...state,
          folder: state.folderList.find(
            (item) => parseInt(item.id) === parseInt(payload.folderId)
          ),
        } || null
      );
    case "BEFORE_CREATE_FOLDER_STATE":
      return {
        ...state,
        folder: { ...state.folder, [payload.name]: payload.value },
      };
    case "AFTER_CREATE_FOLDER_STATE":
      return {
        ...state,
        folder: {},
      };
    case "FOLDER_SHOW_STATE":
      return { ...state, show: payload.data };
    case "MODAL_NAME_STATE":
      return { ...state, modalName: payload.data };
    case "ERROR_STATE":
      return {
        ...state,
        errors: { ...state.errors, [payload.name]: payload.value },
      };
    default:
      return { ...state };
  }
}

export default FolderReducer;
