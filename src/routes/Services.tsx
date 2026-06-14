import React from "react";
import { Hero } from "../features/services/sections/Hero";
import { ServicesSection } from "../features/services/sections/ServicesSection";
import {WorkflowSection} from "../features/services/sections/WorkflowSection";
import { CTASection } from "../features/services/sections/CTASection";

export const Services: React.FC = () => (
  <div style={styles.page}>
   <Hero />
   <ServicesSection />
   <WorkflowSection />
   <CTASection />
  </div>
);
const styles = { page: { padding: "100px 8%", color: "#fff" } };
