import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigator } from "@/components/Global/Navigator";
const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Bridget's Diary",
  description: "See the diary from a cyropreserved brain. 57 years from now.",
};
import { NewProfileButton } from "@/components/Global/Profile";
import Visual from "@/components/3D/visual";
import DiaryBGMask from "@/components/Global/Mask/DiaryBGMask";
import { BackgroundMask } from "@/components/Conversation/Presentation/Misc/BackgroundMask";
import { UserIDSetter } from "@/components/Global/Misc";

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
          {/* <BackgroundMask /> */}
          <div className="w-screen h-screen fixed -z-10">
            <Visual />
            {/* <Overlay /> */}
          </div>
          <UserIDSetter />
        </>
        {children}
      </body>
    </html>
  );
}
