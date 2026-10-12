import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LoginModalProvider } from "@/context/LoginModalContext";
import { BookingProvider } from "@/context/BookingContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Flight & Hotel Booking App",
  description: "Get Best Flight and Hotels Deals Here",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LoginModalProvider>
          <BookingProvider>{children}</BookingProvider>
        </LoginModalProvider>
      </body>
    </html>
  );
}