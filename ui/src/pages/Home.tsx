import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonInput,
  IonButton,
  IonLabel,
} from "@ionic/react";
import React, { useState } from "react";
import ExploreContainer from "../components/ExploreContainer";
import "./Home.css";

import { useQuery, useMutation } from "@apollo/react-hooks";

interface Profile {
  first_name: String;
}

const Home: React.FC = () => {
  const [FN, setFN] = useState("");
  const [LN, setLN] = useState("");
  const [EA, setEA] = useState("");

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Kizuna Connect</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Kizuna Connect</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonList>
          <IonItem>
            <IonInput
              value={FN}
              placeholder="Enter First Name"
              onIonChange={(e) => setFN(e.detail.value!)}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonInput
              value={LN}
              placeholder="Enter Last Name"
              onIonChange={(e) => setLN(e.detail.value!)}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonInput
              value={EA}
              placeholder="Enter Email"
              onIonChange={(e) => setEA(e.detail.value!)}
            ></IonInput>
          </IonItem>
        </IonList>

        <IonButton size={"large"} onClick={() => {}}>
          Submit
        </IonButton>

        <IonHeader>
          <IonToolbar>
            <IonTitle>Users</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonList> </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Home;
