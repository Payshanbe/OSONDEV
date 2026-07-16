import { Cursor } from "@/components/cursor";
import { LenisRoot } from "@/components/lenis-root";
import { SiteContentProvider } from "@/components/site-content-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProjectInquiryProvider } from "@/components/project-inquiry";
import { getSiteContent } from "@/lib/content";
import { isValidLocale, type Locale } from "@/lib/i18n/config";
import { notFound } from "next/navigation";

export default async function MarketingLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) notFound();

  const locale = localeParam as Locale;
  const content = await getSiteContent(locale);

  return (
    <SiteContentProvider content={content} locale={locale}>
      <ProjectInquiryProvider>
        <LenisRoot>
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <main id="main" className="flex-1">
              {children}
            </main>
            <SiteFooter />
            <Cursor />
          </div>
        </LenisRoot>
      </ProjectInquiryProvider>
    </SiteContentProvider>
  );
}
