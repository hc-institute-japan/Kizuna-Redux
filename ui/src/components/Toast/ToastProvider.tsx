import React, { useState } from "react";
import Toast from ".";
import ToastContext from "./ToastContext";

const ToastProvider: React.FC = ({ children }) => {
  const [toast, setToast] = useState<any>([]);
  const push = (opt: any) => {
    setToast((curr: any) => [
      ...curr,
      <Toast key={curr.length + 1} {...opt} />,
    ]);
  };

  const pushErr = (err: any, opt: any) => {
    const error = err?.graphQLErrors[0];
    if ((error.constructor.name = "Object" && "code" in error))
      setToast((curr: any) => [
        ...curr,
        <Toast
          key={curr.length + 1}
          {...opt}
          message={error.message}
          color="danger"
        />,
      ]);
  };

  return (
    <ToastContext.Provider value={{ push, pushErr, toast }}>
      {children}
    </ToastContext.Provider>
  );
};

export default ToastProvider;
