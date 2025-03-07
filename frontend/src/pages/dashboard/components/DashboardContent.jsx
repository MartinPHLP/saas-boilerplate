import React from "react";
import { Feature1View } from "../features/feature_1/Feature1View";
import { Feature2View } from "../features/feature_2/Feature2View";
import { Feature3View } from "../features/feature_3/Feature3View";

export function DashboardContent({ currentView }) {
  const renderContent = () => {
    switch (currentView) {
      case "feature_1":
        return <Feature1View />;
      case "feature_2":
        return <Feature2View />;
      case "feature_3":
        return <Feature3View />;
      default:
        return <Feature1View />; // Vue par défaut
    }
  };

  return (
    <div className="min-h-screen p-6 bg-colorc">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-colorb/10 p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
