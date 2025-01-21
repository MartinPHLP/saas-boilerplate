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
    <div className="min-h-screen flex items-center justify-center bg-neutral">
      <form
        onSubmit={handleSubmit}
        className="bg-secondary p-8 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <div className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-2 border rounded"
            required
          />
          <div className="text-right">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="text-sm text-gray-600 hover:underline"
            >
              Forgot Password?
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-secondary py-2 rounded hover:bg-primary-hover"
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => onNavigate("home")}
            className="w-full bg-neutral text-primary py-2 rounded hover:bg-secondary-hover"
          >
            Back
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
