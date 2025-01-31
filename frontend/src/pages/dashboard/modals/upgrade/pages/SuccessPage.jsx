import React from "react";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../../../../config";
import Cookies from "js-cookie";

export function SuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const hasProcessed = useRef(false);

  useEffect(() => {
    const createSubscription = async () => {
      if (hasProcessed.current) return;
      hasProcessed.current = true;

      try {
        const sessionId = searchParams.get("session_id");
        const token = Cookies.get("access_token");

        const response = await axios.post(
          `${API_BASE_URL}/api/billing/create-subscription/`,
          { session_id: sessionId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          Cookies.set("access_token", response.data.token);
          await new Promise((resolve) => setTimeout(resolve, 100));
          navigate("/");
          window.location.reload();
        }
      } catch (error) {
        console.error("Error creating subscription:", error);
        setError("An error occurred while activating your subscription.");
        hasProcessed.current = false;
      }
    };

    createSubscription();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-colorc">
      <div className="bg-white p-8 rounded-lg shadow-lg border border-colorb/10 text-center max-w-md">
        <div className="mb-6 text-colora text-6xl">✓</div>
        <h1 className="text-2xl font-bold mb-4 text-colord">
          Payment Successful!
        </h1>
        <p className="mb-4 text-colorb">
          Thank you for your subscription. You will be redirected shortly...
        </p>
        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-500 rounded-md text-sm">
            {error}
          </div>
        )}
        <div className="mt-6 flex justify-center">
          <div className="w-8 h-8 border-t-2 border-b-2 border-colora rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
}
