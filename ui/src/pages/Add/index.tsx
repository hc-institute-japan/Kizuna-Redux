import { useMutation, useQuery } from "@apollo/react-hooks";
import {
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
} from "@ionic/react";
import { add } from "ionicons/icons";
import React, { useState } from "react";
import SearchHeader from "../../components/Header/SearchHeader";
import IonContainer from "../../components/IonContainer";
import ADD_PROFILE from "../../graphql/mutation/addContactMutation";
import ALL from "../../graphql/query/allAgentsQuery";
import { getTimestamp } from "../../utils/helpers";

const Add = () => {
  const { data } = useQuery(ALL);
  const [addProfile] = useMutation(ADD_PROFILE);

  const users = data
    ? data.allAgents.map((user: any) => ({
        id: user.id,
        username: user.username,
      }))
    : [];

  const [search, setSearch] = useState("");

  // [
  //   { address: "test1", username: "Neil" },
  //   { address: "test2", username: "Dave" },
  //   { address: "test3", username: "Tatsuya" },
  //   { address: "test4", username: "Tomato" },
  //   { address: "test5", username: "Potato" },
  //   { address: "test6", username: "Akira" },
  //   { address: "test7", username: "Nicko" },
  //   { address: "test8", username: "Zendaya" },
  //   { address: "test9", username: "Wakabayashi" },
  //   { address: "test10", username: "Sato" },
  //   { address: "test11", username: "Pangarungan" },
  //   { address: "test12", username: "Gardose" },
  //   { address: "test13", username: "Sasaki" },
  //   { username: "test14" },
  //   { username: "test15" },
  // ];

  return (
    <IonContainer>
      <SearchHeader
        onSearchChange={(e) => setSearch((e.target as HTMLInputElement).value)}
        value={search}
        placeholder="Search User"
      />
      <IonContent>
        {search.length > 0 ? (
          <IonList>
            {users
              .filter((user: any) =>
                user.username.toLowerCase().includes(search)
              )
              .map((user: any) => (
                <IonItem key={user.username}>
                  <IonLabel>{user.username}</IonLabel>
                  <IonButton
                    onClick={() => {
                      console.log(getTimestamp());
                      addProfile({
                        variables: {
                          username: user.username,
                          timestamp: Math.floor(getTimestamp()),
                        },
                      });
                    }}
                    fill="clear"
                    color="dark"
                    slot="end"
                  >
                    <IonIcon icon={add} slot="end" />
                  </IonButton>
                </IonItem>
              ))}
          </IonList>
        ) : null}
      </IonContent>
    </IonContainer>
  );
};

export default Add;
