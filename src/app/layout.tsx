import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigator } from "@/components/Global/Navigator";
const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Bridget's Diary",
  description: "See the diary from a cyropreserved brain. 57 years from now.",
};
import { UserProvider } from "@/components/Hooks/base";
import { NewProfileButton } from "@/components/Global/Profile";
import Visual from "@/components/Art/visual";
import DiaryBGMask from "@/components/Global/Mask/DiaryBGMask";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <>
          <Navigator />
          <NewProfileButton />
          <DiaryBGMask />
          <div className="w-screen h-screen fixed -z-10">
            <Visual />
            {/* <Overlay /> */}
          </div>
        </>
        {children}
      </body>
    </html>
  );
}
