import {
  IonButton,
  IonButtons,
  IonHeader,
  IonIcon,
  IonToolbar,
} from "@ionic/react";
import { close, pencilOutline, trash } from "ionicons/icons";
import React, { RefObject } from "react";
import { ListRef } from "../../components/List";
import { Message, Conversation } from "../../utils/types";
import { useMutation } from "@apollo/react-hooks";
import DELETE_MESSAGES from "../../graphql/messages/mutations/deleteMessages";
import { useDispatch } from "react-redux";
import { deleteMessages } from "../../redux/conversations/actions";

interface Prop {
  list: RefObject<ListRef>;
  items: { [id: string]: Message };
  instanceId: string;
  me: string;
  edit(item: Message): void;
  conversation: Conversation;
}

const ChatMultiselectHeader: React.FC<Prop> = ({
  list,
  items,
  instanceId,
  edit,
  conversation,
  me,
}) => {
  const arr = Object.values(items);
  const [del] = useMutation(DELETE_MESSAGES);
  const dispatch = useDispatch();

  const onDelete = () => {
    console.log(arr.map((message) => message.address));
    del({
      variables: {
        instanceId,
        addresses: arr.map((message) => message.address),
      },
    });
    dispatch(deleteMessages(arr, conversation));
    list.current?.close();
  };

  return (
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonButton onClick={list.current?.close}>
            <IonIcon icon={close}></IonIcon>
          </IonButton>
        </IonButtons>
        {arr.length > 0 ? (
          <IonButtons slot="end">
            {arr.length > 1 && arr[0].sender === me ? null : (
              <IonButton onClick={() => edit(arr[0])}>
                <IonIcon icon={pencilOutline}></IonIcon>
              </IonButton>
            )}
            <IonButton onClick={onDelete}>
              <IonIcon icon={trash}></IonIcon>
            </IonButton>
          </IonButtons>
        ) : null}
      </IonToolbar>
    </IonHeader>
  );
};

export default ChatMultiselectHeader;
