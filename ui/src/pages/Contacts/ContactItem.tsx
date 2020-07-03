import { useMutation } from "@apollo/react-hooks";
import {
  IonButton,
  IonButtons,
  IonIcon,
  IonItem,
  IonLabel,
} from "@ionic/react";
import { sync, trashBin } from "ionicons/icons";
import React from "react";
import BLOCK_PROFILE from "../../graphql/mutation/blockContactMutation";
import REMOVE_CONTACT from "../../graphql/mutation/removeContactMutation";
import { getTimestamp } from "../../utils/helpers";
import { useDispatch } from "react-redux";
import { setContacts } from "../../redux/contacts/actions";
import withToast, { ToastProps } from "../../components/Toast/withToast";
import { Profile } from "../../utils/types";

interface Props extends ToastProps {
  contact: Profile;
  contacts: Array<Profile> | [];
}

const ContactItem: React.FC<Props> = ({ contact, contacts, pushErr }) => {
  const [removeContact] = useMutation(REMOVE_CONTACT);
  const [blockContact] = useMutation(BLOCK_PROFILE);

  const dispatch = useDispatch();
  return (
    <IonItem>
      <IonLabel>{contact.username}</IonLabel>
      <IonButtons slot="end">
        <IonButton
          onClick={async () => {
            try {
              await blockContact({
                variables: {
                  username: contact.username,
                  timestamp: getTimestamp(),
                },
              });
            } catch (e) {
              pushErr(e, {}, "contacts", "blockContact");
            }
          }}
          fill="clear"
          color="dark"
        >
          <IonIcon icon={sync} slot="end" />
        </IonButton>
        <IonButton
          onClick={async () => {
            try {
              const removedContact: Profile = await removeContact({
                variables: {
                  username: contact.username,
                  timestamp: getTimestamp(),
                },
              });
              const updatedContacts = contacts.filter(
                (c: Profile) =>
                  c.username !== removedContact.data.removeContact.username
              );

              dispatch(setContacts(updatedContacts));
            } catch (e) {
              pushErr(e, {}, "contacts", "removeContact");
            }
          }}
          fill="clear"
          color="dark"
        >
          <IonIcon icon={trashBin} slot="end" />
        </IonButton>
      </IonButtons>
    </IonItem>
  );
};

export default withToast(ContactItem);
