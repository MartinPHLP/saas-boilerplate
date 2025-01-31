import React from "react";

export function PlanCard({
  name,
  price,
  features,
  isCurrentPlan,
  onSubscribe,
  isLoading,
  disableSubscribe,
}) {
  return (
    <div
      className="border border-colorb/10 rounded-lg p-6 flex flex-col h-full
                    hover:shadow-md transition-all duration-200 bg-white"
    >
      <div className="mb-4">
        <h3 className="text-xl font-bold mb-2 text-colord">{name}</h3>
        <p className="text-3xl font-bold mb-1 text-colord">
          ${price}
          <span className="text-sm text-colorb ml-1">/month</span>
        </p>
      </div>

      <ul className="space-y-3 mb-6 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-colorb">
            <span className="mr-2 text-colora">•</span>
            {feature}
          </li>
        ))}
      </ul>

      <button
        onClick={onSubscribe}
        disabled={isCurrentPlan || isLoading || disableSubscribe}
        className={`w-full py-3 px-4 rounded-md transition-colors duration-200 font-medium ${
          isCurrentPlan
            ? "bg-colorc text-colora border-2 border-colora cursor-not-allowed"
            : disableSubscribe
            ? "bg-colorc text-colorb cursor-not-allowed"
            : isLoading
            ? "bg-colorc text-colorb cursor-wait"
            : "bg-colora text-white hover:bg-colorb"
        }`}
      >
        {isCurrentPlan
          ? "Current Plan"
          : disableSubscribe
          ? "Default Plan"
          : isLoading
          ? "Processing..."
          : "Subscribe"}
      </button>
    </div>
  );
}
