import React, { useCallback, useState } from "react";
import Toast from ".";
import errorMessages from "../../utils/errors";
import ToastContext from "./ToastContext";
import { ApolloError } from "apollo-boost";
import { ToastOptions } from "@ionic/react";

const ToastProvider: React.FC = ({ children }) => {
  const [toast, setToast] = useState<Array<typeof Toast> | []>([]);
  const push = (opt: ToastOptions) => {
    setToast((curr: any) => [
      ...curr,
      <Toast key={curr.length + 1} {...opt} />,
    ]);
  };

  const pushErr = useCallback(
    (
      err: ApolloError,
      opt: ToastOptions,
      zomeName: string,
      funcName: string | null = null
    ) => {
      const { graphQLErrors, networkError } = { ...err };
      const messages: string[] = [];

      if (graphQLErrors) {
        graphQLErrors.forEach(({ message }: { message: string }) => {
          const { code } = JSON.parse(message);
          if (code) {
            switch (code) {
              case 502: {
                messages.push(
                  "Your request has timed out. Please try again later."
                );
                break;
              }
              case 1000: {
                messages.push(
                  "Unexpected error has occured. Please try again later."
                );
                break;
              }
              // handle all the other errors here
              default: {
                let msg =
                  funcName !== null
                    ? errorMessages[zomeName][funcName][code]
                    : errorMessages[zomeName][code];
                // might not be good for debugging
                msg
                  ? messages.push(msg)
                  : messages.push(
                      "Unexpected error has occured. Please try again later."
                    );
                break;
              }
            }
          } else
            messages.push(
              "unexpected error has occured. Please try again later."
            );
        });
      } else if (networkError) {
        messages.push(errorMessages["500"]);
      }

      setToast((curr: any) => [
        ...curr,
        ...messages.map((message: string) => (
          <Toast
            key={curr.length + 1}
            {...opt}
            message={message}
            color="danger"
          />
        )),
      ]);
    },
    [setToast]
  );

  return (
    <ToastContext.Provider value={{ push, pushErr, toast }}>
      {children}
    </ToastContext.Provider>
  );
};

export default ToastProvider;
