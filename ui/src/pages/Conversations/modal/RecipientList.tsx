import { IonItemDivider, IonItemGroup, IonLabel } from "@ionic/react";
import React from "react";
import RecipientItem from "./RecipientItem";
import { Profile } from "../../../utils/types";

interface Props {
  search: string;
  indexedContacts: {
    [key: string]: Array<Profile> | [];
  };
  contacts: Array<Profile> | [];
  profile: Profile;
}

const RecipientList: React.FC<Props> = ({
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
            .filter((contact) =>
              contact.username.toLowerCase().includes(search.toLowerCase())
            )
            .map((contact) => (
              <RecipientItem key={contact.username} contact={contact} />
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
