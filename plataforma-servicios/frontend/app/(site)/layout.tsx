import { Footer } from '@/components/site/Footer';
import { Header } from '@/components/site/Header';
import { CartDrawer } from '@/components/site/CartDrawer';
import { WhatsAppFloat } from '@/components/site/WhatsAppFloat';
import { ScrollProgress, SmoothScroll } from '@/components/fx/effects';
import { getContent } from '@/lib/server';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { settings } = await getContent();
  return (
    <>
      <SmoothScroll />
      <ScrollProgress />
      <Header brand={settings.brand} />
      <main>{children}</main>
      <Footer settings={settings} />
      <CartDrawer />
      <WhatsAppFloat phone={settings.contact.whatsapp} message={settings.contact.whatsappMessage} />
    </>
  );
}
