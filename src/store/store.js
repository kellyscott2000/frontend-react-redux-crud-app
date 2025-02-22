import { configureStore } from "@reduxjs/toolkit";
import postReducer from "../features/posts/postslice";

// redux store to manage global state

export const store = configureStore({
  reducer: {
    posts: postReducer,
  },
});

export default store;
