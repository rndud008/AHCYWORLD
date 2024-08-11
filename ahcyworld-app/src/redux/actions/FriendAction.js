import api, { SERVER_HOST } from "../../apis/api";

function findByHompyFriendListAixos(username) {
  return async (dispatch, getState) => {
    const response = await api.get(`${SERVER_HOST}/friend/myfriends`, {
      params: { username },
    });
    const { data, status } = response;

    if(status === 200){

      dispatch({type:"HOMPY_FRIEND_LIST",payload:{data}});
    }

  };
}

export const FriendAction = {findByHompyFriendListAixos};
