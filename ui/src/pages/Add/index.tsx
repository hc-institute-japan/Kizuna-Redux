import { useMutation, useQuery } from "@apollo/react-hooks";
import {
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonSpinner,
} from "@ionic/react";
import { add } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import SearchHeader from "../../components/Header/SearchHeader";
import IonContainer from "../../components/IonContainer";
import withToast, { ToastProps } from "../../components/Toast/withToast";
import ADD_CONTACTS from "../../graphql/mutation/addContactMutation";
import ALL from "../../graphql/query/allAgentsQuery";
import { setContacts } from "../../redux/contacts/actions";
import { RootState } from "../../redux/reducers";
import { getTimestamp } from "../../utils/helpers";
import EmptyResult from "./EmptyResult";
import SearchPrompt from "./SearchPrompt";
import styles from "./style.module.css";
import { Profile } from "../../utils/types";

const Add: React.FC<ToastProps> = ({ pushErr }) => {
  const { data, error, loading } = useQuery(ALL);
  const [addContacts] = useMutation(ADD_CONTACTS);
  const history = useHistory();
  const dispatch = useDispatch();
  const { contacts } = useSelector((state: RootState) => state.contacts);

  const users = data
    ? data.allAgents.map((user: Profile) => ({
        id: user.id,
        username: user.username,
      }))
    : [];

  useEffect(() => {
    if (error) pushErr(error, {}, "profiles");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const [search, setSearch] = useState("");
  const filteredUsers = users.filter((user: Profile) =>
    user.username.toLowerCase().includes(search)
  );

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
        {loading ? (
          <div className={styles.center}>
            <IonSpinner></IonSpinner>
          </div>
        ) : search.length > 0 ? (
          filteredUsers.length === 0 ? (
            <EmptyResult />
          ) : (
            filteredUsers.map((user: Profile) =>
              contacts.some(
                (contact: Profile) => contact.username === user.username
              ) ? null : (
                <IonList>
                  {" "}
                  <IonItem key={user.username}>
                    <IonLabel>{user.username}</IonLabel>

                    <IonButton
                      onClick={async () => {
                        try {
                          const profile: Profile = await addContacts({
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
                          pushErr(e, {}, "contacts", "addContact");
                        }
                      }}
                      fill="clear"
                      color="dark"
                      slot="end"
                    >
                      <IonIcon icon={add} slot="end" />
                    </IonButton>
                  </IonItem>
                </IonList>
              )
            )
          )
        ) : (
          <SearchPrompt />
        )}
      </IonContent>
    </IonContainer>
  );
};

export default withToast(Add);
