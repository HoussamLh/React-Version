import React from "react";
import {Hero} from '../features/home/Hero';
import { TrustSection } from '../features/home/Trust-section';
import {SubscriptionSection} from '../features/home/Subscription';
import { CTASection } from "../features/home/CTASection";

export const Home: React.FC = () => {
return(
  <div style={{padding:'0 8%',overflow:'hidden'}}>
    <Hero/>
    <TrustSection/>
    <SubscriptionSection/>
    <CTASection/>
  </div>
)
};  