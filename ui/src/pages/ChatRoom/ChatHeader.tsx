import React from "react";
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonBackButton,
  IonAvatar,
  IonImg,
  IonGrid,
  IonCol,
  IonRow,
} from "@ionic/react";
import { call } from "ionicons/icons";
import styles from "./style.module.css";

type ChatHeaderProps = {
  name: string
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ name }: ChatHeaderProps) => (
  <IonHeader>
    <IonToolbar>
      <IonGrid class="ion-no-padding">
        <IonRow className={`${styles['header-row']}`}>

          <IonCol className={`${styles['header-col']}`}>
            <IonButtons>
              <IonBackButton defaultHref={"/home"} />
            </IonButtons>
          </IonCol>

          <IonCol className={`${styles['header-col']}`}>
            <IonAvatar className={`${styles['avatar']}`}>
              <img className={`${styles['img']}`} src="https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y" alt=""/>
            </IonAvatar>
          </IonCol>

          <IonCol className={`${styles['header-col']}`} size={"auto"}>
            <h3 className={`${styles['header-name']}`}>{name}</h3>
          </IonCol>

          <IonCol className={`${styles['header-col']}`}>
            <IonButtons>
              <IonButton className={`${styles['call-btn']}`}>
                <IonIcon icon={call} />
              </IonButton>
            </IonButtons>
          </IonCol>
 
        </IonRow>
      </IonGrid>
    </IonToolbar>
  </IonHeader>
);

export default ChatHeader;