import {HompyAction} from "../../../../redux/actions/HompyAction";
import * as Swal from "../../../../apis/alert"

export const findByHompyIdAxios = async (dispatch, hompyId) => {
  try {
    await dispatch(HompyAction.findByHompyIdAxios(hompyId));
  } catch (e) {
    Swal.alert("데이터 불러오기 실패","다시 한번 시도해주세요.","error")
  }
};