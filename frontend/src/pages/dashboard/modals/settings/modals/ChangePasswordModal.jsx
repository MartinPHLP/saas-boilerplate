import React from "react";
import { useState } from "react";
import { API_BASE_URL } from "../../../../../config";

export function ChangePasswordModal({ onClose }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/change-password/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              document.cookie.split("access_token=")[1]
            }`,
          },
          body: JSON.stringify({
            current_password: currentPassword,
            new_password: newPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError(data.error || "An error occurred while changing the password");
      }
    } catch (error) {
      setError("An error occurred while changing the password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-colorc/30 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg border border-colorb/10 p-6 w-96">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-colord">Change Password</h2>
          <button
            onClick={onClose}
            className="text-colorb hover:text-colord transition-colors p-2"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-colord mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-3 border border-colorb/20 rounded-md
                         focus:outline-none focus:border-colora transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-colord mb-2">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 border border-colorb/20 rounded-md
                         focus:outline-none focus:border-colora transition-colors"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-500 rounded-md text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-colorc text-colora rounded-md text-sm">
              Password successfully changed!
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-colora text-white rounded-md
                     hover:bg-colorb transition-colors duration-200 font-medium
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                <span className="ml-2">Changing password...</span>
              </div>
            ) : (
              "Change Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
