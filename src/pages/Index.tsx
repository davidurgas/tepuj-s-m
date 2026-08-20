import { CartProvider } from "@/components/droply/cart-context";
import { AccountProvider } from "@/components/droply/account-context";
import Navbar from "@/components/droply/Navbar";
import HeroSlider from "@/components/droply/HeroSlider";
import TrustBar from "@/components/droply/TrustBar";
import AkoFunguje from "@/components/droply/AkoFunguje";
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
import AccountDrawer from "@/components/droply/AccountDrawer";

const Index = () => {
  return (
    <AccountProvider>
      <CartProvider>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <HeroSlider />
          <TrustBar />
          <AkoFunguje />
          <Benefits />
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
        <AccountDrawer />
      </div>
      </CartProvider>
    </AccountProvider>
  );
};

export default Index;
