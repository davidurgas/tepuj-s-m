import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import BenefitsSection from '@/components/BenefitsSection';
import ProcessSection from '@/components/ProcessSection';
import BeforeAfterSection from '@/components/BeforeAfterSection';
import PricingSection from '@/components/PricingSection';
import ReviewsSection from '@/components/ReviewsSection';
import FAQSection from '@/components/FAQSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <BenefitsSection />
      <ProcessSection />
      <BeforeAfterSection />
      <PricingSection />
      <ReviewsSection />
      <FAQSection />
      <Footer />
    </main>
  );
};

export default Index;
