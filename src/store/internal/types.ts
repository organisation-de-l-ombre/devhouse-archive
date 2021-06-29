interface InternalState {
  clientID: string;
  featuresFlags: string[];
}

interface InternalPayload {
  type: string;
  payload: string | string[];
}

const CLIENT_UPDATED = "internal/clientUpdated";
const FEATURES_FLAGS_ADDED = "internal/featuresFlagsAdded";

export { InternalState, InternalPayload, CLIENT_UPDATED, FEATURES_FLAGS_ADDED };
