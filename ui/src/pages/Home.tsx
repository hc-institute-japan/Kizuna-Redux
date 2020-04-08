import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonInput,
  IonButton,
  IonLabel
} from "@ionic/react";
import React, { useState } from "react";
import ExploreContainer from "../components/ExploreContainer";
import "./Home.css";

import { useQuery, useMutation } from '@apollo/react-hooks';
import LIST_PROFILES_QUERY from '../graphql/listProfilesQuery';
import CREATE_PROFILE_MUTATION from '../graphql/createProfileMutation';

interface Profile {
  first_name: String,
}

const Home: React.FC = () => {
  const [FN, setFN] = useState("");
  const [LN, setLN] = useState("");
  const [EA, setEA] = useState("");

  const { data: { listProfiles } = { listProfiles: [] } } = useQuery(LIST_PROFILES_QUERY);
  const [createProfile] = useMutation(CREATE_PROFILE_MUTATION, { refetchQueries: [{ query: LIST_PROFILES_QUERY }]})
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Kizuna Connect</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Kizuna Connect</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonList>
          <IonItem>
            <IonInput value={FN} placeholder="Enter First Name" onIonChange={e => setFN(e.detail.value!)}></IonInput>
          </IonItem>
          <IonItem>
            <IonInput value={LN} placeholder="Enter Last Name" onIonChange={e => setLN(e.detail.value!)}></IonInput>
          </IonItem>
          <IonItem>
            <IonInput value={EA} placeholder="Enter Email" onIonChange={e => setEA(e.detail.value!)}></IonInput>
          </IonItem>
        </IonList>

        <IonButton size={'large'} onClick={() => {
          console.log('clicked')
          createProfile({ variables: { profileInput: { first_name: FN, last_name: LN, email: EA } }})}
          }
        >
          Submit
        </IonButton>

        <IonHeader>
          <IonToolbar>
            <IonTitle>Users</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonList>
          {listProfiles !== null ? listProfiles.map((profile: Profile) => 
            <IonItem>
              <IonLabel>{profile.first_name}</IonLabel>
            </IonItem>
            ) : null}
        </IonList>

      </IonContent>
    </IonPage>
  )
};

export default Home;
