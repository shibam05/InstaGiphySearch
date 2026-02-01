import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/shared/Header";
import { UserProvider } from "@/lib/store";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "InstaGif - Vibe Your GIFs",
    description: "A minimal, beautiful space to find and share GIFs.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body className={cn(inter.className, "antialiased bg-background min-h-screen pb-10")}>
                <UserProvider>
                    <Header />
                    <main className="pt-24 min-h-screen">
                        {children}
                    </main>
                </UserProvider>
            </body>
        </html>
    );
}
