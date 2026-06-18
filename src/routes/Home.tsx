import {
  CTASection,
  Hero,
  SubscriptionSection,
  TrustSection,
} from "../features/home/sections";

export const Home: React.FC = () => {
  return (
    <div style={{ padding: "0 8%", overflow: "hidden" }}>
      <Hero />
      <TrustSection />
      <SubscriptionSection />
      <CTASection />
    </div>
  );
};
