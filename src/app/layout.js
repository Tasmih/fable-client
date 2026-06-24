const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
import { Geist, Geist_Mono } from "next/font/google";
import Footer from "@/components/Footer";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import ConditionalNavbar from "@/components/ConditionalNavbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default:"Fable |Discover & Read Original Ebooks",
    template:"%s|Fable",
  },
  description: "A digital platform that connects ebook lovers, readers, and collectors with talented writers.",

};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ConditionalNavbar/>
        <main className="flex-grow">{children}</main>
        <Footer></Footer>

         <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </body>
      
    </html>
  );
}
