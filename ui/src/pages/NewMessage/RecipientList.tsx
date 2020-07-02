import { IonItemDivider, IonItemGroup, IonLabel } from "@ionic/react";
import React from "react";
import RecipientItem from "./RecipientItem";

const RecipientList: React.FC<any> = ({
  indexedContacts,
  search,
  contacts,
  profile,
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
            .filter((contact: any) =>
              contact.username.toLowerCase().includes(search.toLowerCase())
            )
            .map((contact: any) => (
              <RecipientItem key={contact.username} contact={contact} />
            ))}
        </IonItemGroup>
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
                  <RecipientItem key={contact.username} contact={contact} />
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
