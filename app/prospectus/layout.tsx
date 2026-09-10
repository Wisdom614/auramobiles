import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Commercial Prospectus // Turnkey E-Commerce Platform Acquisition",
  description:
    "Confidential commercial asset specification and platform acquisition prospectus for AURA Luxe Mobile.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function ProspectusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
