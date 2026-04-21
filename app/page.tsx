import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Strada Garden",
  description: "Gehobene Küche im Herzen Wiens. Fine dining in the heart of Vienna.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}