
import { useCallback, useEffect } from "react";
import apiClient from "@/utils/ApiClient";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setLoggedIn, logoutUser } from "@/store/slices/authSlice";

export function useAuth() {
    const dispatch = useAppDispatch();
    const loggedIn = useAppSelector((state) => state.auth.loggedIn);
    const ready = useAppSelector((state) => state.auth.ready);

    useEffect(() => {
        dispatch(setLoggedIn(apiClient.isLoggedIn()));
    }, [dispatch]);

    const logout = useCallback(async () => {
        await dispatch(logoutUser());
    }, [dispatch]);

    return { loggedIn, ready, logout };
}