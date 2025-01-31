import React, { useState } from "react";
import CoverSection from "./components/CoverSection";
import Footer from "./components/Footer";
import InfoSection from "./components/InfoSection";
import {
  aboutObj,
  discoverObj,
  signupObj,
} from "./components/InfoSection/Data";
import Navbar from "./components/Navbar";
import Services from "./components/Services";
import Sidebar from "./components/Sidebar";

export function LandingPage({ onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Sidebar isOpen={isOpen} toggle={toggle} onNavigate={onNavigate} />
      <Navbar toggle={toggle} onNavigate={onNavigate} />
      <CoverSection onNavigate={onNavigate} />
      <InfoSection {...aboutObj} onNavigate={onNavigate} />
      <InfoSection {...discoverObj} onNavigate={onNavigate} />
      <InfoSection {...signupObj} onNavigate={onNavigate} />
      <Services />
      <Footer />
    </>
  );
}
