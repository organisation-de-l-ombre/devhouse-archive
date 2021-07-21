interface InternalState {
  clientID: string;
  featuresFlags: string[];
}

interface InternalPayload {
  type: string;
  payload: string | string[];
}

export { InternalState, InternalPayload };
