import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ROBOFIESTA - Modern Event Ticketing System",
  description: "Secure event ticketing and check-in system with QR codes for robotics events",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col bg-gray-50">
        {children}
      </body>
    </html>
  );
}
