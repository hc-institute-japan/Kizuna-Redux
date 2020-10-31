import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
// import { createLogger } from "redux-logger";
import reducers from "./reducers";

export default createStore(
  reducers,
  {},
  compose(
    applyMiddleware(
      ...[
        thunk,
        // createLogger({
        //   predicate: () => process.env.NODE_ENV === "development",
        // }),
      ]
    )
  )
);
