import "./Footer.css";
import Link from "next/link";
import {
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
    FaTwitter,
    FaYoutube,
} from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footerContainer">

                <div className="footerSection">
                    <h2 className="footerLogo">travelKarwado</h2>
                    <p className="footerText">
                        Book Flights, Hotels and Holiday Packages at the best prices.
                        Experience seamless travel with secure booking and 24×7 customer
                        support.
                    </p>

                    <div className="socialLinks">
                        <Link href="#">
                            <FaFacebookF />
                        </Link>

                        <Link href="#">
                            <FaInstagram />
                        </Link>

                        <Link href="#">
                            <FaTwitter />
                        </Link>

                        <Link href="#">
                            <FaLinkedinIn />
                        </Link>

                        <Link href="#">
                            <FaYoutube />
                        </Link>
                    </div>
                </div>

                <div className="footerSection">
                    <h3>Company</h3>

                    <Link href="/">About Us</Link>
                    <Link href="/">Careers</Link>
                    <Link href="/">Contact Us</Link>
                    <Link href="/">Blog</Link>
                </div>

                <div className="footerSection">
                    <h3>Support</h3>

                    <Link href="/">Help Center</Link>
                    <Link href="/">Cancellation</Link>
                    <Link href="/">Privacy Policy</Link>
                    <Link href="/">Terms & Conditions</Link>
                </div>

                <div className="footerSection">
                    <h3>Travel</h3>

                    <Link href="/">Flights</Link>
                    <Link href="/hotels">Hotels</Link>
                    <Link href="/">Holiday Packages</Link>
                    <Link href="/">Travel Insurance</Link>
                </div>

            </div>

            <div className="footerBottom">
                <p>
                    © {new Date().getFullYear()} travelKarwado.com. All Rights Reserved.
                </p>
            </div>
        </footer>
    );
}