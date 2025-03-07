import React from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { PlanCard } from "../../components/PlanCard";
import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../../config";

export function UpgradeModal({ onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const isCurrentPlan = (planId) => {
    const token = Cookies.get("access_token");
    if (!token) return false;

    try {
      const decoded = jwtDecode(token);
      return parseInt(decoded.plan) === planId;
    } catch (error) {
      console.error("Token decoding error:", error);
      return false;
    }
  };

  const shouldDisableSubscribe = (planId) => {
    const token = Cookies.get("access_token");
    if (!token) return false;

    try {
      const decoded = jwtDecode(token);
      const currentPlan = parseInt(decoded.plan);
      return currentPlan >= planId;
    } catch (error) {
      console.error("Token decoding error:", error);
      return false;
    }
  };

  const handleSubscribe = async (planId) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = Cookies.get("access_token");
      const response = await axios.post(
        `${API_BASE_URL}/api/billing/create-checkout-session/`,
        { plan_id: planId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      window.location.href = response.data.checkout_url;
    } catch (error) {
      console.error("Subscription error:", error);
      setError(
        "An error occurred while processing your subscription. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const plans = [
    {
      id: 1,
      name: "Starter",
      price: 0,
      features: ["feature 1", "feature 2", "feature 3"],
    },
    {
      id: 2,
      name: "Pro",
      price: 9.99,
      features: ["feature 1", "feature 2", "feature 3"],
    },
    {
      id: 3,
      name: "Enterprise",
      price: 19.99,
      features: ["feature 1", "feature 2", "feature 3"],
    },
  ];

  return (
    <div className="fixed inset-0 bg-colord/50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg border border-colorb/10 p-8 w-[800px] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-colord">
            Manage your subscription
          </h2>
          <button
            onClick={onClose}
            className="text-colorb hover:text-colord transition-colors p-2"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-500 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              name={plan.name}
              price={plan.price}
              features={plan.features}
              isCurrentPlan={isCurrentPlan(plan.id)}
              onSubscribe={() => handleSubscribe(plan.id)}
              isLoading={isLoading}
              disableSubscribe={shouldDisableSubscribe(plan.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
