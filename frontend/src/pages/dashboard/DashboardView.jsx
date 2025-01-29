import { useState } from "react";
import { SettingsModal } from "./modals/settings/SettingsModal";
import { UpgradeModal } from "./modals/upgrade/UpgradeModal";
import { NavButton } from "./components/NavButton";
import { DashboardContent } from "./components/DashboardContent";

export function DashboardView({ onLogout }) {
  const [showSettings, setShowSettings] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  return (
    <div className="min-h-screen bg-neutral relative">
      {/* Barre de navigation */}
      <nav className="bg-secondary shadow-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <svg
              className="w-8 h-8 text-primary"
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
            <span className="ml-2 text-xl font-bold">Logo</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Groupe des boutons de navigation */}
            <div className="flex items-center gap-1 mr-4 p-1 bg-neutral rounded-lg">
              <NavButton
                onClick={() => setShowUpgrade(true)}
                variant="primary"
                title="Gérer votre abonnement"
              >
                Upgrade
              </NavButton>
              <div className="w-px h-6 bg-neutral-dark" />{" "}
              {/* Séparateur vertical */}
              <NavButton
                onClick={() => setShowSettings(true)}
                variant="icon"
                title="Paramètres"
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
              />
              <NavButton
                onClick={onLogout}
                variant="icon"
                title="Déconnexion"
                icon={
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                }
              />
            </div>
          </div>
        </div>
      </nav>

      <DashboardContent />

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
