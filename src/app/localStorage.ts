import type { Quiz } from "@/types";

type SerializableQuizState = {
    quizzes: Quiz[];
    currentQuizId: string | null;
  };
  
  export const loadState = (): { quizList: SerializableQuizState } | undefined => {
    try {
      const serializedState = localStorage.getItem("quiz_app_state");
      if (serializedState === null) return undefined;
      return JSON.parse(serializedState);
    } catch (err) {
      return undefined;
    }
  };
  
  export const saveState = (state: { quizList: SerializableQuizState }) => {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem("quiz_app_state", serializedState);
    } catch (err) {
      
    }
  };
  