import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { PainSection } from "@/components/home/PainSection";
import { SolutionSection } from "@/components/home/SolutionSection";
import { BenefitsSection } from "@/components/home/BenefitsSection";
import { SocialProofSection } from "@/components/home/SocialProofSection";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <PainSection />
      <SolutionSection />
      <BenefitsSection />
      <SocialProofSection />
      <CTASection />
    </Layout>
  );
};

export default Index;