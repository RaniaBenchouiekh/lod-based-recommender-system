import {toast} from "react-toastify";
import React from "react";

export function errorToast(string) {
    return toast.error(<p>{"❌ " + string} </p>, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true
    });
}

export function succesToast(string) {
    return toast.success(<p>{"✔️ " + string} </p>, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true
    });
}