import { combineReducers } from "redux";
import PostReducer from "./PostReducer";
import FolderReducer from "./FolderReducer";
import EmailAuthReducer from "./EmailAuthReducer";
import CommentReducer from "./CommentReducer";
import HompyReducer from "./HompyReducer";
import FriendReducer from "./FriendReducer";
import SearchReducer from "./SearchReducer";

export default combineReducers({
  post: PostReducer,
  folder: FolderReducer,
  email: EmailAuthReducer,
  comment: CommentReducer,
  hompy: HompyReducer,
  friend: FriendReducer,
  search: SearchReducer
})