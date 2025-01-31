import React from "react";
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
    <div className="min-h-screen flex items-center justify-center bg-colorc">
      <div className="bg-white p-8 rounded-lg shadow-lg border border-colorb/10 text-center max-w-md">
        <div className="mb-6 text-red-500 text-6xl">✕</div>
        <h1 className="text-2xl font-bold mb-4 text-colord">
          Payment Cancelled
        </h1>
        <p className="text-colorb">
          Your payment was cancelled. You will be redirected shortly...
        </p>
        <div className="mt-6">
          <button
            onClick={() => {
              navigate("/");
              window.location.reload();
            }}
            className="px-6 py-2 bg-colora text-white rounded-md hover:bg-colorb transition-colors duration-200 font-medium"
          >
            Return to Dashboard
          </button>
        </div>
        <div className="mt-6 flex justify-center">
          <div className="w-8 h-8 border-t-2 border-b-2 border-colora rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
}
