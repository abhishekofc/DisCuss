import { createSlice } from "@reduxjs/toolkit";
import { connectSocket, disconnectSocket } from "../../../socket.js";

const initialState = {
  user: null,
  isLoggedin: false,
  onlineUsers: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setuser: (state, action) => {
      state.user = action.payload;
      state.isLoggedin = true;
      connectSocket({ userId: action.payload._id }); // ✅ Pass object
    },
    removeuser: (state) => {
      state.user = null;
      state.isLoggedin = false;
      state.onlineUsers = [];
      disconnectSocket();
    },
    setOnlineUsers: (state, action) => {
      console.log("🟢 Online users:", action.payload);
      
      state.onlineUsers = action.payload;
    },
  },
});

export const { setuser, removeuser, setOnlineUsers } = userSlice.actions;
export default userSlice.reducer;