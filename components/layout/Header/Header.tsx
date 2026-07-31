import "./Header.css";
import Image from "next/image";
import Link from "next/link";

import travelKarwadoLogo from "@/assets/images/travelKarwadoLogo.png";

import { BiSolidOffer } from "react-icons/bi";
import { MdAirplaneTicket, MdSupportAgent } from "react-icons/md";
import { IoMdLogIn } from "react-icons/io";

export default function Header() {
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

                <button className="loginBtn">
                    <span>Login</span>
                    <IoMdLogIn className="headIcon" />
                </button>
            </nav>
        </header>
    );
}