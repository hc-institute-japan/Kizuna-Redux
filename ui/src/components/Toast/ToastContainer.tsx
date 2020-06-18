import React from "react";
import ToastContext from "./ToastContext";

const ToastContainer = () => {
  return <ToastContext.Consumer>{({ toast }) => toast}</ToastContext.Consumer>;
};

export default ToastContainer;
