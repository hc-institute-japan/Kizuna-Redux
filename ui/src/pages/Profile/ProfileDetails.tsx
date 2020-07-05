import { IonItem, IonLabel, IonList, IonNote } from "@ionic/react";
import React from "react";
import styles from "./style.module.css";
import { Profile } from "../../utils/types";

interface Props {
  profile: Profile;
}

const ProfileDetails: React.FC<Props> = ({ profile }) => {
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
