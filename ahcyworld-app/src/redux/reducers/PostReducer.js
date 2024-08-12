let initialState = {
  pageAndPostList: [],
  post: {},
  page: 0,
  show: false,
  moveFolderId: "",
  errors: {},
};

function PostReducer(state = initialState, action) {
  let { type, payload } = action;

  switch (type) {
    case "GET_POST_LIST":
      return { ...state, pageAndPostList: payload.data };
    case "FIND_POST":
      return { ...state, post: payload.data };
    case "MOVE_POST_FOLDER":
      return {
        ...state,
        pageAndPostList: state.pageAndPostList.posts.map((item) =>
          item.id === payload.data.id ? payload.data : item
        ),
      };
    case "DELETE_POST":
      return {
        ...state,
        pageAndPostList: state.pageAndPostList.posts.filter(
          (item) => parseInt(item.id) !== payload.postId
        ),
      };
    case "DETAIL_POST":
      return{...state, post:payload.data};
    case "SET_PAGE":
      return{...state, page:payload.page};
    case "POST_SHOW_STATE":
      return{...state, show:payload.data};
    case "MOVE_FOLDER_ID_STATE":
      return{...state, moveFolderId:payload.data};
    case "POST_ERROR_STATE":
      return{...state, errors:{...state.errors, [payload.name]:payload.value}}
    default:
      return { ...state };
  }
}

export default PostReducer;
