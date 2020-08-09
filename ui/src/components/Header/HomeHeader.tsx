import React from "react";
import { IonHeader, IonToolbar, IonButtons, IonMenuButton } from "@ionic/react";

interface Props {
  isMultiselect: boolean;
}

const HomeHeader: React.FC<Props> = () => (
  <IonHeader>
    <IonToolbar>
      <IonButtons slot="start">
        <IonMenuButton />
      </IonButtons>
    </IonToolbar>
  </IonHeader>
);

export default HomeHeader;
