import { EaselFill } from "react-bootstrap-icons";
import api, { SERVER_HOST } from "../../apis/api";

function searchListAxios(search, action,navigate) {
  return async (dispatch, getState) => {
    try {
      const response = await api.get(`${SERVER_HOST}/search`, {
        params: { search, action },
      });
      const { data, status } = response;

      if (status === 200) {
        if (action.includes("people")) {
          const hompyList = data.hompyList;
          dispatch({
            type: "GET_SEARCH_HOMPY_LIST_SUCCESS",
            payload: { hompyList },
          });
        }

        if (action.includes("item")) {
          const itemList = data.itemList;
          dispatch({
            type: "GET_SEARCH_ITEM_LIST_SUCCESS",
            payload: { itemList },
          });
        }

        if (action.includes("all")) {
          dispatch({ type: "GET_SEARCH_ALL_LIST_SUCCESS", payload: { data } });
        }

        navigate(`/search?action=${action}&search=${search}`)
      }else {
        alert(data)
      }
    } catch (e) {
      throw e;
    }
  };
}

export const SearchAction = {
  searchListAxios,
};
