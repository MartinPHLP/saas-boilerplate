import React from "react";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "../../../../../config";

function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function ManageSubscriptionModal({ onClose }) {
  const [subscription, setSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/billing/get-subscription/`,
          {
            headers: {
              Authorization: `Bearer ${
                document.cookie.split("access_token=")[1]
              }`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setSubscription(data.subscription);
        } else {
          setError("Error fetching subscription details");
        }
      } catch (error) {
        console.error("Error:", error);
        setError("Error fetching subscription details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  const handleCancelSubscription = async () => {
    if (!window.confirm("Are you sure you want to cancel your subscription?")) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/billing/cancel-subscription/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              document.cookie.split("access_token=")[1]
            }`,
          },
          body: JSON.stringify({
            subscription_id: subscription.subscription_id,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSubscription((prev) => ({
          ...prev,
          is_active: false,
          end_date: data.end_date,
        }));
        setSuccess(true);
      } else {
        setError("Failed to cancel subscription");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred while canceling the subscription");
    } finally {
      setIsLoading(false);
    }
  };

  const renderSubscriptionStatus = (subscription) => {
    if (!subscription.is_active) {
      return (
        <div className="text-colorb bg-colorc rounded-full px-3 py-1 text-sm">
          <p>Subscription cancelled</p>
          <p className="text-xs">
            Access until: {formatDate(subscription.end_date)}
          </p>
        </div>
      );
    }
    return (
      <div className="text-colora bg-colorc rounded-full px-3 py-1 text-sm">
        Active
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-colorc/30 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg border border-colorb/10 p-6 w-[32rem]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-colord">Manage Subscription</h2>
          <button
            onClick={onClose}
            className="text-colorb hover:text-colord transition-colors p-2"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-t-2 border-b-2 border-colora rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-500 rounded-md text-sm text-center">
              {error}
            </div>
          ) : success ? (
            <div className="p-4 bg-colorc text-colora rounded-md text-sm text-center">
              Subscription successfully cancelled. You will have access to
              premium features until {formatDate(subscription.end_date)}.
            </div>
          ) : !subscription ? (
            <div className="text-colorb text-center py-4">
              No active subscription found
            </div>
          ) : (
            <div className="space-y-4">
              <div className="border border-colorb/10 rounded-lg p-4 space-y-3 bg-white shadow-sm">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-colord">
                    {subscription.product_name}
                  </h3>
                  {renderSubscriptionStatus(subscription)}
                </div>
                <p className="text-sm text-colorb">
                  {subscription.price} € / {subscription.interval}
                </p>
                <p className="text-sm text-colorb">
                  {subscription.end_date
                    ? `Access until: ${formatDate(subscription.end_date)}`
                    : `Started on: ${formatDate(subscription.start_date)}`}
                </p>
              </div>
              {subscription.is_active && !subscription.end_date && (
                <div className="text-center">
                  <button
                    onClick={handleCancelSubscription}
                    className="px-6 py-3 bg-white text-red-500 border-2 border-red-500 rounded-md
                             hover:bg-red-50 transition-colors duration-200 font-medium
                             disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-t-2 border-b-2 border-red-500 rounded-full animate-spin"></div>
                        <span className="ml-2">Processing...</span>
                      </div>
                    ) : (
                      "Cancel Subscription"
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
