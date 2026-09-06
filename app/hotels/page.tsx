"use client";

import Header from "@/components/layout/Header/Header";
import Navbar from "@/components/layout/Navbar/Navbar";
import Footer from "@/components/footer/Footer";


export default function HotelSearchLayout() {
    return (
        <>
            <Header />
            <Navbar products={"hotels"} />
            
            <Footer />
        </>

    );
}