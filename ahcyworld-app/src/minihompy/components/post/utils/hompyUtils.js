import {HompyAction} from "../../../../redux/actions/HompyAction";

export const findByHompyIdAxios = async (dispatch, hompyId) => {
  try {
    await dispatch(HompyAction.findByHompyIdAxios(hompyId));
  } catch (e) {
    alert(e);
  }
};