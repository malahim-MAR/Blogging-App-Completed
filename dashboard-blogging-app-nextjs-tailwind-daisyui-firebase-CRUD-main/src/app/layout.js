import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "./Components/ClientLayout";

// Configure Poppins font
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: 'swap',
});

// Configure Inter font
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: 'swap',
});

export const metadata = {
  title: "BlogAdmin Pro",
  description: "Content Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <body className="font-sans antialiased bg-gray-900 text-gray-100">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}