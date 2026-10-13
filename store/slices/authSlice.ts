

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import apiClient from "@/utils/ApiClient";

interface AuthState {
    loggedIn: boolean;
    ready: boolean; 
}

const initialState: AuthState = { loggedIn: false, ready: false };


export const logoutUser = createAsyncThunk("auth/logout", async () => {
    await apiClient.logout();
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setLoggedIn(state, action: PayloadAction<boolean>) {
            state.loggedIn = action.payload;
            state.ready = true;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(logoutUser.fulfilled, (state) => {
            state.loggedIn = false;
        });
    },
});

export const { setLoggedIn } = authSlice.actions;
export default authSlice.reducer;