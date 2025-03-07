import React from "react";
import { useState } from "react";
import { SettingsModal } from "./modals/settings/SettingsModal";
import { UpgradeModal } from "./modals/upgrade/UpgradeModal";
import { NavButton } from "./components/NavButton";
import { DashboardContent } from "./components/DashboardContent";

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

export function DashboardView({ onLogout }) {
  const [showSettings, setShowSettings] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const userPlan = getUserPlan();
  // Initialize currentView as null if plan is 0, otherwise default to "feature_1"
  const [currentView, setCurrentView] = useState(
    userPlan === 0 ? null : "feature_1"
  );

  const handleSidebarAction = (action) => {
    setIsSidebarOpen(false);
    action();
  };

  const navigationItems = [
    {
      title: "Feature 1",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      ),
      view: "feature_1",
      requiredPlan: 1,
    },
    {
      title: "Feature 2",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      ),
      view: "feature_2",
      requiredPlan: 2,
    },
    {
      title: "Feature 3",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      ),
      view: "feature_3",
      requiredPlan: 1,
    },
  ];

  const handleNavigation = (item) => {
    if (userPlan >= item.requiredPlan) {
      handleSidebarAction(() => setCurrentView(item.view));
    } else {
      setShowUpgrade(true);
    }
  };

  const renderContent = () => {
    if (currentView === null) {
      return renderUpgradeMessage();
    }

    switch (
      currentView
      // ... existing cases ...
    ) {
    }
  };

  return (
    <div className="flex min-h-screen bg-colorc">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-20
        w-64 bg-white shadow-sm border-r border-colorb/10
        flex flex-col transform transition-transform duration-300 ease-in-out
        lg:transform-none
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Logo section */}
        <div className="p-6 border-b border-colorb/10">
          <div className="flex items-center">
            <svg
              className="w-8 h-8 text-colora"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span className="ml-3 text-xl font-bold text-colord">Logo</span>
          </div>
        </div>

        {/* Main navigation buttons */}
        <nav className="p-4 flex flex-col gap-2">
          {navigationItems.map((item) => (
            <NavButton
              key={item.view}
              onClick={() => handleNavigation(item)}
              variant="icon"
              title={item.title}
              icon={item.icon}
              isActive={currentView === item.view}
              className={`
                ${
                  userPlan < item.requiredPlan
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }
                ${currentView === item.view ? "bg-colorc" : ""}
              `}
            >
              <div className="flex items-center justify-between w-full">
                {item.title}
                {userPlan < item.requiredPlan && (
                  <svg
                    className="w-4 h-4 ml-2"
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
                )}
              </div>
            </NavButton>
          ))}
        </nav>

        {/* Settings navigation - pushed to bottom */}
        <nav className="mt-auto p-4 border-t border-colorb/10">
          <div className="flex flex-col gap-2">
            <NavButton
              onClick={() => handleSidebarAction(() => setShowUpgrade(true))}
              variant="primary"
              title="Manage your subscription"
            >
              Upgrade
            </NavButton>

            <NavButton
              onClick={() => handleSidebarAction(() => setShowSettings(true))}
              variant="icon"
              title="Settings"
              icon={
                <>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </>
              }
            >
              Settings
            </NavButton>

            <NavButton
              onClick={() => handleSidebarAction(onLogout)}
              variant="icon"
              title="Logout"
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              }
            >
              Sign out
            </NavButton>
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1">
        {/* Mobile header with menu button */}
        <div className="lg:hidden bg-white shadow-sm border-b border-colorb/10 p-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-colord hover:bg-colorc rounded-md"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        <DashboardContent
          currentView={currentView}
          onUpgradeClick={() => setShowUpgrade(true)}
        />
      </main>

      {/* Modals */}
      {showSettings && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowSettings(false)}
          />
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <SettingsModal
                onClose={() => setShowSettings(false)}
                onLogout={onLogout}
              />
            </div>
          </div>
        </>
      )}

      {showUpgrade && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowUpgrade(false)}
          />
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <UpgradeModal onClose={() => setShowUpgrade(false)} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
