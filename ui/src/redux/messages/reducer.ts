import { LOG_MESSAGE } from "./actionTypes";
import { ActionType } from "../../utils/types";
import { getTimestamp } from "../../utils/helpers/";

const initialState = {
    messages: [{
        name: "Nicolas Alexander",
        contents: [{
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
        contents: [{
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
        contents: [{
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
            const name: string = action.message.name;
            const convExist = state.messages.some((currMsg) => currMsg.name === name);
            if (convExist) {
                state.messages.forEach((message) => {
                    if (message.name === name) message.contents.push(action.message.contents[0])
                })
            } else state.messages.push(action.message)
            return { ...state };
        default:
            return state;
    }
}