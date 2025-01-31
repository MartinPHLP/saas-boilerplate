import React from "react";
import { useState } from "react";
import { ForgotPasswordModal } from "./modals/ForgotPasswordModal";

export function LoginView({ onLogin, onNavigate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const success = await onLogin(email, password);
    if (!success) {
      setError("Incorrect email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-colorc">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-96 border border-colorb/10"
      >
        <h2 className="text-2xl font-bold mb-6 text-colord">Welcome Back</h2>
        {error && (
          <div className="mb-4 text-red-500 bg-red-50 p-3 rounded-md text-sm">
            {error}
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
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-3 border border-colorb/20 rounded-md focus:outline-none focus:border-colora transition-colors"
            required
          />
          <div className="text-right">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="text-sm text-colorb hover:text-colora transition-colors"
            >
              Forgot Password?
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-colora text-white py-3 rounded-md hover:bg-colorb transition-colors font-medium"
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => onNavigate("home")}
            className="w-full bg-white text-colord py-3 rounded-md border-2 border-colora hover:bg-colorc transition-colors font-medium"
          >
            Back to Home
          </button>
        </div>
      </form>
      <ForgotPasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
