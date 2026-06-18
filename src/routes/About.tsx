import React from "react";
import {
  Hero,
  BuildProcess,
  OurTeam,
  CTASection,
} from "../features/about";

export const About: React.FC = () => (
  <div style={{padding:'0 8%', overflow:'hidden'}}>
    <Hero />
    <BuildProcess />
    <OurTeam />
    <CTASection />
  </div>
);

