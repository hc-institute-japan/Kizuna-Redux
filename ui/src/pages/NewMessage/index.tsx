import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import { useSelector, useDispatch } from "react-redux";
import { IonPage, IonLoading, IonContent } from "@ionic/react";
import { setContacts } from "../../redux/contacts/actions";
import CONTACTS from "../../graphql/query/listContactsQuery";
import { RootState } from "../../redux/reducers";
import withToast, { ToastProps } from "../../components/Toast/withToast";
import RecipientList from "./RecipientList";
import NewMessageHeader from "./NewMessageHeader";

const NewMessage: React.FC<ToastProps> = ({ pushErr }) => {
  const [search, setSearch] = useState("");
  const [hasFetched, setHasFetched] = useState(false);
  const dispatch = useDispatch();

  const { indexedContacts, contacts } = useSelector(
    (state: RootState) => state.contacts
  );

  const { profile } = useSelector((state: RootState) => state.profile);

  const { data, loading, error } = useQuery(CONTACTS, {
    fetchPolicy: "no-cache",
    skip: hasFetched,
  });

  useEffect(() => {
    // this needs to be fixed later on
    if (error) pushErr(error, {}, "cotacts");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  useEffect(() => {
    if (!loading) {
      setHasFetched(true);
      dispatch(setContacts(data ? data.contacts : contacts));
    }
  }, [loading, contacts, data, dispatch]);

  return !loading ? (
    <IonPage>
      <IonContent>
        <NewMessageHeader search={search} setSearch={setSearch} />
        <RecipientList
          search={search}
          contacts={contacts}
          profile={profile}
          indexedContacts={indexedContacts}
        />
      </IonContent>
    </IonPage>
  ) : (
    <IonLoading isOpen={loading} message={"Please wait..."} />
  );
};

export default withToast(NewMessage);
