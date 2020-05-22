import { IonContent, IonTab, IonPage } from "@ionic/react";
import React from "react";
import Contacts from "../Contacts";
import HomeHeader from "../../components/Header/HomeHeader";

const HomeContent: React.FC = (_) => (
  <IonPage>
    <Contacts />
  </IonPage>
);

export default HomeContent;
