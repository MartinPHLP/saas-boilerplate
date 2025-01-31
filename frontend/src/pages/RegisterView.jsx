import React from "react";
import { useState } from "react";

export function RegisterView({ onRegister, onNavigate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsSubmitting(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    const result = await onRegister(email, password);
    if (result.success) {
      setSuccessMessage(result.message);
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        window.location.href = "/";
        window.location.reload();
      }, 3000);
    } else {
      setError(result.message);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-colorc">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-96 border border-colorb/10"
      >
        <h2 className="text-2xl font-bold mb-6 text-colord">
          Create an account
        </h2>
        {error && (
          <div className="mb-4 text-red-500 bg-red-50 p-3 rounded-md text-sm">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 text-colora bg-colorc p-4 rounded-md text-sm font-medium">
            {successMessage}
          </div>
        )}
        <div className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-3 border border-colorb/20 rounded-md focus:outline-none focus:border-colora transition-colors"
            required
            disabled={isSubmitting}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-3 border border-colorb/20 rounded-md focus:outline-none focus:border-colora transition-colors"
            required
            disabled={isSubmitting}
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            className="w-full p-3 border border-colorb/20 rounded-md focus:outline-none focus:border-colora transition-colors"
            required
            disabled={isSubmitting}
          />
          <button
            type="submit"
            className="w-full bg-colora text-white py-3 rounded-md hover:bg-colorb transition-colors font-medium relative"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                <span className="ml-2">Creating account...</span>
              </div>
            ) : (
              "Create an account"
            )}
          </button>
          <button
            type="button"
            onClick={() => onNavigate("home")}
            className="w-full bg-white text-colord py-3 rounded-md border-2 border-colora hover:bg-colorc transition-colors font-medium"
            disabled={isSubmitting}
          >
            Back to Home
          </button>
        </div>
      </form>
    </div>
  );
}
