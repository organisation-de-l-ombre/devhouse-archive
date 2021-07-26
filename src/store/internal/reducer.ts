import { FEATURES_FLAGS_ADDED } from "@store/actions";
import { InternalPayload, InternalState } from "./types";

const internalState: InternalState = {
  featuresFlags: [],
};

const InternalReducer = (
  state: InternalState = internalState,
  { type, payload }: InternalPayload
): InternalState => {
  switch (type) {
    case FEATURES_FLAGS_ADDED:
      return {
        ...state,
        featuresFlags: [...state.featuresFlags, ...(payload as string[])],
      };

    default:
      return state;
  }
};

export default InternalReducer;
