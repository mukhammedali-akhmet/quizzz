import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    name: "",
    username: "",
    email: "",
    photoURL: "",
    uid: ""
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        signInUser: (state, action) => {
            state.name = action.payload.name || "Guest";
            state.username = action.payload.username;
            state.email = action.payload.email;
            state.photoURL = action.payload.photoURL || "/profile.png";
            state.uid = action.payload.uid;
        },
        signOutUser: (state) => {
            state.name = "";
            state.username = "";
            state.email = "";
            state.photoURL = "";
            state.uid = "";
        },
    },
})

export const { signInUser, signOutUser } = userSlice.actions
export default userSlice.reducer