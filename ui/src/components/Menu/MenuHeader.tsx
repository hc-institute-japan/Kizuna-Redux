import React from "react";
import {
  IonGrid,
  IonRow,
  IonCol,
  IonAvatar,
  IonText,
  IonNote,
} from "@ionic/react";
import styles from "./style.module.css";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/reducers";

const MenuHeader = () => {
  const profile = useSelector((state: RootState) => state.profile);
  return (
    <div className={`${styles.profile} ion-padding`}>
      <IonGrid>
        <IonRow>
          <IonCol>
            <IonAvatar>
              <img src={profile.profilePicture}></img>
            </IonAvatar>
          </IonCol>
        </IonRow>
        <IonText color="dark">
          <h3>{`${profile.firstName} ${profile.lastName}`}</h3>
        </IonText>
        <IonNote>{profile.email}</IonNote>
      </IonGrid>
    </div>
  );
};

export default MenuHeader;
