import { IonPage } from "@ionic/react";
import React from "react";
import { Redirect, Route } from "react-router-dom";
import HomeHeader from "../../components/Header/HomeHeader";
import HomeTabBar from "../../components/Tab/HomeTabBar";
import Contacts from "../Contacts";

const Home: React.FC = () => (
  <HomeTabBar>
    <Route path="/home/messages" exact>
      <IonPage>
        <HomeHeader />
      </IonPage>
    </Route>
    <Route path="/home/contacts" exact>
      <Contacts />
    </Route>
    <Redirect from="/home*" to="/home/contacts" />
  </HomeTabBar>
);

export default Home;
