import { configureStore } from "@reduxjs/toolkit";
import searchReducer from "../features/search/searchSlice";

export type RootState = ReturnType<typeof searchReducer>;

export const store = configureStore({
  reducer: {
    search: searchReducer,
  }
});

export type AppDispatch = typeof store.dispatch