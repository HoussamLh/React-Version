import React from "react";
import {
  Hero,
  CoreDomains,
  BuildProcess,
  OurTeam,
  CTASection,
} from "../features/about";

export const About: React.FC = () => (
  <div style={{padding:'0 8%', overflow:'hidden'}}>
    <Hero />
    <CoreDomains />
    <BuildProcess />
    <OurTeam />
    <CTASection />
  </div>
);

