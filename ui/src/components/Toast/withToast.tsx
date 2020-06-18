import React from "react";
import ToastContext from "./ToastContext";

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

export interface ToastProp {
  push(opt: any): void;
  pushErr(err: any, opt?: any): void;
}

export default withToast;
