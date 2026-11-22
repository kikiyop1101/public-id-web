import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import { loadFacilities } from "@/lib/facilitiesSource";
import { cookies } from "next/headers";
import { tokenForClient, LINKS_COOKIE, linksSessionValue } from "@/lib/clientLinks";
import { site } from "@/lib/site";
import LinksTable from "./LinksTable";
import UnlockForm from "./UnlockForm";

export const metadata: Metadata = {
  title: "발주처 전용 링크 관리",
  robots: { index: false, follow: false },
};

export default async function LinksAdminPage() {
  const authed = (await cookies()).get(LINKS_COOKIE)?.value === linksSessionValue();

  let links: { client: string; count: number; url: string }[] = [];
  if (authed) {
    const facilities = await loadFacilities();
    const clients = [...new Set(facilities.map((f) => f.client).filter(Boolean))].sort();
    links = clients.map((client) => ({
      client,
      count: facilities.filter((f) => f.client === client).length,
      url: `${site.url}/safety-map/c/${tokenForClient(client)}`,
    }));
  }

  return (
    <>
      <PageHero
        eyebrow="Admin"
        title={
          <>
            발주처 전용
            <br />
            링크 관리
          </>
        }
        description="각 발주처에 전달하는 전용 링크입니다. 발주처는 이 링크로 로그인 없이 자기 시설만 확인합니다. 구글 시트에 발주처를 추가하면 링크가 자동으로 생성됩니다."
      />
      <section className="pb-24">
        <Container>
          {authed ? (
            <div className="mx-auto max-w-3xl">
              <LinksTable links={links} />
              <p className="mt-4 text-xs text-ink-soft">
                ※ 이 페이지는 관리자 전용입니다(검색 비노출). 링크 주소를 복사해 해당
                발주처에 전달하세요.
              </p>
            </div>
          ) : (
            <UnlockForm />
          )}
        </Container>
      </section>
    </>
  );
}
