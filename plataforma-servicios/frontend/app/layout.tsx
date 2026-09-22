import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import { Providers } from '@/components/providers';
import { getContent } from '@/lib/server';
import './globals.css';

// Tipografías de la guía de marca F.I.S.C.
const body = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
const display = Space_Grotesk({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-display-face', display: 'swap' });

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getContent();
  return { title: settings.seo.title, description: settings.seo.description };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { settings } = await getContent();
  const style = { '--brand': settings.brand.primaryColor, '--accent': settings.brand.accentColor } as React.CSSProperties;
  return (
    <html lang="es" style={style} className={`${body.variable} ${display.variable}`}>
      <body className="font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
