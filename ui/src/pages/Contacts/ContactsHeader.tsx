import { IonHeader } from "@ionic/react";
import React, { useState } from "react";
import Default from "./header/Default";
import Searching from "./header/Searching";

interface Props {
  setSearch(value: string): void;
  search: string;
}
const ContactsHeader: React.FC<Props> = ({ search, setSearch }) => {
  const [state, setState] = useState(0);
  return (
    <IonHeader>
      {state === 0 ? (
        <Default showSearch={() => setState(1)} />
      ) : (
        <Searching
          search={search}
          setSearch={setSearch}
          hideSearch={() => setState(0)}
        />
      )}
    </IonHeader>
  );
};

export default ContactsHeader;
