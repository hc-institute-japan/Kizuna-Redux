import { LOG_MESSAGE } from "./actionTypes";
import { ActionType } from "../../utils/types";
import { getTimestamp } from "../../utils/helpers";

const initialState = {
    conversations: [{
        name: "Nicolas Alexander",
        messages: [{
            sender: "Nicolas Alexander",
            payload: "hey",
            createdAt: getTimestamp(), 
        }, {
            sender: "Tats",
            payload: "Yoyo!",
            createdAt: getTimestamp(), 
        }, {
            sender: "Nicolas Alexander",
            payload: "Long time!",
            createdAt: getTimestamp(), 
        }, {
            sender: "Tats",
            payload: "Wanna hang soon? I heard that this pandemic is a hoax and we don't have to live like a caveman anymore! jkjk",
            createdAt: getTimestamp(),
        }],
    }, {
        name: "Bob",
        messages: [{
            sender: "Bob",
            payload: "hey",
            createdAt: getTimestamp(), 
        }, {
            sender: "Tats",
            payload: "Yoyo!",
            createdAt: getTimestamp(), 
        }, {
            sender: "Bob",
            payload: "Long time!",
            createdAt: getTimestamp(), 
        }, {
            sender: "Tats",
            payload: "Wanna hang soon? I heard that this pandemic is a hoax and we don't have to live like a caveman anymore! jkjk",
            createdAt: getTimestamp(),
        }],
    },{
        name: "Charlie",
        messages: [{
            sender: "Charlie",
            payload: "hey",
            createdAt: getTimestamp(), 
        }, {
            sender: "Tats",
            payload: "Yoyo!",
            createdAt: getTimestamp(), 
        }, {
            sender: "Charlie",
            payload: "Long time!",
            createdAt: getTimestamp(), 
        }, {
            sender: "Tats",
            payload: "Wanna hang soon? I heard that this pandemic is a hoax and we don't have to live like a caveman anymore! jkjk",
            createdAt: getTimestamp(),
        }],
    },],
}

export default (state = initialState, action: ActionType) => {
    switch (action.type) {
        case LOG_MESSAGE:
            console.log(action.conversation);
            const name: string = action.conversation.name;
            const convExist = state.conversations.some((conversation) => conversation.name === name);
            if (convExist) {
                state.conversations.forEach((conversation) => {
                    if (conversation.name === name) conversation.messages.push(action.conversation.messages[0])
                })
            } else state.conversations.push(action.conversation)
            console.log(state);
            return { ...state };
        default:
            return state;
    }
}