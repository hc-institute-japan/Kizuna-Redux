import { useHistory } from "react-router-dom";
import { IonAvatar, IonItem, IonLabel } from "@ionic/react";
import React from "react";
import { useMutation } from "@apollo/react-hooks";
import withToast, { ToastProps } from "../../../components/Toast/withToast";
import { Profile, Conversation } from "../../../utils/types";
import INITIALIZE_P2P_DNA from "../../../graphql/messages/mutations/initializeP2PDNAMutation";
import REQUEST_TO_CHAT from "../../../graphql/requests/mutations/requestToChatMutation";


interface Props extends ToastProps {
  contact: Profile;
  conversations: Array<Conversation>,
  myAddress: string,
}

const RecipientItem: React.FC<Props> = ({ contact, pushErr, conversations, myAddress }: Props) => {
  const history = useHistory();
  const [initializeP2PDNA] = useMutation(INITIALIZE_P2P_DNA);
  const [requestToChat] = useMutation(REQUEST_TO_CHAT);

  const doesConvExist = () => conversations.some(conversation => conversation.name === contact.username);

  return (
    <IonItem
      button
      onClick={async() => {
          if (doesConvExist()) {
            history.push(`/chat-room/${contact.username}`, {
              name: contact.username,
              recipientAddr: contact.id,
            })
          } else {
            try {
              const createP2PDNAResult = await initializeP2PDNA({
                variables : {
                  requirements: {
                    id: myAddress,
                    recipient: contact.id,
                  }
                }
              });
              // need else statement
              console.log(createP2PDNAResult.data.initializeP2PDNA);
              if (createP2PDNAResult.data.initializeP2PDNA) {
                console.log("working?");
                const requestResult = await requestToChat({
                  variables : {
                    sender: myAddress,
                    recipient: contact.id,
                  }
                });
                console.log(requestResult);
                const parsedResult = JSON.parse(requestResult?.data?.requestToChat);
                if (parsedResult.code === "request_pending" || parsedResult === "recipient_offline") history.push(`/chat-room/${contact.username}`, {
                  name: contact.username,
                  recipientAddr: contact.id,
                })
              }
            } catch (e) {
              // TODO: PushErr
            }
          }
        }
      }>
      <IonAvatar slot="start">
        <img
          src="https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y"
          alt=""
        />
      </IonAvatar>
      <IonLabel>{contact.username}</IonLabel>
    </IonItem>
  );
};

export default withToast(RecipientItem);
