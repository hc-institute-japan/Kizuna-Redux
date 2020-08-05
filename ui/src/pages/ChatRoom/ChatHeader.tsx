import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { call, personAddOutline, removeCircleOutline } from "ionicons/icons";
import React from "react";
import styles from "./style.module.css";

type ChatHeaderProps = {
  name: string;
  isContact: boolean;
};

const ChatHeader: React.FC<ChatHeaderProps> = ({
  name,
  isContact,
}: ChatHeaderProps) => {
  return (
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
          <IonTitle className="ion-no-padding ion-padding-start">
            {name}
          </IonTitle>
        </div>
        <IonButtons slot="end">
          <IonButton>
            <IonIcon slot="end" icon={call} />
          </IonButton>
        </IonButtons>
      </IonToolbar>
      {isContact ? null : (
        <IonToolbar>
          <IonTitle size="small" color="medium">
            This person is not in your contacts
          </IonTitle>
          <IonButtons slot="end">
            <IonButton>
              <IonIcon slot="end" color="danger" icon={removeCircleOutline} />
            </IonButton>
            <IonButton>
              <IonIcon slot="end" color="success" icon={personAddOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      )}
    </IonHeader>
  );
};

export default ChatHeader;
