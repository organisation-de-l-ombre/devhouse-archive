import { Dispatch } from "redux";
import { UserObject, USER_CREATED, USER_DELETED } from "./types";
import { Action } from "../types";

const createUser = (payload: UserObject): Action => {
  return (dispatch: Dispatch): void => {
    dispatch({ type: USER_CREATED, payload });
  };
};
const deleteUser = (): Action => {
  return (dispatch: Dispatch): void => {
    dispatch({ type: USER_DELETED, payload: undefined });
  };
};

export { createUser, deleteUser };
