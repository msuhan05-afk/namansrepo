import { ChiefOfStaff } from "@/components/ChiefOfStaff";
import { PageTransition } from "@/components/PageTransition";
import { Sidebar } from "@/components/Sidebar";
import { VoiceOrb } from "@/components/VoiceOrb";
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Naman S PA — Chief of Staff",
  description:
    "A premium AI-powered personal assistance system. Your executive chief of staff for email, calendar, projects, opportunities and people.",
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans">
        <div className="aurora" />
        <div className="flex h-screen w-screen overflow-hidden">
          <Sidebar />
          <main className="scroll-area flex-1 overflow-y-auto px-2 py-4">
            <PageTransition>{children}</PageTransition>
          </main>
          <ChiefOfStaff />
        </div>
        <VoiceOrb />
      </body>
    </html>
  );
}
