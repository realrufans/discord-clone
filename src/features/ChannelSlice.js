import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  channelId: null,
  channelName: null,
};

export const channelSlice = createSlice({
  name: "channel",
  initialState,
  reducers: {
    setChannelInfo: (state, actions) => {
      state.channelId = actions.payload.channelId;
      state.channelName = actions.payload.channelName;
    },
  },
});

export const { setChannelInfo } = channelSlice.actions;

export const selectChannelId = (state) => state.channel.channelId;
export const selectChannelName = (state) => state.channel.channelName;

export default channelSlice.reducer;
