import { useQuery } from "@apollo/react-hooks";
import { IonContent, IonLoading } from "@ionic/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import withToast, { ToastProps } from "../../../components/Toast/withToast";
import CONTACTS from "../../../graphql/query/listContactsQuery";
import { setContacts } from "../../../redux/contacts/actions";
import { RootState } from "../../../redux/reducers";
import NewConversationHeader from "./NewConversationHeader";
import RecipientList from "./RecipientList";

const NewConversationModal: React.FC<ToastProps> = ({ pushErr }) => {
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
  }, [error, pushErr]);

  useEffect(() => {
    if (!loading) {
      setHasFetched(true);
      dispatch(setContacts(data ? data.contacts : contacts));
    }
  }, [loading]);

  return !loading ? (
    <IonContent>
      <NewConversationHeader search={search} setSearch={setSearch} />
      <RecipientList
        search={search}
        contacts={contacts}
        profile={profile}
        indexedContacts={indexedContacts}
      />
    </IonContent>
  ) : (
    <IonLoading isOpen={loading} message={"Please wait..."} />
  );
};

export default withToast(NewConversationModal);
