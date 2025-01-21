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
    <div className="min-h-screen flex items-center justify-center bg-neutral">
      <form
        onSubmit={handleSubmit}
        className="bg-secondary p-8 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6">Create an account</h2>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        {successMessage && (
          <div className="mb-4 text-green-500 p-4 bg-green-50 rounded">
            {successMessage}
          </div>
        )}
        <div className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-2 border rounded"
            required
            disabled={isSubmitting}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-2 border rounded"
            required
            disabled={isSubmitting}
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            className="w-full p-2 border rounded"
            required
            disabled={isSubmitting}
          />
          <button
            type="submit"
            className="w-full px-4 py-2 bg-primary text-secondary rounded hover:bg-primary-hover relative"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-t-2 border-b-2 border-secondary rounded-full animate-spin"></div>
                <span className="ml-2">Creating account...</span>
              </div>
            ) : (
              "Create an account"
            )}
          </button>
          <button
            type="button"
            onClick={() => onNavigate("home")}
            className="w-full bg-neutral text-primary py-2 rounded hover:bg-secondary-hover"
            disabled={isSubmitting}
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
}
