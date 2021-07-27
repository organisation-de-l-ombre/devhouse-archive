import { ApplicationReducer } from "@store/types";
import { FEATURES_FLAGS_ADDED } from "./actions";
import { PropertiesState } from "./types";

const defaultPropertiesState: PropertiesState = {
  featuresFlags: [],
};

const InternalReducer: ApplicationReducer<"properties"> = (
  state = defaultPropertiesState,
  { payload, type }
) => {
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
