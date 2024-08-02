import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const mySwal = withReactContent(Swal);

export const alert = (title, text, icon, callback) => {
    mySwal.fire({
        title: title,
        text: text,
        icon: icon,
    }).then(callback);
};

export const confirm = (title, text, icon, callback) => {
    mySwal.fire({
        title: title,
        text: text,
        icon: icon,
        showCancelButton: true,
        cancelButtonColor: "#d33",
        cancelButtonText: "No",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Yes",
    }).then(callback);
};