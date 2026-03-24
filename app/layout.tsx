import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SITE_URL } from '@/lib/site'

const DEFAULT_GA_MEASUREMENT_ID = 'G-50B6DD0M9F'

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'QorSync AI',
  url: SITE_URL,
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
  description: 'Enterprise AI workflow automation platform with governed agent execution for ERP, CRM, and ITSM operations.',
  openGraph: {
    title: 'QorSync AI',
    description: 'Enterprise AI workflow automation platform with governed agent execution for ERP, CRM, and ITSM operations.',
    url: SITE_URL,
    siteName: 'QorSync AI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QorSync AI',
    description: 'Enterprise AI workflow automation platform with governed agent execution for ERP, CRM, and ITSM operations.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const configuredGaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim()
  const gaMeasurementId =
    configuredGaMeasurementId ||
    (process.env.NODE_ENV === 'production' ? DEFAULT_GA_MEASUREMENT_ID : undefined)

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
gtag('config', '${gaMeasurementId}', { send_page_view: true });`,
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
