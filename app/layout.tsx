"use client"
import "./globals.css";
import { Montserrat } from "next/font/google";
import Language from "./context";
import { Provider } from "react-redux";
import { store } from './api/store'
import Token from "./tokenContext";
import Script from "next/script";

const montserrat = Montserrat({
  subsets: ['vietnamese'],
  weight: ['400', '700'], 
  display: 'swap',
});

// console.log = () => {};
// console.info = () => {};
// console.warn = () => {};
// console.error=()=>{};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-7DW0J4FYE5"
          strategy="afterInteractive"
          ></Script>
        <Script id="google-analytics" strategy="afterInteractive">
          {
            `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-7DW0J4FYE5');
            `
          }
             
        </Script>
      </head>
      <body 
        className={`${montserrat.className}`}
      >
        <Provider store={store}>
          <Token>
            <Language>
                {children}              
            </Language>
          </Token>
        </Provider>
      </body>
    </html>
  );
}
