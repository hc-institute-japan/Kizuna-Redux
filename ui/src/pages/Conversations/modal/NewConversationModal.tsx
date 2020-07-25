import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import { useSelector, useDispatch } from "react-redux";
import { IonPage, IonLoading, IonContent } from "@ionic/react";
import { setContacts } from "../../../redux/contacts/actions";
import CONTACTS from "../../../graphql/query/listContactsQuery";
import { RootState } from "../../../redux/reducers";
import withToast, { ToastProps } from "../../../components/Toast/withToast";
import RecipientList from "./RecipientList";
import NewConversationHeader from "./NewConversationHeader";
import { Conversation } from "../../../utils/types";

interface Props extends ToastProps {
	setShowModal(value: boolean): Function,
	conversations: Array<Conversation>,
}

const NewConversationModal: React.FC<Props> = ({ pushErr, setShowModal, conversations }: Props) => {
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
  }, [loading]);

  return !loading ? (
			<IonContent>
				<NewConversationHeader search={search} setSearch={setSearch} setShowModal={setShowModal} />
				<RecipientList 
					search={search}
					conversations={conversations}
					indexedContacts={indexedContacts}
          myAddress={myAddress}
          setShowLoading={setShowLoading}
				/>
				<IonLoading
        			isOpen={showLocading}
        			message={'Creating a private chatroom...'}
        			duration={5000}
      			/>
			</IonContent>
  ) : (
    <IonLoading isOpen={loading} message={"Please wait..."} />
  );
}

export default withToast(NewConversationModal);