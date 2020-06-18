import React, { useState } from "react";
import Toast from ".";
import ToastContext from "./ToastContext";
import errorMessages from "../../utils/errors";
import { stringify } from "querystring";

const ToastProvider: React.FC = ({ children }) => {
  const [toast, setToast] = useState<any>([]);
  const push = (opt: any) => {
    setToast((curr: any) => [
      ...curr,
      <Toast key={curr.length + 1} {...opt} />,
    ]);
  };

  const pushErr = (err: any, opt: any = {}, zomeName: string, funcName: string | null = null) => {
    const { graphQLErrors, networkError }: any = { ...err };
    const messages: any = [];

    if (graphQLErrors) {
      graphQLErrors.map(({ message }: any) => {
        const { code } = JSON.parse(message);
        if (code) {
          switch(code) {
            case 502: {
              messages.push("Your request has timed out. Please try again later.");
              break;
            }
            case 1000: {
              messages.push("unexpected error has occured. Please try again later.");
              break;
            }
            // handle all the other errors here
            default: {
              let msg;
              console.log(zomeName);
              console.log(funcName);
              console.log(code);
              funcName !== null ? msg = errorMessages[zomeName][funcName][code] : msg = errorMessages[zomeName][code];
              // might not be good for debugging
              msg ? messages.push(msg) : messages.push("unexpected error has occured. Please try again later.");
              break;
            }
          }
        } else messages.push("unexpected error has occured. Please try again later.")
      });
    } else if (networkError) {
      messages.push(errorMessages["500"]);
    }

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
