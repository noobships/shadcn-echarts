import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "shadcn-echarts",
  description:
    "Apache ECharts components styled for shadcn/ui with npm + shadcn registry distribution.",
};

const navItems = [
  { href: "/", label: "Home" },
  { href: "/install", label: "Install" },
  { href: "/theming", label: "Theming" },
  { href: "/components", label: "Components" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="container header-inner">
            <Link href="/" className="brand">
              shadcn-echarts
            </Link>
            <nav className="nav">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="nav-link">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="container content">{children}</main>
      </body>
    </html>
  );
}
