import { ApplicationAction } from "@store/types";

export const FEATURES_FLAGS_ADDED = "properties/featuresFlagsAdded";

const addFeatureFlags: ApplicationAction<
  "properties/featuresFlagsAdded",
  [string[]]
> = (flags: string[]) => {
  return { type: FEATURES_FLAGS_ADDED, payload: flags };
};

export { addFeatureFlags };
export interface PropertiesActionTypes {
  [FEATURES_FLAGS_ADDED]: string[];
}
