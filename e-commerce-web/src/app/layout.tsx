"use client";

import localFont from "next/font/local";
import "./globals.css";
import { Footer } from "@/components/Footer/Footer";
import { Navigation } from "@/components/Header/Navigtaion";
import { Context } from "@/components/Card";
import { useEffect, useState } from "react";

import Cookies from "js-cookie";
import { productItem } from "@/components/types";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const router = useRouter();
  const [like, setLike] = useState(false);
  const [uploadShoppingCart, setUpdateShoppingCart] = useState<productItem[]>(
    []
  );
  const [cookie, setCookie] = useState(false);

  useEffect(() => {
    if (Cookies.get("token")) {
      setCookie(true);
    } else {
      setCookie(false);
    }
  }, []);
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex flex-col min-h-screen">
          <Context.Provider
            value={{
              like,
              setLike,
              uploadShoppingCart,
              setUpdateShoppingCart,
              cookie,
              setCookie,
            }}
          >
            <Navigation />
            <div className="flex-1">{children}</div>
            <Footer />
          </Context.Provider>
        </div>
      </body>
    </html>
  );
}
