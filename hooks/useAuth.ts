"use client";


import { useEffect, useState, useCallback } from "react";
import apiClient from "@/utils/ApiClient";

export function useAuth() {
    
    const [loggedIn, setLoggedIn] = useState(false);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        setLoggedIn(apiClient.isLoggedIn());
        setReady(true);
    }, []);

    const logout = useCallback(async () => {
        await apiClient.logout();
        setLoggedIn(false);
    }, []);

    return { loggedIn, ready, logout };
}