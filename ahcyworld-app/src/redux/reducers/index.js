import { combineReducers } from "redux";
import PostReducer from "./PostReducer";
import FolderReducer from "./FolderReducer";

export default combineReducers({
  post: PostReducer,
  folder: FolderReducer,
})