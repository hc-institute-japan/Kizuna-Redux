import {
  IonButton,
  IonButtons,
  IonCol,
  IonGrid,
  IonHeader,
  IonRow,
  IonSearchbar,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React from "react";
import { useHistory } from "react-router-dom";
import styles from "./style.module.css";

type NewConversationHeader = {
  setSearch(value: string): void;
  setShowModal(value: boolean): void;
  search: string;
}
const NewConversationHeader: React.FC<NewConversationHeader> = ({ search, setSearch, setShowModal }: NewConversationHeader) => {
  const history = useHistory();

  return (
    <IonHeader className={`${styles["header"]}`}>
      <IonToolbar>
        <IonGrid class="ion-no-padding">
          <IonRow className={`${styles["row"]}`}>
            <IonCol size={"2"}>
              <IonButtons>
                <IonButton
                  onClick={() => {
                    setShowModal(false);
                  }}
                  className={`${styles["cancel-btn"]}`}
                  size={"small"}
                >
                  Cancel
                </IonButton>
              </IonButtons>
            </IonCol>

            <IonCol size={"10"}>
              <IonTitle className={`${styles["title"]}`} size={"small"}>
                New Conversation
              </IonTitle>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonSearchbar
          className={`${styles["search-bar"]}`}
          onIonChange={(e) => setSearch((e.target as HTMLInputElement).value)}
          value={search}
          placeholder={"Search by username"}
        />
      </IonToolbar>
    </IonHeader>
  );
};

export default NewConversationHeader;
