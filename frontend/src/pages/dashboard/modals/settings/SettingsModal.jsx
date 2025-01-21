import { useState } from "react";
import { PaymentsHistoryModal } from "./modals/PaymentsHistoryModal";
import { API_BASE_URL } from "../../../../config";

export function SettingsModal({ onClose, onLogout }) {
  const [showPaymentsModal, setShowPaymentsModal] = useState(false);

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account ? This action is irreversible."
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
    alert("Cette fonctionnalité sera bientôt disponible");
  };

  const handleShowPayments = () => {
    setShowPaymentsModal(true);
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
      <div className="bg-secondary rounded-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Settings</h2>
          <button
            onClick={onClose}
            className="text-neutral-dark hover:text-primary"
          >
            ✕
          </button>
        </div>
        <div className="space-y-3">
          <button
            onClick={handleShowPayments}
            className="w-full px-4 py-2 text-primary border border-primary rounded-md hover:bg-secondary-hover"
          >
            Payments history
          </button>
          <button
            onClick={handleManageSubscription}
            className="w-full px-4 py-2 text-primary border border-primary rounded-md hover:bg-secondary-hover"
          >
            Manage subscription
          </button>
          <button
            onClick={handleDeleteAccount}
            className="w-full px-4 py-2 text-secondary bg-primary border border-primary rounded-md hover:bg-primary-hover"
          >
            Delete my account
          </button>
        </div>
      </div>
      {showPaymentsModal && (
        <PaymentsHistoryModal onClose={() => setShowPaymentsModal(false)} />
      )}
    </div>
  );
}
