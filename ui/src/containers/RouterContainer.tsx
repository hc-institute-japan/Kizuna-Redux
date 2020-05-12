import React from "react";
import { IonReactRouter } from "@ionic/react-router";

const RouterContainer = ({ children }: { children: React.ReactNode }) => (
  <IonReactRouter>{children}</IonReactRouter>
);

export default RouterContainer;
