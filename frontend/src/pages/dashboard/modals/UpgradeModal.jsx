import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { PlanCard } from "../components/PlanCard";
import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../config";

export function UpgradeModal({ onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCurrentPlan = () => {
    const token = Cookies.get("access_token");
    if (!token) return "No plan";

    try {
      const decoded = jwtDecode(token);
      return decoded.plan_name || "No plan";
    } catch (error) {
      console.error("Erreur de décodage du token:", error);
      return "Error reading plan";
    }
  };

  const handleSubscribe = async (planId) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = Cookies.get("access_token");
      const response = await axios.post(
        `${API_BASE_URL}/api/billing/create-checkout-session/`,
        {
          plan_id: planId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
      name: "Free",
      price: 0,
      features: ["feature 1", "feature 2", "feature 3"],
    },
    {
      id: 2,
      name: "Premium",
      price: 9.99,
      features: ["feature 1", "feature 2", "feature 3"],
    },
  ];

  const currentPlan = getCurrentPlan();

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
      <div className="bg-secondary rounded-lg p-6 w-[800px] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold">Manage your subscription</h2>
          <button
            onClick={onClose}
            className="text-neutral-dark hover:text-primary"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-6">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              name={plan.name}
              price={plan.price}
              features={plan.features}
              isCurrentPlan={
                currentPlan.toLowerCase() === plan.name.toLowerCase()
              }
              onSubscribe={() => handleSubscribe(plan.id)}
              isLoading={isLoading}
              disableSubscribe={plan.id === 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
