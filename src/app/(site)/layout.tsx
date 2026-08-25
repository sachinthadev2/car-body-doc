import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { ChatWidget } from "@/components/site/ChatWidget";
import { ScrollToTop } from "@/components/site/ScrollToTop";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { StickyCallBar } from "@/components/site/StickyCallBar";
import { getSession } from "@/lib/auth";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <>
      <Header user={session ? { name: session.name, role: session.role } : null} />
      <main className="min-h-[60vh] pb-14 lg:pb-0">{children}</main>
      <Footer />
      <StickyCallBar />
      <ScrollToTop />
      <ChatWidget />
      <SmoothScroll />
    </>
  );
}
