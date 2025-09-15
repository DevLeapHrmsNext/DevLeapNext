import type { Metadata } from "next";
import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import BootstrapClient from "./components/BootstrapClient";
import localFont from "next/font/local";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';


import "./globals.css";
import { GlobalProvider } from "./contextProviders/loggedInGlobalContext";
import NotificationListener from "./components/PushNotificationListener";


const OutfitExtraBold = localFont({
  src: "./fonts/Outfit-ExtraBold.otf",//5
  variable: "--Outfit-ExtraBold",
  weight: "100 900",
});

const OutfitLight = localFont({
  src: "./fonts/Outfit-Light.otf",//4
  variable: "--Outfit-Light",
  weight: "100 900",
});
const OutfitMedium = localFont({
  src: "./fonts/Outfit-Medium.otf",//1
  variable: "--Outfit-Medium",
  weight: "100 900",
});
const OutfitRegular = localFont({
  src: "./fonts/Outfit-Regular.otf",//3
  variable: "--Outfit-Regular",
  weight: "100 900",
});
const OutfitSemiBold = localFont({
  src: "./fonts/Outfit-SemiBold.otf",//6
  variable: "--Outfit-SemiBold",
  weight: "100 900",
});
const OutfitThin= localFont({
  src: "./fonts/Outfit-Thin.otf",//2
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Leap HRMS",
  description: "Developed by Evonix",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
       className={`
        
        ${OutfitExtraBold.variable} 
        
        ${OutfitLight.variable} 
        ${OutfitMedium.variable} 
        ${OutfitRegular.variable} 
        ${OutfitSemiBold.variable} 
        ${OutfitThin.variable} 
        
        } antialiased`}

      >
           <GlobalProvider>
              <NotificationListener />
              {children}
          </GlobalProvider>
      </body>
    </html>
  );
}
