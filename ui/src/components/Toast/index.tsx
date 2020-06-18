import { IonToast } from "@ionic/react";
import React, { forwardRef, useImperativeHandle, useState } from "react";

declare enum Position {
  "top",
  "bottom",
  "middle",
}

interface Button {
  side?: string;
  icon?: string;
  text: string;
  handler?(): void;
  role: string;
}

interface Props {
  message: string;
  duration?: number;
  buttons?: any[];
  color?: string;
  header?: string;
  position?: "top" | "bottom" | "middle" | undefined;
  mode?: string;
  onDidDismiss?(): void;
  onDidPresent?(): void;
  onWillDismiss?(): void;
  onWillPresent?(): void;
}

const Toast = (props: any, ref: any) => {
  const [isOpen, setIsOpen] = useState(true);
  const { duration = 1000 } = { ...props };

  useImperativeHandle(ref, () => ({
    show: () => setIsOpen(true),
    hide: () => setIsOpen(false),
    toggle: () => setIsOpen((curr) => !curr),
  }));

  return <IonToast duration={duration} isOpen={isOpen} {...props}></IonToast>;
};

// Toast.propTypes = {
//   message: PropTypes.string.isRequired,
//   duration: PropTypes.number,
//   buttons: PropTypes.arrayOf(
//     PropTypes.shape({
//       side: PropTypes.string,
//       icon: PropTypes.string,
//       text: PropTypes.string.isRequired,
//       handle: PropTypes.func,
//       role: PropTypes.string,
//     })
//   ),
//   color: PropTypes.string,
//   header: PropTypes.string,
//   position: PropTypes.string,
//   mode: PropTypes.string,
//   onDidPresent: PropTypes.func,
//   onDidDismiss: PropTypes.func,
//   onWillDismiss: PropTypes.func,
//   onWillPresent: PropTypes.func,
// };

// Toast.defaultProps = {
//   duration: 500,
//   buttons: [],
//   color: "light",
//   header: "",
//   position: "",
//   mode: "",
//   onDidDismiss: () => {},
//   onDidPresent: () => {},
//   onWillDismiss: () => {},
//   onWillPresent: () => {},
// };

export default forwardRef(Toast);
