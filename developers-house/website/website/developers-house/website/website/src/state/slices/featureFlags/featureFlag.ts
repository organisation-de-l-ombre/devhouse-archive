import { createSlice } from "@reduxjs/toolkit";

export interface FeatureFlagState {
  featureFlags: { name: string; enabled: boolean }[];
}

export const featureFlagSlice = createSlice({
  name: "featureFlags",
  initialState: {
    featureFlags: [],
  } as FeatureFlagState,
  reducers: {},
});
