import React from "react";
import { IonApp } from "@ionic/react";

const IonicContainer = ({ children }: { children: React.ReactNode }) => (
  <IonApp>{children}</IonApp>
);

export default IonicContainer;
