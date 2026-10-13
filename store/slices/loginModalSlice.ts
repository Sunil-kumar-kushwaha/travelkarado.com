

import { createSlice } from "@reduxjs/toolkit";

const loginModalSlice = createSlice({
    name: "loginModal",
    initialState: { isOpen: false },
    reducers: {
        openLoginModal(state) {
            state.isOpen = true;
        },
        closeLoginModal(state) {
            state.isOpen = false;
        },
    },
});

export const { openLoginModal, closeLoginModal } = loginModalSlice.actions;
export default loginModalSlice.reducer;