import React from "react";
import styles from "./style.module.css";
import {
  IonNote,
  IonList,
  IonItem,
  IonLabel,
  IonText,
  IonItemGroup,
} from "@ionic/react";

interface Profile {
  [key: string]: any;
}

const ProfileDetails = ({ profile }: any) => {
  const profileKeys = Object.keys(profile);

  return (
    <div className={styles.profileDetails}>
      <IonList>
        {profileKeys.map((key) => (
          <IonItem key={key} color="none" lines="none">
            <div className={styles.ionItem}>
              <IonNote>{key}</IonNote>

              <IonLabel>{profile[key]}</IonLabel>
            </div>
          </IonItem>
        ))}
      </IonList>
    </div>
  );
};

export default ProfileDetails;
