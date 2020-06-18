import { createContext } from "react";

const ToastContext = createContext({
  push: (opt: any): void => {},
  pushErr: (err: any, opt: any, zomeName: string, funcName: string | null): void => {},
  toast: [],
});

export default ToastContext;
