import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { call } from "ionicons/icons";
import React from "react";
import styles from "./style.module.css";

type ChatHeaderProps = {
  name: string;
};

const ChatHeader: React.FC<ChatHeaderProps> = ({ name }: ChatHeaderProps) => (
  <IonHeader>
    <IonToolbar>
      <IonButtons slot="start">
        <IonBackButton />
      </IonButtons>
      <div className={styles["header-label"]}>
        <img
          height="40px"
          className={`ion-float-left ${styles.img}`}
          src="https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y"
          alt=""
        />

        <IonTitle className="ion-no-padding ion-padding-start">{name}</IonTitle>
      </div>
      <IonButtons slot="end">
        <IonButton>
          <IonIcon slot="end" icon={call} />
        </IonButton>
      </IonButtons>
    </IonToolbar>
  </IonHeader>
);

/* <IonGrid class="ion-no-padding">
          <IonRow className={`${styles["header-row"]}`}>
            <IonCol className={`${styles["header-col"]}`}>
              <IonButtons>
                <IonButton onClick={() => history.push("/home/messages")}>
                  <IonIcon icon={arrowBack}></IonIcon>
                </IonButton>
              </IonButtons>
            </IonCol>

            <IonCol className={`${styles["header-col"]}`}>
              <IonAvatar className={`${styles["avatar"]}`}>
                <img
                  className={`${styles["img"]}`}
                  src="https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y"
                  alt=""
                />
              </IonAvatar>
            </IonCol>

            <IonCol className={`${styles["header-col"]}`} size={"auto"}>
              <h3 className={`${styles["header-name"]}`}>{name}</h3>
            </IonCol>

            <IonCol className={`${styles["header-col"]}`}>
              <IonButtons>
                <IonButton className={`${styles["call-btn"]}`}>
                  <IonIcon icon={call} />
                </IonButton>
              </IonButtons>
            </IonCol>
          </IonRow>
        </IonGrid> */

export default ChatHeader;
