import {
  CLIENT_UPDATED,
  FEATURES_FLAGS_ADDED,
  InternalPayload,
  InternalState,
} from "./types";

const internalState: InternalState = {
  clientID: "",
  featuresFlags: [],
};

const InternalReducer = (
  state: InternalState = internalState,
  { type, payload }: InternalPayload
): InternalState => {
  switch (type) {
    case CLIENT_UPDATED:
      return { ...state, clientID: payload as string };

    case FEATURES_FLAGS_ADDED:
      return {
        ...state,
        featuresFlags: [...state.featuresFlags, ...(payload as string[])],
      };

    default:
      return state;
  }
};

export { internalState, InternalReducer };
