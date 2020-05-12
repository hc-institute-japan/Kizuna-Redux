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
import React, { useState } from "react";
import { useSelector } from "react-redux";
import Input from "../../components/Input";
import { RootState } from "../../redux/reducers";
import UPDATE_PROFILE_MUTATION from "../../graphql/mutation/updateProfile";

const EditProfile: React.FC = () => {
  const { profile }: { profile: any } = useSelector(
    (state: RootState) => state.profile
  );
  const [profileInput, setProfileInput] = useState({});

  const [updateProfile] = useMutation(UPDATE_PROFILE_MUTATION);

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

export default EditProfile;
