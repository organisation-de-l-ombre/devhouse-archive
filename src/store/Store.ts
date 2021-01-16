import { compose, combineReducers, createStore, applyMiddleware } from "redux";
import reduxThunk from "redux-thunk";
import UserReducer from "./user/Reducer";

const composeEnhancers =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const reducer = combineReducers({ user: UserReducer });

export default createStore(
  reducer,
  composeEnhancers(applyMiddleware(reduxThunk))
);
