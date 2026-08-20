import HeroSlider from "@/components/droply/HeroSlider";
import TrustBar from "@/components/droply/TrustBar";
import Benefits from "@/components/droply/Benefits";
import CategoryTiles from "@/components/droply/CategoryTiles";
import Bestsellers from "@/components/droply/Bestsellers";
import SupportSection from "@/components/droply/SupportSection";
import Newsletter from "@/components/droply/Newsletter";

export default function Home() {
  return (
    <>
      <HeroSlider />
      <TrustBar />
      <Benefits />
      <CategoryTiles />
      <Bestsellers />
      <SupportSection />
      <Newsletter />
    </>
  );
}
