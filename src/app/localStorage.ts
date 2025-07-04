// Example localStorage.ts
export interface PersistedState {
  term?: string;
  auth?: any; // Replace 'any' with your actual auth state type if available
}

export const loadState = (): Partial<PersistedState> | undefined => {
  try {
    const serializedState = localStorage.getItem("state");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const saveState = (state: Partial<PersistedState>) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("state", serializedState);
  } catch {
    // ignore write errors
  }
};