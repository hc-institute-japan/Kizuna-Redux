import React from "react";
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonButton,
  IonIcon,
} from "@ionic/react";
import { search } from "ionicons/icons";

interface Props {
  showSearch(): void;
}

const Default: React.FC<Props> = ({ showSearch }) => (
  <IonHeader>
    <IonToolbar>
      <IonButtons slot="start">
        <IonMenuButton />
      </IonButtons>
      <IonButtons slot="end">
        <IonButton onClick={showSearch}>
          <IonIcon icon={search} />
        </IonButton>
      </IonButtons>
    </IonToolbar>
  </IonHeader>
);

export default Default;
