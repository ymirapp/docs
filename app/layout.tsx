import { RootProvider } from 'fumadocs-ui/provider/next';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { siteUrl } from '@/lib/shared';
import './global.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });

// Fumadocs UI text overrides. The code block copy button shows its status text (app/global.css),
// so it reads Copy and Copied.
const translations = {
  'Copy Text(code block)(aria-label)': 'Copy',
  'Copied Text(code block)(aria-label)': 'Copied',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { template: '%s | Ymir Documentation', default: 'Ymir Documentation' },
  description: 'Documentation for Ymir, serverless WordPress and PHP hosting on your own AWS account.',
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen antialiased">
        <RootProvider theme={{ forcedTheme: 'light', hotKey: false }} i18n={{ translations }}>{children}</RootProvider>
      </body>
    </html>
  );
}
