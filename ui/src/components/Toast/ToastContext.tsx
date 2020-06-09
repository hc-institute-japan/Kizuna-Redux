import { createContext } from "react";

const ToastContext = createContext({
  push: (opt: any): void => {},
  pushErr: (err: any, opt: any): void => {},
  toast: [],
});

export default ToastContext;
