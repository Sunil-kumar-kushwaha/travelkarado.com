"use client";
import FlightSearch from "@/components/flight/FlightSearch/FlightSearch";
import BannerSlider from "@/components/flight/BannerSlider/BannerSlider";
import Header from "@/components/layout/Header/Header";
import Navbar from "@/components/layout/Navbar/Navbar";
import Footer from "@/components/footer/Footer";
import OffersCard from "@/components/flight/OffersCard/OffersCard";
import { bannerSlides, moreOffers } from "@/data/Flightpromodata";
import "./FlightSearchLayout.css";

export default function FlightSearchLayout() {
    return (
        <>
            <Header />
            <Navbar products={"flights"} />
            <div className="tk-layout">
                <div className="tk-layout-main">
                    <FlightSearch />
                </div>

                <div className="tk-layout-side">
                    <BannerSlider slides={bannerSlides} />
                    <OffersCard offers={moreOffers} onViewAll={() => console.log("view all offers")} />
                </div>
            </div>
            <Footer />
        </>

    );
}