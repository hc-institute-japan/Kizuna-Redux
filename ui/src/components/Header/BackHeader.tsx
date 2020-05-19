import React from "react";
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
} from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import { useHistory } from "react-router-dom";

const BackHeader = () => {
  const history = useHistory();
  return (
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonButton onClick={() => history.goBack()}>
            <IonIcon icon={arrowBack}></IonIcon>
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
};

export default BackHeader;
