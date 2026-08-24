"use client";

import "./Header.css";
import Image from "next/image";
import Link from "next/link";

import travelKarwadoLogo from "@/assets/images/travelKarwadoLogo.png";

import { BiSolidOffer } from "react-icons/bi";
import { MdAirplaneTicket, MdSupportAgent } from "react-icons/md";
import { IoMdLogIn, IoMdLogOut } from "react-icons/io";

import { useLoginModal } from "@/context/LoginModalContext";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
    const { open } = useLoginModal();
    const { loggedIn, logout } = useAuth();
    const handleLogout = async () => {
        await logout(); 
        window.location.href = "/"; 
    };

    return (
        <header className="header">
            <div className="header__left">
                <Link href="/" className="logo">
                    <Image
                        src={travelKarwadoLogo}
                        alt="Travel Karwado"
                        width={150}
                        height={60}
                        priority
                    />
                </Link>
            </div>

            <nav className="header__right">
                <Link href="/offers" className="headerLink">
                    <BiSolidOffer className="headIcon" />
                    <span>Offers</span>
                </Link>

                <Link href="/trips" className="headerLink">
                    <MdAirplaneTicket className="headIcon" />
                    <span>My Trips</span>
                </Link>

                <Link href="/support" className="headerLink">
                    <MdSupportAgent className="headIcon" />
                    <span>Support</span>
                </Link>

                {loggedIn ? (
                    <>
                        <Link href="/account" className="headerLink">
                            <IoMdLogIn className="headIcon" />
                            <span>My Account</span>
                        </Link>
                        <button className="loginBtn" onClick={handleLogout}>
                            <span>Logout</span>
                            <IoMdLogOut className="headIcon" />
                        </button>
                    </>
                    
                ) : (
                    <button className="loginBtn" onClick={open}>
                        <span>Login</span>
                        <IoMdLogIn className="headIcon" />
                    </button>
                )}
            </nav>
        </header>
    );
}