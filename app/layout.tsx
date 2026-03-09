import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Ensure you have a globals.css file in app/ or root

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Gyan Setu",
    description: "Student Hackathon Platform",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                {children}
            </body>
        </html>
    );
}