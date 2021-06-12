import { Action } from "@store/types";
import { Dispatch } from "redux";
import { CLIENT_UPDATED, FEATURES_FLAGS_ADDED } from "./types";

const updateClient = (id: string): Action => {
  return (dispatch: Dispatch): void => {
    dispatch({ type: CLIENT_UPDATED, payload: id });
  };
};

const addFeatureFlags = (flags: string[]): Action => {
  return (dispatch: Dispatch): void => {
    dispatch({ type: FEATURES_FLAGS_ADDED, payload: flags });
  };
};

export { updateClient, addFeatureFlags };
