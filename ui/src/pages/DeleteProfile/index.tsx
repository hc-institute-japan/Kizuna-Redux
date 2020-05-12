import React, { useState } from "react";
import {
  IonPage,
  IonToolbar,
  IonHeader,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonText,
  IonInput,
} from "@ionic/react";
import styles from "./style.module.css";
import DELETE_PROFILE_MUTATION from "../../graphql/mutation/deleteProfileMutation";
import { useMutation } from "@apollo/react-hooks";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/reducers";
import { arrowBack } from "ionicons/icons";

const DeleteProfile = () => {
  const profile: any = useSelector((state: RootState) => state.profile);
  const [username, setUsername] = useState("");
  const [isUsernameCorrect, setIsUsernameCorrect] = useState(false);

  const handleOnChange = (e: any) => {
    const string = e.target.value.trim();
    string === profile.username ? setIsUsernameCorrect(true) : setIsUsernameCorrect(false);
    setUsername(string);
  }

  const [deleteProfile] = useMutation(DELETE_PROFILE_MUTATION);

  const onSubmitAction = async () => {
    const deleteSuccess = await deleteProfile();
  }

  return (
    <IonPage>
        
      <IonToolbar>
        <IonButtons>
          <IonButton href="/profile">
            <IonIcon icon={arrowBack}></IonIcon>
          </IonButton>
        </IonButtons>
      </IonToolbar>

      <IonContent className="ion-padding">
        <IonText>
            <h5>Deleting your profile is irreversible. Please enter your username to confirm deletion.</h5>
        </IonText>
        <IonInput 
            className={styles.input}
            onIonChange={handleOnChange}
            placeholder="username"
        ></IonInput>

        <IonButton 
            className="ion-margin-top" 
            expand="block" 
            color="danger"
            disabled={!isUsernameCorrect}
            onClick={onSubmitAction}
        >
          Delete
        </IonButton>
        
      </IonContent>
    
    </IonPage>
  );
};

export default DeleteProfile;
