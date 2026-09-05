import type { Metadata } from 'next';
import { Inter, Caveat, Playfair_Display, Dancing_Script } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const dancing = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-dancing',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Write Something Special 💌',
  description: 'Leave a message and a few photos. We will take care of the rest.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${caveat.variable} ${playfair.variable} ${dancing.variable}`}
    >
      <body className="min-h-screen bg-[#faf7f2] text-[#2d241e] antialiased">
        {children}
      </body>
    </html>
  );
}
