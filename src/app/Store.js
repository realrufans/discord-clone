import { configureStore } from "@reduxjs/toolkit";
import channelReducer from "../features/ChannelSlice";
import ServerSlice from "../features/ServerSlice";

export const store = configureStore({
  reducer: {
    channel: channelReducer,
    server: ServerSlice,
  },
});
