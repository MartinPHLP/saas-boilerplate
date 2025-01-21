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
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
      <div className="bg-secondary p-8 rounded-lg w-96">
        <h3 className="text-xl font-bold mb-4">Reset Password</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            className="w-full p-2 border rounded mb-4"
            required
            disabled={isLoading}
          />
          {status.message && (
            <div
              className={`mb-4 ${
                status.type === "error" ? "text-primary" : "text-primary"
              }`}
            >
              {status.message}
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-neutral rounded hover:bg-secondary-hover"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-secondary rounded hover:bg-primary-hover relative"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-t-2 border-b-2 border-secondary rounded-full animate-spin"></div>
                  <span className="ml-2">Sending...</span>
                </div>
              ) : (
                "Send"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
