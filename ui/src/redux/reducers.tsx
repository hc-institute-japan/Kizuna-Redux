import { combineReducers } from "redux";

export default combineReducers({
  test: (state = {}, action) => {
    switch (action.type) {
      default:
        return state;
    }
  }
});
