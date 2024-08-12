import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const mySwal = withReactContent(Swal);

export const alert = (title, text, icon, callback) => {
  mySwal
    .fire({
      title: title,
      text: text,
      icon: icon,
    })
    .then(callback);
};

export const confirm = async (title, text, icon, callback) => {
  await mySwal
    .fire({
      title: title,
      text: text,
      icon: icon,
      showCancelButton: true,
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Yes",
    })
    .then(callback);
};

/* 아이템 장바구니추가 알림창 */
export const itemconfirm = (title, text, icon, callback, cancelCallback) => {
  mySwal
    .fire({
      title: title,
      text: text,
      icon: icon,
      showCancelButton: true,
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Yes",
    })
    .then((result) => {
      if (result.isConfirmed) {
        callback();
      } else if (result.isDismissed) {
        cancelCallback();
      }
    });
};
