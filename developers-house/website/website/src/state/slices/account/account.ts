import { SelfUser } from "@developers-house/abdera";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  user?: SelfUser & { token: string };
  state: "loading" | "available" | "failed";
  client_id?: string;
}

export const accountSlice = createSlice({
  name: "account",
  initialState: {
    state: "loading",
  } as UserState,
  reducers: {
    setState(state, { payload }: PayloadAction<UserState["state"]>) {
      state.state = payload;
    },
    setClientId(state, { payload }: PayloadAction<string>) {
      state.client_id = payload;
    },
    setUser(state, { payload }: PayloadAction<UserState["user"] | undefined>) {
      state.user = payload;
    },
  },
});

export const { setClientId, setState, setUser } = accountSlice.actions;
