"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header/Header";
import Footer from "@/components/footer/Footer";
import { useAuth } from "@/hooks/useAuth";
import "./accounts.css";

export default function AccountsLayout({ children }: { children: React.ReactNode }) {
    const { loggedIn, ready } = useAuth();
    const router = useRouter();

    // `ready` flips to true once the cookie has been checked on the client
    useEffect(() => {
        if (ready && !loggedIn) router.replace("/");
    }, [ready, loggedIn, router]);

    return (
        <div className="accounts">
            <Header />
            <main className="accounts__main">{ready && loggedIn ? children : null}</main>
            <Footer />
        </div>
    );
}