import { IonPage } from "@ionic/react";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/reducers";
import ProfileHeader from "./ProfileHeader";
import styles from "./style.module.css";
import ProfileDetails from "./ProfileDetails";

const Profile = () => {
  const { profile } = useSelector((state: RootState) => state.profile);

  return (
    <IonPage>
      <div className={styles.profileContainer}>
        <ProfileHeader url={profile.profilePicture} />
        <ProfileDetails profile={profile} />
      </div>
    </IonPage>
  );
};

export default Profile;
