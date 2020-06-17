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
    const graphQLError = err?.graphQLErrors[0];
    const networkError = err?.networkError;
    console.log(Object.keys(err));
    console.log(networkError);
    console.log(err.message);
    const bool1: Boolean = graphQLError.constructor.name === "Object";
    console.log(bool1);
    console.log(graphQLError.constructor.name);
    // console.log(networkError.constructor.name);
    if (graphQLError.constructor.name === "Object") {
      console.log("wtf is this");
      // setToast((curr: any) => [
      //   ...curr,
      //   <Toast
      //     key={curr.length + 1}
      //     {...opt}
      //     message={error.message}
      //     color="danger"
      //   />,
      // ]);
      setToast((curr: any) => {
        console.log("working");
        return [
          ...curr,
          <Toast
            key={curr.length + 1}
            {...opt}
            message={graphQLError.message}
            color="danger"
          />,
        ]
      });
    }
  };

  return (
    <ToastContext.Provider value={{ push, pushErr, toast }}>
      {children}
    </ToastContext.Provider>
  );
};

export default ToastProvider;
