import React from "react";
import { useState } from "react";
import { API_BASE_URL } from "../../../config";

export function ForgotPasswordModal({ isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/reset-password-request/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setStatus({
          type: "success",
          message: data.message,
        });
        setTimeout(() => {
          setEmail("");
          setStatus({ type: "", message: "" });
          onClose();
        }, 2000);
      } else {
        setStatus({
          type: "error",
          message: "An error occurred. Please try again.",
        });
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: "An error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-colord/50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg w-96 shadow-lg border border-colorb/10">
        <h3 className="text-xl font-bold mb-6 text-colord">Reset Password</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            className="w-full p-3 border border-colorb/20 rounded-md focus:outline-none focus:border-colora transition-colors mb-4"
            required
            disabled={isLoading}
          />
          {status.message && (
            <div
              className={`mb-4 p-3 rounded-md text-sm ${
                status.type === "error"
                  ? "text-red-500 bg-red-50"
                  : "text-colora bg-colorc"
              }`}
            >
              {status.message}
            </div>
          )}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white text-colord border-2 border-colora rounded-md hover:bg-colorc transition-colors font-medium"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-colora text-white rounded-md hover:bg-colorb transition-colors font-medium relative"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                  <span className="ml-2">Sending...</span>
                </div>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
