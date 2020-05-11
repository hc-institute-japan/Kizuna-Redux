import React from "react";
import {
  IonPage,
  IonToolbar,
  IonHeader,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonText,
} from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import Input from "../../components/Input";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/reducers";

const EditProfile = () => {
  const profile: any = useSelector((state: RootState) => state.profile);

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
        {Object.keys(profile).map((profileKey: string) => (
          <Input
            key={profileKey}
            label={profileKey}
            // placeholder={profile[profileKey]}
          ></Input>
        ))}
        <IonButton className="ion-margin-top" expand="block">
          Submit
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default EditProfile;
