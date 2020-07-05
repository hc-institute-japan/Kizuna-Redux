import { useMutation } from "@apollo/react-hooks";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonIcon,
  IonPage,
  IonToolbar,
} from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Input from "../../components/Input";
import withToast, { ToastProps } from "../../components/Toast/withToast";
import UPDATE_PROFILE_MUTATION from "../../graphql/mutation/updateProfile";
import { RootState } from "../../redux/reducers";

const EditProfile: React.FC<ToastProps> = ({ pushErr }) => {
  const { profile } = useSelector((state: RootState) => state.profile);
  const [profileInput, setProfileInput] = useState({});

  const [updateProfile, { error }] = useMutation(UPDATE_PROFILE_MUTATION);

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
        {Object.keys(profile).map((profileKey: string) => {
          const value = profile[profileKey];
          return (
            <Input
              key={profileKey}
              label={profileKey}
              placeholder={value}
              onIonChange={(e) => {
                setProfileInput((prev) => ({ ...prev, [profileKey]: e }));
              }}
            ></Input>
          );
        })}
        <IonButton
          onClick={() => {
            updateProfile({ variables: { profile: { ...profileInput } } });
          }}
          className="ion-margin-top"
          expand="block"
        >
          Submit
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default withToast(EditProfile);
