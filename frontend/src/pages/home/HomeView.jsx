import React from "react";
import { LandingPage } from "./landing/LandingPage";

export function HomeView({ onNavigate }) {
  return (
    <div className="min-h-screen landing-page">
      <LandingPage onNavigate={onNavigate} />
    </div>
  );
}
