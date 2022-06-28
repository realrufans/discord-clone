import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  serverName: null,
  serverId: null,
};

export const serverSlice = createSlice({
  name: "server",
  initialState,
  reducers: {
    setServerInfo: (state, actions) => {
      state.serverName = actions.payload.serverName;
      state.serverId = actions.payload.serverId;
    },
  },
});

export const { setServerInfo } = serverSlice.actions;

// selectors for modification
export const selectServerName = (state) => state.server.serverName;
export const selectServerId = (state) => state.server.serverId;

export default serverSlice.reducer;
