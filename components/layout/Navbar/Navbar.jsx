"use client";

import "./Navbar.css";
import Link from "next/link";
import { useState } from "react";

import { MdFlight } from "react-icons/md";
import { FaHotel } from "react-icons/fa";
import { FaUmbrellaBeach } from "react-icons/fa6";

export default function Navbar({products}) {
    const [activeItem, setActiveItem] = useState(products);

    return (
        <nav className="navbar">
            <Link
                href="/flights"
                className={`navItem ${activeItem === "flights" ? "active" : ""}`}
                onClick={() => setActiveItem("flights")}
            >
                <MdFlight className="navIcon" />
                <span>Flights</span>
            </Link>

            <Link
                href="hotels"
                className={`navItem ${activeItem === "hotels" ? "active" : ""}`}
                onClick={() => setActiveItem("hotels")}
            >
                <FaHotel className="navIcon" />
                <span>Hotels</span>
            </Link>

            <Link
                href="#"
                className={`navItem ${activeItem === "holidays" ? "active" : ""}`}
                onClick={() => setActiveItem("holidays")}
            >
                <FaUmbrellaBeach className="navIcon" />
                <span>Holidays</span>
            </Link>
        </nav>
    );
}