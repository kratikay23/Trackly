import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "User-Slice",
    initialState: {
        user: null,
        token: null
    },
    reducers: {
        setUser(state, action) {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        logout(state) {
            state.user = null;
            state.token = null;
        }
    }
});

export const { setUser, logout } = userSlice.actions;

export default userSlice.reducer;
