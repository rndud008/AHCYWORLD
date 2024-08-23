import api, { SERVER_HOST } from "../../apis/api";

function emailAuthAxios(email) {
  return async (dispatch, getState) => {
    try {
      const response = await api.post(
        `${SERVER_HOST}/email/auth`,
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { data } = response;
      dispatch({ type: "AUTH_VALUE_CREATE", payload: { data } });
    } catch (error) {
      throw error;
    }
  };
}

function emailAuthReAxios(email) {
  return async (dispatch, getState) => {
    try {
      const response = await api.delete(
        `${SERVER_HOST}/email/auth/delete`,
        {
          data: { email },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { status } = response;
      if (status === 200) {
        dispatch({ type: "EMAIL_RE_VALUE_DELETE", payload: {} });
      }
    } catch (error) {
      throw error;
    }
  };
}

function emailAuthCheckAxios(email, authenticationCode) {
  return async (dispatch, getState) => {

    try{
      const response = await api.post(
        "${SERVER_HOST}/email/auth/check",
        { email, authenticationCode },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const { data, status } = response;
      if(status === 200){
        dispatch({type:"EMAIL_AUTH_SUCCESS",payload:{data}})
      }
    }catch(error){
      throw error
    }


  };
}

export const EmailAuthAction = { emailAuthAxios, emailAuthReAxios, emailAuthCheckAxios };
