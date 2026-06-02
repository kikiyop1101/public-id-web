import Hero from "@/components/sections/Hero";
import TrustBar from "@/components/sections/TrustBar";
import Subscription from "@/components/sections/Subscription";
import Work from "@/components/sections/Work";
import MascotIntro from "@/components/sections/MascotIntro";
import SocialValue from "@/components/sections/SocialValue";
import ContactCTA from "@/components/sections/ContactCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <Subscription moreHref="/subscribe" designHref="/subscribe#pricing" pricing />
      <Work moreHref="/work" tint />
      <MascotIntro />
      <SocialValue />
      <ContactCTA />
    </>
  );
}
