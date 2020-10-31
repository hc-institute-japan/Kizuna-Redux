import { useMutation } from "@apollo/react-hooks";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonIcon,
  IonInput,
  IonPage,
  IonText,
  IonToolbar,
} from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import withToast, { ToastProps } from "../../components/Toast/withToast";
import DELETE_PROFILE_MUTATION from "../../graphql/mutation/deleteProfileMutation";
import { RootState } from "../../redux/reducers";
import { Profile } from "../../utils/types";
import styles from "./style.module.css";

interface ChangeEventDetail {
  value: string | undefined | null;
}

const DeleteProfile: React.FC<ToastProps> = ({ pushErr }) => {
  const profile: Profile = useSelector((state: RootState) => state.profile);
  // const [username, setUsername] = useState("");
  const [isUsernameCorrect, setIsUsernameCorrect] = useState(false);

  const handleOnChange = (e: any) => {
    const string = e.target.value.trim();
    string === profile.username
      ? setIsUsernameCorrect(true)
      : setIsUsernameCorrect(false);
    // setUsername(string);
  };

  const [deleteProfile, { error }] = useMutation(DELETE_PROFILE_MUTATION);

  const onSubmitAction = async () => {
    await deleteProfile();
  };

  useEffect(() => {
    if (error) pushErr(error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

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
          <h5>
            Deleting your profile is irreversible. Please enter your username to
            confirm deletion.
          </h5>
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

export default withToast(DeleteProfile);
