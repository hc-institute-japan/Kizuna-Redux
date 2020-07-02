import {
  IonFooter,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
  IonToolbar,
} from "@ionic/react";
import React from "react";
import ContactItem from "./ContactItem";
import EmptyContacts from "./EmptyContacts";

const ContactList: React.FC<any> = ({ indexedContacts, search, contacts }) => {
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
            .filter((contact: any) =>
              contact.username.toLowerCase().includes(search.toLowerCase())
            )
            .map((contact: any) => (
              <ContactItem
                contacts={contacts}
                key={contact.username}
                contact={contact}
              />
            ))}
        </IonItemGroup>
      ) : Object.keys(indexedContacts).length === 0 ? (
        <EmptyContacts />
      ) : (
        <>
          {Object.keys(indexedContacts).map((index) => {
            const contacts = indexedContacts[index];
            const el = (
              <IonItemGroup key={index}>
                <IonItemDivider>
                  <IonLabel>{index}</IonLabel>
                </IonItemDivider>
                {contacts.map((contact: any) => (
                  <ContactItem
                    contacts={contacts}
                    key={contact.username}
                    contact={contact}
                  />
                ))}
              </IonItemGroup>
            );

            return el;
          })}
          <IonFooter className="ion-no-border">
            <IonToolbar></IonToolbar>
          </IonFooter>
        </>
      )}
    </>
  );
};

export default ContactList;
