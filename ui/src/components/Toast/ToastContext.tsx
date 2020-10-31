import { createContext } from "react";
import { ToastProps } from "./withToast";

const ToastContext = createContext<ToastProps>({
  push: (opt): void => {},
  pushErr: (err, opt, zomeName, funcName): void => {},
  toast: [],
});

export default ToastContext;
