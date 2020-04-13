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
  IonLabel,
  IonCard
} from "@ionic/react";
import React, { useState } from "react";
// import ExploreContainer from "../components/ExploreContainer";
import "./Home.css";

import { useQuery, useMutation } from '@apollo/react-hooks';
import REGISTER_USERNAME_MUTATION from '../graphql/registerUsernameMutation';
import CREATE_PROFILE_MUTATION from '../graphql/createProfileMutation';
import LIST_PROFILES_QUERY from '../graphql/listProfilesQuery';
// import SEARCH_USERNAME_QUERY from '../graphql/searchUsernameQuery';

interface Profile {
  username: String,
}

const Home: React.FC = () => {
  const [FN, setFN] = useState("");
  const [LN, setLN] = useState("");
  const [EA, setEA] = useState("");
  const [UN, setUN] = useState("");

  const [registerUsername] = useMutation(REGISTER_USERNAME_MUTATION, { refetchQueries: [{ query: LIST_PROFILES_QUERY }]});
  const [createProfile] = useMutation(CREATE_PROFILE_MUTATION)
  const { data: { listProfiles } = { listProfiles: [] } } = useQuery(LIST_PROFILES_QUERY);
  // const { data: { searchUsername } = { searchUsername: [] } } = useQuery(SEARCH_USERNAME_QUERY);

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

        <IonCard>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Register Username</IonTitle>
            </IonToolbar>
          </IonHeader>

          <IonItem>
            <IonInput value={UN} placeholder="Enter First Name" onIonChange={e => setUN(e.detail.value!)}></IonInput>
          </IonItem>

          <IonButton size={'large'} onClick={() => {
            registerUsername({ variables: { profile_input: { username: UN }}})
            }}
          >
            Register
          </IonButton>
        </IonCard>
        
        <IonCard>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Profile</IonTitle>
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
            createProfile({ variables: { profile_input: {first_name: FN, last_name: LN, email: EA}} })
            }}
          >
            Submit
          </IonButton>
        </IonCard>
          
        <IonCard>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Username List</IonTitle>
            </IonToolbar>
          </IonHeader>

          <IonList>
            {listProfiles !== null 
                ? listProfiles.map((profile: Profile) => 
                    <IonItem key={profile.username.toString()} >
                        <IonLabel>{profile.username}</IonLabel>
                    </IonItem>
                ) 
                : () => console.log("no entries")
            }
          </IonList>

        </IonCard>
        
          

      </IonContent>
    </IonPage>
  )
};

export default Home;
