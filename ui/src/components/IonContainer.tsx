import React, { FC } from "react";
import { IonApp } from "@ionic/react";

interface Props {}

const IonContainer: FC<Props> = ({ children }) => {
  return <IonApp>{children}</IonApp>;
};

export default IonContainer;
