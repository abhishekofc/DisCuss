import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";



export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ userId, text, file }, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      // console.log(text);
      
      if (!token) {
        console.error("🚨 No token found! User may not be authenticated.");
        return rejectWithValue("Unauthorized: No token found");
      }

      const formData = new FormData();
      formData.append("text", text);
      if (file) {
        formData.append("file", file); // Attach file if exists
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/message/send/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return { userId, message: response.data.message };
    } catch (error) {
      console.error("🚨 Error sending message:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || "Failed to send message");
    }
  }
);


// Get users for sidebar
export const getUsers = createAsyncThunk("chat/getUsers", async (_, { rejectWithValue })=> {
  try {
    const token = sessionStorage.getItem("token"); 
    // console.log("Token from localStorage:", token); // ✅ Check if token is present

    if (!token) {
      console.error("🚨 No token found! User may not be authenticated.");
      return rejectWithValue("Unauthorized: No token found");
    }

    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/message/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // console.log("Users API Response:", response.data); // ✅ Log API response

    return Array.isArray(response.data.users) ? response.data.users : [];
  } catch (error) {
    console.error("🚨 Error fetching users:", error.response?.data || error.message);
    return rejectWithValue(error.response?.data?.message || "Failed to fetch users");
  }
});


// Get messages for a specific user
export const getMessages = createAsyncThunk("chat/getMessages", async (userId, { rejectWithValue }) => {
  try {
    const token = sessionStorage.getItem("token"); 
    if (!token) {
      console.error("🚨 No token found! User may not be authenticated.");
      return rejectWithValue("Unauthorized: No token found");
    }    
    
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/message/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return { userId, messages: response.data.messages };
  } catch (error) {
    console.log(
    "🚨 Error fetching messages for user:", error.response?.data || error.message
    );
    
    return rejectWithValue(error.response?.data?.message || "Failed to fetch messages");
  }
});

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    users: [],
    messages: {}, // Messages stored by userId
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isMessageSending: false,
    error: null,
  },
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    addMessage: (state, action) => {
      const { userId, message } = action.payload;
      if (!state.messages[userId]) state.messages[userId] = [];
      state.messages[userId].push(message);
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Users
      .addCase(getUsers.pending, (state) => {
        state.isUsersLoading = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isUsersLoading = false;
        state.users = action.payload; // Ensure it holds correct user list
      })
      
      
      .addCase(getUsers.rejected, (state, action) => {
        state.isUsersLoading = false;
        console.log("error");
        
        state.error = action.payload;
      })
      
      
      // Get Messages
      .addCase(getMessages.pending, (state) => {
        state.isMessagesLoading = true;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.isMessagesLoading = false;
        const { userId, messages } = action.payload;
    
        if (!userId || !messages) {
            console.error("🚨 Error: userId or messages missing in API response!");
            return;
        }
    
        // ✅ Ensure messages belong to the correct user
        state.messages[userId] = messages;
    })    
      
      
      .addCase(getMessages.rejected, (state, action) => {
        state.isMessagesLoading = false;
        console.log("erroe");
        state.error = action.payload;
      })

      //send message
      .addCase(sendMessage.pending, (state) => {
        state.isMessageSending = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isMessageSending = false;
        const { userId, message } = action.payload;
    
        if (!userId || !message) {
            console.error("🚨 Missing userId or message in response!", action.payload);
            return;
        }
    
        if (!Array.isArray(state.messages[userId])) {
            state.messages[userId] = [];
        }
    
        // ✅ Ensure message isn't duplicated
        const exists = state.messages[userId].some((msg) => msg._id === message._id);
        if (!exists) {
            state.messages[userId].push(message);
        }
    })
            
      
      .addCase(sendMessage.rejected, (state, action) => {
        state.isMessageSending = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedUser, addMessage  } = chatSlice.actions;
export default chatSlice.reducer;
