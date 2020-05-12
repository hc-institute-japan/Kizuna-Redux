import {
  IonButtons,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonToolbar,
} from "@ionic/react";
import React from "react";
import HomeHeader from "../../components/Header/HomeHeader";

const Home: React.FC = () => (
  <IonPage>
    <HomeHeader />
  </IonPage>
);

export default Home;
