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
        <div className="text-yellow-600 text-sm">
          <p>Subscription cancelled</p>
          <p>Access until: {formatDate(subscription.end_date)}</p>
        </div>
      );
    }
    return <div className="text-green-600 text-sm">Active</div>;
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
      <div className="bg-secondary rounded-lg p-6 w-[32rem]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-black">Manage Subscription</h2>
          <button
            onClick={onClose}
            className="text-neutral-dark hover:text-primary"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-4 text-primary">Loading...</div>
          ) : error ? (
            <div className="text-red-500 text-center py-4">{error}</div>
          ) : success ? (
            <div className="text-green-600 text-center py-4">
              Subscription successfully cancelled. You will have access to
              premium features until {formatDate(subscription.end_date)}.
            </div>
          ) : !subscription ? (
            <div className="text-neutral-dark text-center py-4">
              No active subscription found
            </div>
          ) : (
            <div className="space-y-4">
              <div className="border border-neutral rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-primary">
                    {subscription.product_name}
                  </h3>
                  {renderSubscriptionStatus(subscription)}
                </div>
                <p className="text-sm text-neutral-dark">
                  {subscription.price} € / {subscription.interval}
                </p>
                <p className="text-sm text-neutral-dark">
                  {subscription.end_date
                    ? `Access until: ${formatDate(subscription.end_date)}`
                    : `Started on: ${formatDate(subscription.start_date)}`}
                </p>
              </div>
              {subscription.is_active && !subscription.end_date && (
                <div className="text-center">
                  <button
                    onClick={handleCancelSubscription}
                    className="px-4 py-2 text-secondary bg-primary border border-primary rounded-md hover:bg-primary-hover"
                    disabled={isLoading}
                  >
                    Cancel Subscription
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
