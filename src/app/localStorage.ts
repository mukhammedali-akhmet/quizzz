import type { Quiz } from "@/types"; // Ensure "@/types" contains a valid Quiz type definition
import type { User } from "firebase/auth";

type SerializableQuizState = {
    quizzes: Quiz[];
    currentQuizId: string | null;
  };
  
  // Загрузка
  export const loadState = (): { quizList: SerializableQuizState } | undefined => {
    try {
      const serializedState = localStorage.getItem("quiz_app_state");
      if (serializedState === null) return undefined;
      return JSON.parse(serializedState);
    } catch (err) {
      return undefined;
    }
  };
  
  // Сохранение
  export const saveState = (state: { quizList: SerializableQuizState }) => {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem("quiz_app_state", serializedState);
    } catch (err) {
      // ignore
    }
  };
  