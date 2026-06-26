import React from "react";
import { Hero, ServicesSection, CTASection} from "../features/services";


export const Services: React.FC = () => (
  <div style={styles.page}>
   <Hero />
   <ServicesSection />
   <CTASection />
  </div>
);

const styles = { page: { padding: "0 8%", color: "#fff" } };