
import { configureStore } from "@reduxjs/toolkit";
import booking from "./slices/bookingSlice";
import loginModal from "./slices/loginModalSlice";
import auth from "./slices/authSlice";

export const makeStore = () =>
    configureStore({
        reducer: { booking, loginModal, auth },
    });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
