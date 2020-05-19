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

interface Props {
  tab: number;
  setTab(tab: number): void;
}

const HomeTabBar: React.FC<Props> = ({ tab, setTab }) => {
  return (
    <IonTabs>
      <IonRouterOutlet></IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton
          selected={tab === 0}
          onClick={() => setTab(0)}
          tab="messages"
        >
          <IonIcon icon={chatbox} />
          <IonLabel>Messages</IonLabel>
        </IonTabButton>
        <IonTabButton
          selected={tab === 1}
          onClick={() => setTab(1)}
          tab="contacts"
        >
          <IonIcon icon={personCircle} />
          <IonLabel>Contacts</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default HomeTabBar;
