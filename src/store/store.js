// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import scraperReducer, { setStoreAPI } from "./slices/scraperSlice";
import sessionReducer from "./slices/sessionSlice";
import { typingMiddleware } from "../middleware/typingMiddleware";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage/session";

const persistConfig = {
  key: "root",
  storage, // 使用 Session Storage
};

const rootReducer = {
  scraper: persistReducer(persistConfig, scraperReducer),
  session: persistReducer(persistConfig, sessionReducer),
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"], // 忽略 persist 动作的序列化检查
      },
    }).concat(typingMiddleware),
});

setStoreAPI(store);

export const persistor = persistStore(store);
export default store;
