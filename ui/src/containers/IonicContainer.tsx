import React from "react";
import { IonApp } from "@ionic/react";

const IonicContainer = ({ children }: { children: React.ReactNode }) => (
  <IonApp id="content">{children}</IonApp>
);

export default IonicContainer;
