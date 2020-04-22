import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonToolbar,
} from "@ionic/react";
import React from "react";

const Home: React.FC = () => {
  // console.log(data);

  return (
    <IonContent>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="secondary">
            <IonButton>
              <IonIcon slot="start" name="star" />
            </IonButton>
          </IonButtons>

          <IonButtons slot="primary">
            <IonButton>
              <IonIcon name="create" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
    </IonContent>
  );
};

export default Home;
