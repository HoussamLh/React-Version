import React from "react";
import { Hero } from "../features/about/Hero";
import { CoreDomains } from "../features/about/CoreDomains";
export const About: React.FC = () => (
  <div style={{padding:'0 8%', overflow:'hidden'}}>
    <Hero />
    <CoreDomains />
  </div>
);

