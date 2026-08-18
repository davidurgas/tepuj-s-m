import { CartProvider } from "@/components/droply/cart-context";
import Navbar from "@/components/droply/Navbar";
import Hero from "@/components/droply/Hero";
import TrustBar from "@/components/droply/TrustBar";
import DissolveScroll from "@/components/droply/DissolveScroll";
import Benefits from "@/components/droply/Benefits";
import SavingsCalculator from "@/components/droply/SavingsCalculator";
import Comparison from "@/components/droply/Comparison";
import Products from "@/components/droply/Products";
import Bundles from "@/components/droply/Bundles";
import EcoImpact from "@/components/droply/EcoImpact";
import Guarantee from "@/components/droply/Guarantee";
import Reviews from "@/components/droply/Reviews";
import Faq from "@/components/droply/Faq";
import Newsletter from "@/components/droply/Newsletter";
import Footer from "@/components/droply/Footer";
import CartDrawer from "@/components/droply/CartDrawer";

const Index = () => {
  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <Hero />
          <TrustBar />
          <Benefits />
          <DissolveScroll />
          <SavingsCalculator />
          <Comparison />
          <Products />
          <Bundles />
          <EcoImpact />
          <Guarantee />
          <Reviews />
          <Faq />
          <Newsletter />
        </main>
        <Footer />
        <CartDrawer />
      </div>
    </CartProvider>
  );
};

export default Index;
