import React, { useState } from "react";
import Toast from ".";
import ToastContext from "./ToastContext";
import errorMessages from "../../utils/errors";

const ToastProvider: React.FC = ({ children }) => {
  const [toast, setToast] = useState<any>([]);
  const push = (opt: any) => {
    setToast((curr: any) => [
      ...curr,
      <Toast key={curr.length + 1} {...opt} />,
    ]);
  };

  const pushErr = (err: any, opt: any = {}, postfix: any = "") => {
    const { graphQLErrors, networkError }: any = { ...err };
    const messages: any = [];
    console.log(graphQLErrors);
    if (graphQLErrors) {
      graphQLErrors.map(({ message }: any) => {
        const individual = JSON.parse(message);
        const msg = errorMessages[individual.code + postfix] || "Test";
        messages.push(msg);
      });
    } else if (networkError) {
      messages.push(errorMessages["500"]);
    }

    console.log(messages);

    setToast((curr: any) => [
      ...curr,
      ...messages.map((message: any) => (
        <Toast
          key={curr.length + 1}
          {...opt}
          message={message}
          color="danger"
        />
      )),
    ]);
  };

  return (
    <ToastContext.Provider value={{ push, pushErr, toast }}>
      {children}
    </ToastContext.Provider>
  );
};

export default ToastProvider;
