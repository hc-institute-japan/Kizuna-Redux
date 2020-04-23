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
//   import "./Home.css";
  
  import { useQuery, useMutation } from '@apollo/react-hooks';
  import REGISTER_USERNAME_MUTATION from './registerUsernameMutation';
  import CREATE_PROFILE_MUTATION from './createProfileMutation';
  import LIST_PROFILES_QUERY from './listProfilesQuery';
  import SEARCH_USERNAME_QUERY from './searchUsernameQuery';
  import REGISTER_MUTATION from './registerMutation';
  import GET_LINKED_QUERY from './getLinkedProfileQuery';
  import GET_HASHED_EMAILS from './getHashedEmails';
  import COMPARE_HASHES from './compareHashesQuery';
  import IS_EMAIL_REGISTERED from './isEmailRegisteredQuery';
  
  interface Profile {
    username: String,
  }

  interface PrivateProfile {
    first_name: String,
    last_name: String,
    email: String
  }
  
  const Home: React.FC = () => {
    const [FN, setFN] = useState("");
    const [LN, setLN] = useState("");
    const [EA, setEA] = useState("");
    const [UN, setUN] = useState("");
  
    const [registerUsername] = useMutation(REGISTER_USERNAME_MUTATION, { refetchQueries: [{ query: SEARCH_USERNAME_QUERY, variables: {username: "nicko" } }]});
    // const [register] = useMutation(REGISTER_MUTATION, { refetchQueries: [{ query: GET_LINKED_QUERY, variables: {username: "nicko" } }]});
    const [register] = useMutation(REGISTER_MUTATION, 
      { refetchQueries: 
        [
          { query: GET_LINKED_QUERY, variables: { username: "nicko" } },
          { query: SEARCH_USERNAME_QUERY, variables: { username: "nicko" } },
          { query: GET_HASHED_EMAILS, variables: { email: "nickolie@gmail.com" } },
          // { query: COMPARE_HASHES, variables: { input: {first_name: "nickolie", last_name: "pangarungan", email: "nicko@gmail.com"} }},
          { query: IS_EMAIL_REGISTERED, variables: { email: "nickolie@gmail.com"} },
        ]
      }
    );
    const [createProfile] = useMutation(CREATE_PROFILE_MUTATION)
    // const { data: { listProfiles } = { listProfiles: [] } } = useQuery(LIST_PROFILES_QUERY);
    const { data: {searchUsername} = { searchUsername: [] } } =  useQuery(SEARCH_USERNAME_QUERY, { variables: { username: "nicko" }} );
    const { data: {getLinkedProfile} = { getLinkedProfile: [] } } =  useQuery(GET_LINKED_QUERY);
  
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
                <IonTitle>Profile</IonTitle>
              </IonToolbar>
            </IonHeader>
            
            <IonList>
              <IonItem>
                <IonInput value={UN} placeholder="Enter username" onIonChange={e => setUN(e.detail.value!)}></IonInput>
              </IonItem>
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
              register({ variables: { public_input: {username: UN}, private_input: {first_name: FN, last_name: LN, email: EA} } })
              }}
            >
              Submit
            </IonButton>
          </IonCard>
            
          <IonCard>
            <IonHeader>
              <IonToolbar>
                <IonTitle>List</IonTitle>
              </IonToolbar>
            </IonHeader>
  
            <IonList>
              { getLinkedProfile!== null 
                  ? getLinkedProfile.map((profile: PrivateProfile) => 
                      <IonItem key={profile.email.toString()} >
                          <IonLabel>{profile.email}</IonLabel>
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