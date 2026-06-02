import "./globals.css";

export const metadata = {
  title: "Blackstone Hotel | Scroll Animation Demo",
  description: "Scroll-based animation demo using custom sequential image frames.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
