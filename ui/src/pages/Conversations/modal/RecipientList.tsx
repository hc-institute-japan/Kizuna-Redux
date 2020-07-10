import { IonItemDivider, IonItemGroup, IonLabel } from "@ionic/react";
import React from "react";
import RecipientItem from "./RecipientItem";
import { Profile, Conversation } from "../../../utils/types";

interface Props {
  search: string;
  indexedContacts: {
    [key: string]: Array<Profile> | [];
  };
  conversations: Array<Conversation>,
  myAddress: string,
}

const RecipientList: React.FC<Props> = ({
  indexedContacts,
  search,
  conversations,
  myAddress,
}) => {
  const searchContacts =
    search.length > 0 ? indexedContacts[search.charAt(0).toUpperCase()] : null;

  return (
    <>
      {searchContacts ? (
        <IonItemGroup>
          <IonItemDivider>
            <IonLabel>{search.charAt(0).toUpperCase()}</IonLabel>
          </IonItemDivider>
          {searchContacts
            .filter((contact) =>
              contact.username.toLowerCase().includes(search.toLowerCase())
            )
            .map((contact) => (
              <RecipientItem key={contact.username} contact={contact} conversations={conversations} myAddress={myAddress}  />
            ))}
        </IonItemGroup>
      ) : (
        <>
          {Object.keys(indexedContacts).map((index) => {
            const contacts: Array<Profile> = indexedContacts[index];
            const el = (
              <IonItemGroup key={index}>
                <IonItemDivider>
                  <IonLabel>{index}</IonLabel>
                </IonItemDivider>
                {contacts.map((contact) => (
                  <RecipientItem key={contact.username} contact={contact} conversations={conversations} myAddress={myAddress} />
                ))}
              </IonItemGroup>
            );

            return el;
          })}
        </>
      )}
    </>
  );
};

export default RecipientList;
