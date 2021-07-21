import { Dispatch } from "redux";
import { USER_CREATED, USER_DELETED } from "@store/actions";
import { UserObject } from "./types";
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
