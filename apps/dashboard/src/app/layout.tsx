import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NullVoid — Enterprise Discord Bot',
  description: 'AI-powered moderation, tickets, economy, leveling, music & portfolio generator for Discord.',
  keywords: ['discord bot', 'moderation', 'ai', 'tickets', 'economy', 'leveling', 'music', 'portfolio'],
  openGraph: {
    title: 'NullVoid',
    description: 'Enterprise-Grade Discord Bot',
    type: 'website',
    siteName: 'NullVoid',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NullVoid',
    description: 'Enterprise-Grade Discord Bot',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
