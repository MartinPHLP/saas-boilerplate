import React from "react";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

export function ResetPasswordView() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setStatus({
        type: "error",
        message: "Passwords do not match",
      });
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/reset-password/${uid}/${token}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            new_password: newPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setStatus({
          type: "success",
          message: "Password successfully reset",
        });
        setTimeout(() => {
          navigate("/");
          window.location.reload();
        }, 1000);
      } else {
        setStatus({
          type: "error",
          message:
            "An error occurred. Please try with a different link or contact support.",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setStatus({
        type: "error",
        message: "An error occurred. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-colorc">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 border border-colorb/10">
        <h2 className="text-2xl font-bold mb-6 text-colord">Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              className="w-full p-3 border border-colorb/20 rounded-md focus:outline-none focus:border-colora transition-colors"
              required
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className="w-full p-3 border border-colorb/20 rounded-md focus:outline-none focus:border-colora transition-colors"
              required
            />
            {status.message && (
              <div
                className={`p-3 rounded-md text-sm ${
                  status.type === "error"
                    ? "text-red-500 bg-red-50"
                    : "text-colora bg-colorc"
                }`}
              >
                {status.message}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-colora text-white py-3 rounded-md hover:bg-colorb transition-colors font-medium"
            >
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
