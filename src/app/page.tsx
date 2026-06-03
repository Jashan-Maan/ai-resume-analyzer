"use client";

import { Variants } from "framer-motion";
import Navbar from "@/components/shared/Navbar";
import Hero from "@/components/shared/Hero";
import StatsBar from "@/components/shared/StatsBar";
import Features from "@/components/shared/Features";
import HowItWorks from "@/components/shared/HowItWorks";
import Testimonials from "@/components/shared/Testimonials";
import CallToAction from "@/components/shared/CallToAction";
import Footer from "@/components/shared/Footer";

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <Navbar />
      <Hero />
      <StatsBar />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CallToAction />
      <Footer />
    </div>
  );
}
