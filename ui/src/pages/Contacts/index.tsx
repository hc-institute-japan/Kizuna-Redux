import { useQuery } from "@apollo/react-hooks";
import {
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonPage,
} from "@ionic/react";
import { add } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import withToast from "../../components/Toast/withToast";
import CONTACTS from "../../graphql/query/listContactsQuery";
import { setContacts } from "../../redux/contacts/actions";
import { RootState } from "../../redux/reducers";
import ContactList from "./ContactList";
import ContactsHeader from "./ContactsHeader";
import styles from "./style.module.css";

const Contacts = ({ history, pushErr }: any) => {
  const [search, setSearch] = useState("");
  const [hasFetched, setHasFetched] = useState(false);

  const { indexedContacts, contacts } = useSelector(
    (state: RootState) => state.contacts
  );

  const dispatch = useDispatch();
  const { data, loading, error } = useQuery(CONTACTS, {
    fetchPolicy: "no-cache",
    skip: hasFetched,
  });

  useEffect(() => {
    // this needs to be fixed later on
    if (error) pushErr(error, {}, "cotacts");
  }, [error]);

  useEffect(() => {
    if (!loading) {
      setHasFetched(true);
      dispatch(setContacts(data ? data.contacts : contacts));
    }
  }, [loading, contacts, data, dispatch]);

  return (
    <IonPage>
      <ContactsHeader search={search} setSearch={setSearch} />

      <IonContent>
        <ContactList
          search={search}
          contacts={contacts}
          indexedContacts={indexedContacts}
        />
      </IonContent>
      <IonFab
        onClick={() => history.push("/add")}
        className={styles.fab}
        vertical="bottom"
        horizontal="end"
        slot="fixed"
      >
        <IonFabButton>
          <IonIcon icon={add}  />
        </IonFabButton>
      </IonFab>
    </IonPage>
  );
};

export default withToast(withRouter(Contacts));
