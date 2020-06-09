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

const ContactItem: any = ({ contact, contacts }: any) => {
  const [removeContact] = useMutation(REMOVE_CONTACT);
  const [blockContact] = useMutation(BLOCK_PROFILE);
  const dispatch = useDispatch();
  return (
    <IonItem>
      <IonLabel>{contact.username}</IonLabel>
      <IonButtons slot="end">
        <IonButton
          onClick={() =>
            blockContact({
              variables: {
                username: contact.username,
                timestamp: getTimestamp(),
              },
            })
          }
          fill="clear"
          color="dark"
        >
          <IonIcon icon={sync} slot="end" />
        </IonButton>
        <IonButton
          onClick={async () => {
            const removedContact: any = await removeContact({
              variables: {
                username: contact.username,
                timestamp: getTimestamp(),
              },
            });

            console.log(removedContact);
            dispatch(
              setContacts(
                contacts.filter(
                  (c: any) =>
                    c.username !== removedContact.data.removeContact.username
                )
              )
            );
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

export default ContactItem;
