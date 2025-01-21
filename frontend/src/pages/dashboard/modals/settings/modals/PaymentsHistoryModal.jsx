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

export function PaymentsHistoryModal({ onClose }) {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/billing/payments/`, {
          headers: {
            Authorization: `Bearer ${
              document.cookie.split("access_token=")[1]
            }`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPayments(data);
        } else {
          setError("Error fetching payment history");
        }
      } catch (error) {
        console.error("Error:", error);
        setError("Error fetching payment history");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
      <div className="bg-secondary rounded-lg p-6 w-[32rem]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-black">Payment History</h2>
          <button
            onClick={onClose}
            className="text-neutral-dark hover:text-primary"
          >
            ✕
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-4 text-primary">Loading...</div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : payments.length === 0 ? (
          <div className="text-neutral-dark text-center py-4">
            No payments found
          </div>
        ) : (
          <div className="space-y-3">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="border border-neutral rounded-lg p-4 space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-primary">
                      {payment.product_name}
                    </h3>
                    <span
                      className={`text-sm ${
                        payment.has_paid ? "text-green-600" : "text-yellow-600"
                      }`}
                    >
                      {payment.has_paid ? "Paid" : "Pending"}
                    </span>
                    <p className="text-sm text-neutral-dark mt-1">
                      {formatDate(payment.created_at)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-primary">
                      {payment.price} {payment.currency.toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
