import type { Metadata } from "next";
import "./globals.css";
import { publicAsset } from "./base-path";

export const metadata: Metadata = {
  title: "BrAIn | AI-Based Morphology Analysis Tool for Organoids",
  description:
    "BrAIn is a device-local AI-based morphology analysis tool for organoid classification, segmentation, measurement and neural-rosette detection.",
  icons: {
    icon: publicAsset("/favicon.svg"),
    shortcut: publicAsset("/favicon.svg"),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
