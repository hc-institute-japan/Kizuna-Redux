import { useMutation, useQuery } from "@apollo/react-hooks";
import {
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
} from "@ionic/react";
import { add, push } from "ionicons/icons";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import SearchHeader from "../../components/Header/SearchHeader";
import IonContainer from "../../components/IonContainer";
import ADD_CONTACTS from "../../graphql/mutation/addContactMutation";
import ALL from "../../graphql/query/allAgentsQuery";
import { setContacts } from "../../redux/contacts/actions";
import { RootState } from "../../redux/reducers";
import { getTimestamp } from "../../utils/helpers";
import withToast from "../../components/Toast/withToast";
import { attachProps } from "@ionic/react/dist/types/components/utils";

const Add = ({ pushErr }: any) => {
  const { data, error } = useQuery(ALL);
  const [addContacts] = useMutation(ADD_CONTACTS);
  const history = useHistory();
  const dispatch = useDispatch();
  const { contacts } = useSelector((state: RootState) => state.contacts);

  const users = data
    ? data.allAgents.map((user: any) => ({
        id: user.id,
        username: user.username,
      }))
    : [];

  useEffect(() => {
    if (error) pushErr(error, {}, "profiles");
  }, [error]);

  const [search, setSearch] = useState("");

  return (
    <IonContainer>
      <SearchHeader
        onSearchChange={(e) => setSearch((e.target as HTMLInputElement).value)}
        onBack={() => {
          history.push("home/contacts");
        }}
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
              .map((user: any) =>
                contacts.some(
                  (contact: any) => contact.username === user.username
                ) ? null : (
                  <IonItem key={user.username}>
                    <IonLabel>{user.username}</IonLabel>

                    <IonButton
                      onClick={async () => {
                        try {
                          const profile: any = await addContacts({
                            variables: {
                              username: user.username,
                              timestamp: getTimestamp(),
                            },
                          });
                          dispatch(
                            setContacts([
                              ...contacts,
                              {
                                username: profile.data.addContact.username,
                              },
                            ])
                          );
                        } catch (e) {
                          pushErr(e, {}, "contacts", "addContact")
                        }
                      }}
                      fill="clear"
                      color="dark"
                      slot="end"
                    >
                      <IonIcon icon={add} slot="end" />
                    </IonButton>
                  </IonItem>
                )
              )}
          </IonList>
        ) : null}
      </IonContent>
    </IonContainer>
  );
};

export default withToast(Add);
