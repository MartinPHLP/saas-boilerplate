import React from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

export function VerifyEmailView() {
  const [status, setStatus] = useState("verifying");
  const { uid, token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/auth/verify-email/${uid}/${token}/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setTimeout(() => {
            navigate("/");
            window.location.reload();
          }, 3000);
        } else {
          setStatus("error");
        }
      } catch (error) {
        console.error("Error verifying email:", error);
        setStatus("error");
      }
    };

    verifyEmail();
  }, [uid, token, navigate]);

  const handleGoHome = () => {
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-colorc">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 text-center border border-colorb/10">
        {status === "verifying" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-colord">
              Verifying your email...
            </h2>
            <div className="flex justify-center">
              <div className="w-8 h-8 border-t-2 border-b-2 border-colora rounded-full animate-spin"></div>
            </div>
            <p className="text-colorb">
              Please wait while we verify your email address.
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <div className="text-colora text-5xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-colord">Email Verified!</h2>
            <p className="text-colorb">
              Your email has been successfully verified.
            </p>
            <p className="text-colorb mt-4">Redirecting to homepage...</p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <div className="text-red-500 text-5xl mb-4">✕</div>
            <h2 className="text-2xl font-bold text-colord">
              Verification Failed
            </h2>
            <p className="text-colorb">
              Sorry, we couldn't verify your email. The link might be expired or
              invalid.
            </p>
            <button
              onClick={handleGoHome}
              className="mt-4 bg-colora text-white px-6 py-3 rounded-md hover:bg-colorb transition-colors font-medium"
            >
              Go to Homepage
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
