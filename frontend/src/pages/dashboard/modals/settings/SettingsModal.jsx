import React from "react";
import { useState } from "react";
import { ChangePasswordModal } from "./modals/ChangePasswordModal";
import { ManageSubscriptionModal } from "./modals/ManageSubscriptionModal";
import { API_BASE_URL } from "../../../../config";

export function SettingsModal({ onClose, onLogout }) {
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showManageSubscriptionModal, setShowManageSubscriptionModal] =
    useState(false);

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action is irreversible."
      )
    ) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/auth/delete-account/`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${
                document.cookie.split("access_token=")[1]
              }`,
            },
          }
        );

        if (response.ok) {
          onLogout();
        } else {
          alert("An error occurred while deleting your account");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while deleting your account");
      }
    }
  };

  const handleManageSubscription = () => {
    setShowManageSubscriptionModal(true);
  };

  return (
    <div className="fixed inset-0 bg-colord/50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg border border-colorb/10 p-6 w-96">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-colord">Settings</h2>
          <button
            onClick={onClose}
            className="text-colorb hover:text-colord transition-colors p-2"
          >
            ✕
          </button>
        </div>
        <div className="space-y-3">
          <button
            onClick={() => setShowManageSubscriptionModal(true)}
            className="w-full px-4 py-3 text-colord bg-white border-2 border-colora
                       rounded-md hover:bg-colorc transition-colors duration-200 font-medium"
          >
            Manage subscription
          </button>
          <button
            onClick={() => setShowChangePasswordModal(true)}
            className="w-full px-4 py-3 text-colord bg-white border-2 border-colora
                       rounded-md hover:bg-colorc transition-colors duration-200 font-medium"
          >
            Change Password
          </button>
          <button
            onClick={handleDeleteAccount}
            className="w-full px-4 py-3 text-white bg-red-500
                       rounded-md hover:bg-red-600 transition-colors duration-200 font-medium"
          >
            Delete my account
          </button>
        </div>
      </div>

      {showChangePasswordModal && (
        <ChangePasswordModal
          onClose={() => setShowChangePasswordModal(false)}
        />
      )}
      {showManageSubscriptionModal && (
        <ManageSubscriptionModal
          onClose={() => setShowManageSubscriptionModal(false)}
        />
      )}
    </div>
  );
}
