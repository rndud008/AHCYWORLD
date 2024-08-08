import { combineReducers } from "redux";
import PostReducer from "./PostReducer";
import FolderReducer from "./FolderReducer";
import EmailAuthReducer from "./EmailAuthReducer";

export default combineReducers({
  post: PostReducer,
  folder: FolderReducer,
  email: EmailAuthReducer,
})