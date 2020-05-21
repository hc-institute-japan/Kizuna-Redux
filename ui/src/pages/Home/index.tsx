import { IonPage, IonBackdrop, IonContent } from "@ionic/react";
import React, { useState } from "react";
import HomeHeader from "../../components/Header/HomeHeader";
import HomeTabBar from "../../components/Tab/HomeTabBar";
import HomeContent from "./HomeContent";

const Home: React.FC = () => {
  const [tab, setTab] = useState(1);
  return (
    <IonPage>
      <HomeContent tab={tab} />

      <HomeTabBar tab={tab} setTab={setTab} />
    </IonPage>
  );
};

export default Home;
