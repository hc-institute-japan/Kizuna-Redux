import {
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
} from "@ionic/react";
import { close } from "ionicons/icons";
import React from "react";
import { useSelector } from "react-redux";
import HomeHeader from "../../components/Header/HomeHeader";
import { RootState } from "../../redux/reducers";
import styles from "./style.module.css";
import BackHeader from "../../components/Header/BackHeader";

const Blocked: React.FC<any> = () => {
  const { blocked } = useSelector((state: RootState) => state.contacts);
  return (
    <>
      <BackHeader />
      <IonContent>
        <IonList className={`${styles.homeContent} has-tabs`}>
          {blocked.map((block: any) => (
            <IonItem key={block.username}>
              <IonLabel>{block.username}</IonLabel>
              <IonButton
                onClick={() => {
                  ///unblock
                }}
                fill="clear"
              >
                <IonIcon color="dark" icon={close}></IonIcon>
              </IonButton>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </>
  );
};

export default Blocked;
