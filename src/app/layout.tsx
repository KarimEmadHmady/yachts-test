import type { Metadata } from "next";
import { Cinzel } from "next/font/google";
import "./globals.css";
import ScrollToTop from "@/components/common/to-top/Scrolltotop";
import ScrollReveal from "@/components/animations/ScrollReveal";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Blue Horizon",
  description:
    "Blue Horizon Marine Concepts provides premium marine solutions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${cinzel.variable} antialiased`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'dark';
                  document.documentElement.classList.toggle(
                    'dark',
                    theme === 'dark'
                  );
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        {children}
        <ScrollToTop />
        <ScrollReveal />
      </body>
    </html>
  );
}