import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

export function VerifyEmailView() {
  const [status, setStatus] = useState("verifying"); // verifying, success, error
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
          // Redirection automatique après 3 secondes avec refresh
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
    <div className="min-h-screen flex items-center justify-center bg-neutral">
      <div className="bg-secondary p-8 rounded-lg shadow-md w-96 text-center">
        {status === "verifying" && (
          <div className="text-black">
            <h2 className="text-2xl font-bold mb-4">Verifying your email...</h2>
            <p>Please wait while we verify your email address.</p>
          </div>
        )}

        {status === "success" && (
          <div className="text-black">
            <h2 className="text-2xl font-bold mb-4">Email Verified!</h2>
            <p>Your email has been successfully verified.</p>
            <p className="mt-4 text-neutral-dark">Redirecting to homepage...</p>
          </div>
        )}

        {status === "error" && (
          <div className="text-black">
            <h2 className="text-2xl font-bold mb-4">Verification Failed</h2>
            <p>
              Sorry, we couldn't verify your email. The link might be expired or
              invalid.
            </p>
            <button
              onClick={handleGoHome}
              className="mt-4 bg-primary text-secondary px-4 py-2 rounded hover:bg-primary-hover transition-colors"
            >
              Go to Homepage
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
