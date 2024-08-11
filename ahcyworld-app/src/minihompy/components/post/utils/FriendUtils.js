import { FriendAction } from "../../../../redux/actions/FriendAction";

export const hompyFriendListAxios = async (username,dispatch) => {
  if (username) {
    dispatch(FriendAction.findByHompyFriendListAixos(username));
  }
};