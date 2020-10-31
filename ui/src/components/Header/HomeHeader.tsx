import React from "react";
import { IonHeader, IonToolbar, IonButtons, IonMenuButton } from "@ionic/react";

const HomeHeader: React.FC = () => (
  <IonHeader>
    <IonToolbar>
      <IonButtons slot="start">
        <IonMenuButton />
      </IonButtons>
    </IonToolbar>
  </IonHeader>
);

export default HomeHeader;
