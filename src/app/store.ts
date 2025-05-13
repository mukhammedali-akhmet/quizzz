import { configureStore } from "@reduxjs/toolkit";
import quizListReducer from "../features/quizList/quizListSlice";
import modalReducer from "../features/modal/modalSlice";
import searchReducer from "../features/search/searchSlice";
import userReducer from "../features/user/userSlice";
// import { loadState, saveState } from "./localStorage";

// const persistedState = loadState();

export const store = configureStore({
  reducer: {
    quizList: quizListReducer,
    modal: modalReducer,
    search: searchReducer,
    user: userReducer,
  },
  // preloadedState: persistedState,
});

// store.subscribe(() => {
//     const state = store.getState();
  
//     if (state.quizList) {
//       saveState({
//         quizList: {
//           quizzes: state.quizList.quizzes,
//           currentQuizId: state.quizList.currentQuizId
//         }
//       });
//     }
//   });

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch