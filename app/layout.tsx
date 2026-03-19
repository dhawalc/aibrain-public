import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SITE_URL } from '@/lib/site'

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'QorSync AI',
  url: 'https://qorsync.online',
  description: 'Autonomous enterprise operations platform',
  publisher: {
    '@type': 'Organization',
    name: 'Accel4',
    brand: { '@type': 'Brand', name: 'QorSync AI' },
  },
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'QorSync AI',
    template: '%s | QorSync AI',
  },
  description: 'QorSync AI public site and blog. An Accel4 product.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {gaMeasurementId ? (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}></script>
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaMeasurementId}');`,
              }}
            />
          </>
        ) : null}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
