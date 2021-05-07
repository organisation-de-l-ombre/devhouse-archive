import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { randomBytes } from "crypto";

export type Notification = {
  level: "warning" | "error" | "information";
  text: string;
  icon?: string;
  buttons?: { click: () => boolean; text: string }[];
  time: number;
  id: string;
};

interface NotificationsState {
  notifications: Notification[];
  enable: boolean;
}

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState: {
    enable: true,
    notifications: [],
  } as NotificationsState,
  reducers: {
    addNotification(
      state,
      { payload }: PayloadAction<Omit<Notification, "id">>
    ) {
      state.notifications.push({
        ...payload,
        id: randomBytes(32).toString("hex"),
      });
    },
    removeNotification(state, { payload }: PayloadAction<string>) {
      state.notifications = state.notifications.filter((n) => n.id !== payload);
    },
    setEnabled(state, { payload }: PayloadAction<boolean>) {
      state.enable = payload;
    },
  },
});

export const {
  removeNotification,
  addNotification,
  setEnabled,
} = notificationsSlice.actions;
