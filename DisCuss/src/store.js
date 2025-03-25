import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./redux/user/user.slice";
import chatReducer from "./redux/chat/chat.slice";  // Import chat slice
import sessionStorage from "redux-persist/lib/storage/session";
import { persistReducer, persistStore } from "redux-persist";

const rootReducer = combineReducers({
  user: userReducer,
  chat: chatReducer, // Add chat reducer
});

const persistConfig = {
  key: "root",
  storage: sessionStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
