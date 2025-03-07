import React from "react";
import { Feature1View } from "../features/feature_1/Feature1View";
import { Feature2View } from "../features/feature_2/Feature2View";
import { Feature3View } from "../features/feature_3/Feature3View";

const getUserPlan = () => {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("access_token="))
    ?.split("=")[1];

  if (!token) return 0;

  try {
    const decoded = JSON.parse(atob(token.split(".")[1]));
    return decoded.plan || 0;
  } catch (error) {
    return 0;
  }
};

export function DashboardContent({ currentView, onUpgradeClick }) {
  const userPlan = getUserPlan();

  const renderUpgradeMessage = () => (
    <div className="text-center py-12">
      <div className="mb-4">
        <svg
          className="w-12 h-12 mx-auto text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
        Choose a Plan to Get Started
      </h2>
      <p className="text-gray-600 mb-6">
        Please upgrade your account to access all features
      </p>
      <button
        onClick={onUpgradeClick}
        className="bg-colora text-white px-6 py-2 rounded-md hover:bg-colora/90 transition-colors"
      >
        Upgrade Now
      </button>
    </div>
  );

  const renderContent = () => {
    if (userPlan === 0) {
      return renderUpgradeMessage();
    }

    switch (currentView) {
      case "feature_1":
        return <Feature1View />;
      case "feature_2":
        return <Feature2View />;
      case "feature_3":
        return <Feature3View />;
      default:
        return <Feature1View />;
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
