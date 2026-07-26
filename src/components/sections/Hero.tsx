import Container from "@/components/Container";
import Button from "@/components/Button";
import SocialLinks from "@/components/SocialLinks";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-12%] h-[440px] w-[440px] rounded-full bg-arch opacity-[0.18] blur-[80px]"
      />
      <Container className="grid items-center gap-12 pb-24 pt-14 lg:grid-cols-12 lg:gap-8 lg:pb-32 lg:pt-24">
        <div className="lg:col-span-7">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
            Design Subscription · Safety Care
          </p>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.13] tracking-tight text-ink sm:text-5xl lg:text-[58px]">
            디자인 팀이 없어도,
            <br />
            매달 <span className="text-teal-700">새로운 콘텐츠</span>가
            <br />
            도착합니다.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
            전용 마스코트, 매월 웹툰, 그리고 디자인 시스템까지. 소상공인과 작은
            회사를 위한{" "}
            <b className="font-semibold text-ink">구독형 디자인 서비스</b>, 그리고
            노면표시·안전표지의{" "}
            <b className="font-semibold text-ink">정기 시설 관리</b>를 한 곳에서.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button href="https://store.public-id.co.kr" variant="arch" size="lg">
              PI-STORE
            </Button>
            <Button
              href="https://blog.naver.com/public-id"
              variant="outline"
              size="lg"
            >
              PI-NaverBlog
            </Button>
            <Button
              href="https://store.public-id.co.kr/world"
              variant="teal"
              size="lg"
            >
              퍼블릭아이디 월드
            </Button>
          </div>
          <SocialLinks className="mt-5 flex flex-wrap items-center gap-2" />
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-soft">
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-teal" />
              KIDP 종합산업디자인전문회사 (시각 · 포장 · 환경)
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-lime" />
              인증 사회적기업
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-yellow" />
              우수디자인 선정
            </span>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[28px] border border-line bg-cloud">
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src="/mascot/pui-hero.mp4"
              poster="/mascot/pui-front.png"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="퍼블릭아이디 마스코트 퍼이가 한 바퀴 돌며 인사하는 영상"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
