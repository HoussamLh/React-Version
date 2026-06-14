import React from "react";
import { Hero, ServicesSection, WorkflowSection, CTASection} from "../features/services";


export const Services: React.FC = () => (
  <div style={styles.page}>
   <Hero />
   <ServicesSection />
   <WorkflowSection />
   <CTASection />
  </div>
);
const styles = { page: { padding: "100px 8%", color: "#fff" } };
