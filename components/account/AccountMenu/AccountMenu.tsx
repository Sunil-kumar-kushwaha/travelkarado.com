"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiUser, FiCreditCard, FiUsers, FiAward, FiSettings, FiShield, FiLogOut, FiChevronDown } from "react-icons/fi";
import { MdAirplaneTicket, MdOutlineAccountBalanceWallet } from "react-icons/md";
import { getCookie } from "@/utils/ApiClient";
import { ACCOUNT_MENU_ITEMS } from "../accountMenuItems";
import "./AccountMenu.css";

const ICONS: Record<string, React.ReactNode> = {
    "My Profile": <FiUser />,
    "My Trips": <MdAirplaneTicket />,
    "Saved Cards": <FiCreditCard />,
    "Saved Travellers": <FiUsers />,
    "Hi-Five": <FiAward />,
    Wallet: <MdOutlineAccountBalanceWallet />,
    Settings: <FiSettings />,
    "Privacy Rights": <FiShield />,
};

interface AccountMenuProps {
    onLogout: () => void | Promise<void>;
}

export default function AccountMenu({ onLogout }: AccountMenuProps) {
    const [open, setOpen] = useState(false);
    const [phone, setPhone] = useState("");
    const rootRef = useRef<HTMLDivElement>(null);
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pathname = usePathname();

    // cookie is read after mount to avoid a hydration mismatch
    useEffect(() => {
        setPhone(getCookie("userPhone") || "");
    }, [open]);

    useEffect(() => setOpen(false), [pathname]);

    useEffect(() => {
        if (!open) return;
        const onDown = (e: MouseEvent) => {
            if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
        };
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        document.addEventListener("mousedown", onDown);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDown);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    const cancelClose = () => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
    };
    const hoverOpen = useCallback(() => {
        cancelClose();
        setOpen(true);
    }, []);
    // small delay so moving the cursor from button -> panel doesn't close it
    const hoverClose = useCallback(() => {
        cancelClose();
        closeTimer.current = setTimeout(() => setOpen(false), 150);
    }, []);

    return (
        <div className="accountMenu" ref={rootRef} onMouseEnter={hoverOpen} onMouseLeave={hoverClose}>
            <button
                type="button"
                className={`accountMenu__trigger ${open ? "accountMenu__trigger--open" : ""}`}
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={() => setOpen((o) => !o)}
            >
                <FiUser className="accountMenu__triggerIcon" />
                <span>My Account</span>
                <FiChevronDown className={`accountMenu__chevron ${open ? "accountMenu__chevron--up" : ""}`} />
            </button>

            {open && (
                <div className="accountMenu__panel" role="menu">
                    <div className="accountMenu__head">
                        <p className="accountMenu__headLabel">You are logged in with</p>
                        <p className="accountMenu__headValue">{phone || "your account"}</p>
                    </div>

                    <ul className="accountMenu__list">
                        {ACCOUNT_MENU_ITEMS.map((item) => (
                            <li key={item.href}>
                                <Link href={item.href} className="accountMenu__item" role="menuitem">
                                    <span className="accountMenu__itemIcon">{ICONS[item.label]}</span>
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="accountMenu__footer">
                        <button type="button" className="accountMenu__item accountMenu__logout" onClick={onLogout} role="menuitem">
                            <span className="accountMenu__itemIcon"><FiLogOut /></span>
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}