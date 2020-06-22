import { LOG_MESSAGE } from "./actionTypes";
import { ActionType } from "../types";

const initialState = {
    messages: [{
        author: "Alice",
        contents: [{
            sender: "Alice",
            payload: "hey",
            timestamp: 1, 
        }, {
            sender: "Tats",
            payload: "Yoyo!",
            timestamp: 2, 
        }, {
            sender: "Alice",
            payload: "Long time!",
            timestamp: 3, 
        }, {
            sender: "Tats",
            payload: "Wanna hang soon? I heard that this pandemic is a hoax and we don't have to live like a caveman anymore! jkjk",
            timestamp: 4,
        }],
    }],
}

export default (state = initialState, action: ActionType) => {
    switch (action.type) {
        case LOG_MESSAGE:
            const author: string = action.message.author;
            const convExist = state.messages.some((currMsg) => currMsg.author === author);
            if (convExist) {
                state.messages.forEach((message) => {
                    if (message.author === author) message.contents.push(action.message.contents[0])
                })
            } else state.messages.push(action.message)
            return { ...state };
        default:
            return state;
    }
}