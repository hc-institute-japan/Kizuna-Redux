import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import { useSelector, useDispatch } from "react-redux";
import { IonPage, IonLoading, IonContent } from "@ionic/react";
import { setContacts } from "../../../redux/contacts/actions";
import CONTACTS from "../../../graphql/query/listContactsQuery";
import { RootState } from "../../../redux/reducers";
import withToast from "../../../components/Toast/withToast";
import RecipientList from "./RecipientList";
import NewConversationHeader from "./NewConversationHeader";

type NewConversationModalProps = {
	pushErr: any,
	setShowModal(value: boolean): Function,
}

const NewConversationModal: React.FC<any> = ({ pushErr, setShowModal }: NewConversationModalProps) => {
	const [search, setSearch] = useState("");
	const [hasFetched, setHasFetched] = useState(false);
	const dispatch = useDispatch();

	
	const { indexedContacts, contacts } = useSelector(
		(state: RootState) => state.contacts
		);

	const { profile } = useSelector(
		(state: RootState) => state.profile
		);

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
					contacts={contacts}
					profile={profile}
					indexedContacts={indexedContacts}
				/>
			</IonContent>
  ) : (
    <IonLoading isOpen={loading} message={"Please wait..."} />
  );
}

export default withToast(NewConversationModal);