import React from "react";
import ToastContext from "./ToastContext";
import { ToastOptions } from "@ionic/react";
import { ApolloError } from "apollo-boost";
import Toast from ".";

const withToast = (WrappedComponent: any) => {
  const ToastWrapper = (props: any) => (
    <ToastContext.Consumer>
      {({ push, pushErr }) => (
        <WrappedComponent pushToast={push} pushErr={pushErr} {...props} />
      )}
    </ToastContext.Consumer>
  );
  return ToastWrapper;
};

export interface ToastProps {
  push(opt: ToastOptions): void;
  pushErr(
    err: ApolloError,
    opt?: ToastOptions,
    zome?: string,
    zomeFunction?: string
  ): void;
  toast: Array<typeof Toast> | [];
}

export default withToast;
