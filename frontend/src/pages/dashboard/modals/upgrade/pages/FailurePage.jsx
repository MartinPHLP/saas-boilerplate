import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function FailurePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
      window.location.reload();
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary">
      <div className="text-center p-8 rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Payment Cancelled</h1>
        <p>Your payment was cancelled. You will be redirected shortly...</p>
      </div>
    </div>
  );
}
