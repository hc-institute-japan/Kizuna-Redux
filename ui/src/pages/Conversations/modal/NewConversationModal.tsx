import { useQuery } from "@apollo/react-hooks";
import { IonContent, IonLoading } from "@ionic/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import withToast, { ToastProps } from "../../../components/Toast/withToast";
import CONTACTS from "../../../graphql/query/listContactsQuery";
import { setContacts } from "../../../redux/contacts/actions";
import { RootState } from "../../../redux/reducers";
import { Conversation } from "../../../utils/types";
import NewConversationHeader from "./NewConversationHeader";
import RecipientList from "./RecipientList";

interface Props extends ToastProps {
  setShowModal(value: boolean): Function;
  conversations: Array<Conversation>;
}

const NewConversationModal: React.FC<Props> = ({
  pushErr,
  setShowModal,
  conversations,
}: Props) => {
  const [search, setSearch] = useState("");
  const [hasFetched, setHasFetched] = useState(false);
  const [showLocading, setShowLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  const {
    profile: { id: myAddress },
  } = useSelector((state: RootState) => state.profile);

  const { indexedContacts, contacts } = useSelector(
    (state: RootState) => state.contacts
  );

  // should only fetch when contacts is not cached.
  const { data, loading } = useQuery(CONTACTS, {
    fetchPolicy: "no-cache",
    skip: hasFetched,
    onError: (e) => pushErr(e, {}, "cotacts"),
  });

  //   useEffect(() => {
  //     // this needs to be fixed later on
  //     if (error)
  //   }, [error]);

  useEffect(() => {
    if (!loading) {
      setHasFetched(true);
      dispatch(setContacts(data ? data.contacts : contacts));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return !loading ? (
    <IonContent>
      <NewConversationHeader
        search={search}
        setSearch={setSearch}
        setShowModal={setShowModal}
      />
      <RecipientList
        search={search}
        conversations={conversations}
        indexedContacts={indexedContacts}
        myAddress={myAddress}
        setShowLoading={setShowLoading}
      />
      <IonLoading
        isOpen={showLocading}
        message="Creating a private chatroom..."
        duration={5000}
      />
    </IonContent>
  ) : (
    <IonLoading isOpen={loading} message="Please wait..." />
  );
};

export default withToast(NewConversationModal);
