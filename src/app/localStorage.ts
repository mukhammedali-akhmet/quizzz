export function loadState<T>(): T | undefined {
  try {
    const serializedState = localStorage.getItem("app_state");
    if (!serializedState) return undefined;
    return JSON.parse(serializedState) as T;
  } catch (error) {
    console.warn("Could not load state:", error);
    return undefined;
  }
}

export function saveState<T>(state: T): void {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("app_state", serializedState);
  } catch (error) {
    console.warn("Could not save state:", error);
  }
}
