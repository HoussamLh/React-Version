import React from "react";
import { Hero } from "../features/services/Hero";
import { ServicesSection } from "../features/services/ServicesSection";
import {WorkflowSection} from "../features/services/WorkflowSection";
import { CTASection } from "../features/services/CTASection";

export const Services: React.FC = () => (
  <div style={styles.page}>
   <Hero />
   <ServicesSection />
   <WorkflowSection />
   <CTASection />
  </div>
);
const styles = { page: { padding: "100px 8%", color: "#fff" } };
