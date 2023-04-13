"use client";

import ConfettiLayout from "@/app/components/layouts/ConfettiLayout";
import { Header, Footer } from "@/app/components/ui";
import { Hero, Logos, Values, Features, How, CTA } from "./components/sections";
import FenixContext from "@/contexts/FenixContext";
import { useContext } from "react";

const Home = () => {
  const { showConfetti } = useContext(FenixContext);

  return (
    <main>
      <Hero />
      <Logos />
      <How />
      <Features />
      <Values />
      <CTA />
    </main>
  );
};

export default Home;
