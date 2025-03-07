import React from "react";
import { useState } from "react";
import { SettingsModal } from "./modals/settings/SettingsModal";
import { UpgradeModal } from "./modals/upgrade/UpgradeModal";
import { NavButton } from "./components/NavButton";
import { DashboardContent } from "./components/DashboardContent";

export function DashboardView({ onLogout }) {
  const [showSettings, setShowSettings] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebarAction = (action) => {
    setIsSidebarOpen(false);
    action();
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
        fixed lg:static inset-y-0 left-0 z-30
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
          {/* Add your main feature buttons here */}
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

        <DashboardContent />
      </main>

      {/* Modals */}
      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          onLogout={onLogout}
        />
      )}

      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
    </div>
  );
}
