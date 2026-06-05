import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
  user: null,
  authLoading: true,
  authChecked: false,
};

const userSlice = createSlice({
  name: "User-Slice",
  initialState: initialAuthState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.authLoading = false;
      state.authChecked = true;
    },
    updateUser(state, action) {
      if (!state.user) return;

      const updates = action.payload;
      const hasChange = Object.keys(updates).some(
        (key) => state.user[key] !== updates[key]
      );
      if (!hasChange) return;

      state.user = { ...state.user, ...updates };
    },
    signOut(state) {
      state.user = null;
      state.authLoading = false;
      state.authChecked = true;
    },
  },
});

export const { setUser, updateUser, signOut } = userSlice.actions;
export default userSlice.reducer;
