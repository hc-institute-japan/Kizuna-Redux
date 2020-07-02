import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { chatbox, personCircle } from "ionicons/icons";
import React from "react";

const HomeTabBar: React.FC = ({ children }) => (
  <IonTabs>
    <IonRouterOutlet>{children}</IonRouterOutlet>
    <IonTabBar slot="bottom">
      <IonTabButton href="/home/messages" tab="messages">
        <IonIcon icon={chatbox} />
        <IonLabel>Messages</IonLabel>
      </IonTabButton>
      <IonTabButton href="/home/contacts" tab="contacts">
        <IonIcon icon={personCircle} />
        <IonLabel>Contacts</IonLabel>
      </IonTabButton>
    </IonTabBar>
  </IonTabs>
);

export default HomeTabBar;
